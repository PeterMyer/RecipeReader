const axios = require('axios');
const router = require('express').Router();
const {
  models: {
    Recipe,
    Component,
    Ingredient,
    MeasurementQuantity,
    MeasurementUnit,
    RecipeComment,
    RecipeNutrition,
  },
} = require('../db/index');
const FoodItemNutrition = require('../db/models/FoodItemNutrition');
const FoodItemNutritionMatch = require('../db/models/FoodItemNutritionMatch');

const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
});

router.post('/:id', async (req, res, next) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id, {
      include: [
        {
          model: Ingredient,
          attributes: ['id', 'normText'],
          include: [
            {
              model: Component,
              attributes: ['id', 'name'],
              include: [
                {
                  model: FoodItemNutritionMatch,
                  attributes: ['userId'],
                  include: [
                    {
                      model: FoodItemNutrition,
                      attributes: ['id', 'name', 'source', 'nutrition'],
                    },
                  ],
                },
              ],
            },
            {
              model: MeasurementQuantity,
              attributes: ['id', 'qtyAmount'],
            },
            {
              model: MeasurementUnit,
              attributes: ['id', 'unitDescription'],
            },
            {
              model: RecipeComment,
              attributes: ['id', 'commentText'],
            },
          ],
        },
      ],
    });

    //USDA API CALL
    const usdaResults = await Promise.all(
      recipe.ingredients.map(async (ingredient) => {
        console.log(ingredient);
        let params = {
          query: ingredient.component.name,
          dataType: ['Foundation', 'Survey (FNDDS)'],
          pageSize: 25,
          nutrients: [203],
        };
        let response = await apiClient.post(
          `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.foodDataCentralApiKey}`,
          params
        );
        // const result = {[response.data.foodSearchCriteria.query]: [...response.data.foods] };

        return response.data;
      })
    );
    res.json(usdaResults);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const nutrients = await RecipeNutrition.findOne({
      where: { recipeId: req.params.id },
    });
    res.send(nutrients);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
