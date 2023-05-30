const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const api_domain_random = api_domain + "/random";



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


/////////////////////////////////////////// Exports
exports.getRecipeDetails = getRecipePreview;
exports.getThreeRandomRecipes = getThreeRandomRecipes;
exports.arrayOfIdToPreviewRecipes = arrayOfIdToPreviewRecipes;