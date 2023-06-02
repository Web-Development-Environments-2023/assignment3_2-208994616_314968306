var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");
const search_utils = require("./utils/search_utils");


/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.username) {
    DButils.execQuery("SELECT username FROM users").then((users) => {
      if (users.find((x) => x.username === req.session.username)) {
        req.username = req.session.username;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/addToFavorites', async (req,res,next) => {
  try{
    const username = req.session.username;
    const recipeID = req.body.recipeId;
    await user_utils.markAsFavorite(username, recipeID);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/getFavorites', async (req,res,next) => {
  console.log("saar")
  try{
    const username = req.session.username;
    // let favorite_recipes = {};
    const recipe_ids_dict = await user_utils.getFavoriteRecipes(username);
    let recipe_ids_array = [];
    recipe_ids_dict.map((element) => recipe_ids_array.push(element.recipeID)); //extracting the recipe ids into array
    const results = await recipe_utils.arrayOfIdToPreviewRecipes(recipe_ids_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

/**
 * This path gets body with recipeId and save this recipe in the watched list of the logged-in user
 */
router.post('/addToWatched', async (req,res,next) => {
  try{
    const username = req.session.username;
    const recipeID = req.body.recipeId;
    await user_utils.markAsWatched(username, recipeID);
    res.status(200).send("The Recipe successfully saved as watched");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the last viewed watched recipes by the logged-in user
 */
router.get('/threeLastWatchedRecipes', async (req,res,next) => {
  try{
    const username = req.session.username;
    const recipe_ids_dict = await user_utils.getWatchedRecipes(username);
    let recipes_id_array = [];
    recipe_ids_dict.map((element) => recipes_id_array.push(element.recipeID)); //extracting the recipe ids into array
    recipes_id_array = recipes_id_array.slice(0, 3);
    const results = await recipe_utils.arrayOfIdToPreviewRecipes(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

router.post("/addNewRecipe", async (req, res, next) => {
  try {
      const new_recipe = await recipe_utils.addNewRecipe(req.session.username,req.body);
      res.status(200).send(new_recipe); // TODO FIX ERROR HERE - Probably wrong send type
  } catch (error) {
      next(error);
  }
});

/**
 * Search for recipes from spooncular API
 */
router.get("/search", async (req, res, next) => {
  try {
    const recipes = await search_utils.searchRecipes(req.query);

    if (recipes.length == 0) {
      throw { status: 404, message: "No recipes found" };
    }

    const results = await search_utils.getPreviewRecipes(recipes);

    res.status(200).send(results);

  } catch (error) {
    next({ status: 400, message: "Request failed" });
  }
});


module.exports = router;
