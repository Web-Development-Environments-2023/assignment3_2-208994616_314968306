const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const api_domain_random = api_domain + "/random";
const DButils = require("./DButils");



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */

/////////////////////////////////////////// Get Recipe by id
async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRecipePreview(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    return await fullToPreviewRecipe(recipe_info.data);
}

/////////////////////////////////////////// Three Random Recipes
async function getThreeRandomRecipes() {
    const response = await axios.get(`${api_domain_random}`, {
        params: {
            number: 10,
            apiKey: process.env.spooncular_apiKey
        }
    });
    let filterd_recipes = response.data.recipes.filter((recipe) => filterRecipes(recipe));
    if (filterd_recipes < 3 ) {
        return getThreeRandomRecipes();
    }
    filterd_recipes = filterd_recipes.slice(0, 3);
    let random_recipes = [];
    for(let fullRecipe of filterd_recipes){
        random_recipes.push(fullToPreviewRecipe(fullRecipe));
    }
    return random_recipes;
}

function filterRecipes(recipe) {
    return (recipe.instructions != "") && (recipe.image && recipe.image != "");
}

async function addNewRecipe(username, recipe) {
    try {
        const query = `INSERT INTO UserRecipes (username, RecipeImg, RecipeName, CookingTime, Likes, GlutenFree, isVegan, isVegetarian, ingredients, instructions, servings)
                   VALUES ('${username}', '${recipe.RecipeImg}', '${recipe.RecipeName}', ${recipe.CookingTime}
                   , ${recipe.GlutenFree}, ${recipe.isVegan}, ${recipe.isVegetarian}
                   , '${recipe.ingredients}', '${recipe.instructions}', ${recipe.servings})`;

        const result = await DButils.execQuery(query);
        // Might need to change the out to be Full recipe
        const out = {
            id: result.insertId,
            title: recipe.RecipeName,
            readyInMinutes: recipe.CookingTime,
            image: recipe.RecipeImg,
            popularity: 0,
            vegan: recipe.isVegan,
            vegetarian: recipe.isVegetarian,
            glutenFree: recipe.GlutenFree
        };
        return out; // Returns preview recipe but not utilized
        } catch (error) {
            console.error('Error adding new recipe:', error);
            throw error;
        }
}
async function getCreatedRecipes(username){
    const fullrecipes_array = await DButils.execQuery(`select * from UserRecipes where username='${username}'`);
    recipes_array = []
    fullrecipes_array.forEach(element => {
        let { recipeID, RecipeName, CookingTime, RecipeImg
            , isVegan, isVegetarian, GlutenFree } = element;
        preview_recipe = {
                id: recipeID,
                title: RecipeName,
                readyInMinutes: CookingTime,
                image: RecipeImg,
                popularity: 0,
                vegan: convertIntToBoolean(isVegan),
                vegetarian: convertIntToBoolean(isVegetarian),
                glutenFree: convertIntToBoolean(GlutenFree) 
        }
        recipes_array.push(preview_recipe);
    });  
    return recipes_array
}

/////////////////////////////////////////// Helping functions
function fullToPreviewRecipe(fullRecipe) {
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = fullRecipe;
    preview_recipe = {
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            image: image,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree
    };
    return preview_recipe;
}

async function arrayOfIdToPreviewRecipes(recipes_id_array) {
    res = []
    for(let recipe_id of recipes_id_array){
        res.push(await getRecipePreview(recipe_id));
    }
    return res;
}

function convertIntToBoolean (num) {
    if (num === 1) 
        return true;
    else if (num === 0) 
        return false;
    else
        throw new Error("Invalid input. Expected 0 or 1.");
}


/////////////////////////////////////////// Exports
exports.getRecipeDetails = getRecipePreview;
exports.getThreeRandomRecipes = getThreeRandomRecipes;
exports.arrayOfIdToPreviewRecipes = arrayOfIdToPreviewRecipes;
exports.addNewRecipe = addNewRecipe;
exports.getCreatedRecipes = getCreatedRecipes;