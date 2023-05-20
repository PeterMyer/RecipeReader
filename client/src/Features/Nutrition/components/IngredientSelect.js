import React from 'react';
import Select from 'react-select';
import { sumIngredientNutrition } from '../utils/sumIngredientNutrition';
import { calculateIngredientNutrition } from '../utils/calculateIngredientNutrition';
import { buildSelectOptions } from '../utils/buildSelectOptions';
import { filterNutrientValues } from '../utils';

export function IngredientSelect({
  allUsdaOptions,
  recipeNutrition,
  ingredientName,
  setRecipeNutrition,
}) {
  const options = buildSelectOptions(allUsdaOptions);

  const handleChange = (event) => {
    const recipeNutritionCopy = { ...recipeNutrition };
    recipeNutritionCopy.ingredients[ingredientName].matchedIndex = event.value;
    recipeNutritionCopy.ingredients[ingredientName].matchedIndexItem =
      allUsdaOptions[event.value];

    let currentFood =
      recipeNutritionCopy.ingredients[ingredientName].matchedIndexItem;

    let nutritionValues = currentFood.fdcId
      ? filterNutrientValues(currentFood.nutrition)
      : JSON.parse(currentFood.nutrition);

    console.log('nutritionValues', nutritionValues);
    recipeNutritionCopy.ingredients[ingredientName].nurtritionPer100G = {
      ...nutritionValues,
    };
    recipeNutritionCopy.ingredients[ingredientName].ingredientNutrition =
      calculateIngredientNutrition(
        recipeNutritionCopy.ingredients[ingredientName].recipeData,
        recipeNutritionCopy.ingredients[ingredientName].nurtritionPer100G,
        recipeNutritionCopy.ingredients[ingredientName].matchedIndexItem,
        recipeNutritionCopy.servings
      );

    recipeNutritionCopy.totalNutrition =
      sumIngredientNutrition(recipeNutrition);
    setRecipeNutrition(recipeNutritionCopy);
  };

  return (
    <Select
      options={options}
      defaultValue={options[0]}
      onChange={handleChange}
    />
  );
}
