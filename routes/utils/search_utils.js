const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const DButils = require("./DButils");


async function searchRecipes({query, quantity, cuisine, diet, intolerances}) {
    let finalQuantity;
    if (quantity != 5 && quantity != 10 && quantity != 15) {
    finalQuantity = 5;
    }
    else{
        finalQuantity = quantity;
    }

    const recipes = await axios.get(`${api_domain}/complexSearch`, {
        params: {
            query: query,
            number: finalQuantity,
            cuisine: cuisine,
            diet: diet,
            intolerances: intolerances,
            instructionsRequired: true,
            addRecipeInformation: true,
            apiKey: process.env.spooncular_apiKey
        }
    });

    return recipes.data.results;
}

async function getPreviewRecipesFromSearch(arrayRecipes) {
    const arrayPreviewRecipes = arrayRecipes.map(recipe => {
        return {
            id: recipe.id,
            title: recipe.title,
            readyInMinutes: recipe.readyInMinutes,
            image: recipe.image,
            aggregateLikes: recipe.aggregateLikes,
            vegan: recipe.vegan,
            vegetarian: recipe.vegetarian,
            glutenFree: recipe.glutenFree,
            favorite: false,
            watched: false
        };
    });

    return arrayPreviewRecipes;
}

exports.searchRecipes = searchRecipes;
exports.getPreviewRecipesFromSearch = getPreviewRecipesFromSearch;
