const DButils = require("./DButils");

async function markAsFavorite(username, recipeID){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${username}',${recipeID})`);
}

async function getFavoriteRecipes(username){
    const recipeID_array = await DButils.execQuery(`select recipeID from FavoriteRecipes where username='${username}'`);
    return recipeID_array;
}



exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
