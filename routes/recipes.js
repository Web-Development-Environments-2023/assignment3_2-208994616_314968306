var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a full details of 3 random recipes
 */
router.get("/getThreeRandomRecipes", async (req, res, next) => {
  console.log("liorrrr");
  try {
    let random_3_recipes = await recipes_utils.getThreeRandomRecipes();
    console.log("random_3_recipes = " + random_3_recipes);
    res.send(random_3_recipes);
  } catch(error) {
    next(error);
  }
});

module.exports = router;
