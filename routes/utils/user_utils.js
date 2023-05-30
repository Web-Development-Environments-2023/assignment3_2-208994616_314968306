const DButils = require("./DButils");

async function markAsFavorite(username, recipeID){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${username}',${recipeID})`);
}

async function getFavoriteRecipes(username){
    const recipeID_array = await DButils.execQuery(`select recipeID from FavoriteRecipes where username='${username}'`);
    return recipeID_array;
}

async function markAsWatched(username, recipeID){
    await DButils.execQuery(`INSERT INTO WatchedRecipes (username, recipeID) VALUES ('${username}','${recipeID}')`);
}

async function getWatchedRecipes(username){
    return await DButils.execQuery(`select recipeID from WatchedRecipes where username='${username}' order by creation_time DESC`);
}



exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsWatched = markAsWatched;
exports.getWatchedRecipes = getWatchedRecipes;
