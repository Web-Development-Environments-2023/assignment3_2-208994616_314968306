var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

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
router.post('/AddToFavorites', async (req,res,next) => {
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
    console.log("recipes_id_array" + recipe_ids_dict)
    let recipe_ids_array = [];
    recipe_ids_dict.map((element) => recipe_ids_array.push(element.recipeID)); //extracting the recipe ids into array
    const results = await recipe_utils.arrayOfIdToPreviewRecipes(recipe_ids_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

/**
 * This path returns the last viewed watched recipes by the logged-in user
 */
router.get('/ThreeLastWatchedRecipes', async (req,res,next) => {
  try{
    const username = req.session.username;
    const recipes_id = await user_utils.getWatchedRecipes(username);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    recipes_id_array = recipes_id_array.slice(0, 3);
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});




module.exports = router;
