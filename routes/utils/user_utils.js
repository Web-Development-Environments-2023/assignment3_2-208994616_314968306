const DButils = require("./DButils");

async function markAsFavorite(username, recipeID){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${username}',${recipeID})`);
}

async function getFavoriteRecipes(username){
    const recipeID_array = await DButils.execQuery(`select recipeID from FavoriteRecipes where username='${username}'`);
    return recipeID_array;
}

async function markAsWatched(username, recipe_id){
    await DButils.execQuery(`INSERT INTO LastWatchedRecipes (username, recipe_id) VALUES ('${username}','${recipe_id}')`);
}

async function getWatchedRecipes(username){
    return await DButils.execQuery(`select recipe_id from LastWatchedRecipes where username='${username}' order by time DESC`);
}



exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsWatched = markAsWatched;
exports.getWatchedRecipes = getWatchedRecipes;
