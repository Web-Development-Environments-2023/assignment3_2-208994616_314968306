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
    console.log("id = " + recipe_ids_dict[0]);
    let recipes_id_array = [];
    recipe_ids_dict.map((element) => recipes_id_array.push(element.recipeID)); //extracting the recipe ids into array
    recipes_id_array = recipes_id_array.slice(0, 3);
    console.log("id = " + recipes_id_array[0]);
    const results = await recipe_utils.arrayOfIdToPreviewRecipes(recipes_id_array);
    console.log("13")
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

/**
 * Search for recipes from spooncular API.
 */
router.post("/search/:query/:amount", async (req, res, next) => {
  const {query, amount} = req.params;
  //set serach params
  search_params = {};
  search_params.query = query;
  search_params.amount = amount;
  search_params.instructionsRequired = true;
  search_params.apiKey = process.env.spooncular_apiKey;

  //gives a default num
  if (num != 5 && num != 10 && num != 15) {
    search_params.number = 5;
  }
  //check if query params exists (cuisine / diet / intolerances) and add them to serach_params
  search_utils.extarctQueryParams(req.body, search_params);
  search_utils.searchForRecipes(search_params)
  .then((recipes) => res.send(recipes))
  .catch((err) => {
    next(err);
  })
});




module.exports = router;
