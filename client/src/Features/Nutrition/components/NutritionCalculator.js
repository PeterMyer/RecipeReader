import { useState, useEffect } from 'react';
import { calculateNutrition } from '../utils/calculateNutrition';
import { DisplayNutritionData } from './NutritionData';
import { lookupNutrition, getNutrition, saveNutrition } from '../api';
import { useLocation } from 'react-router-dom';
import { IngredientNutrition } from './IngredientNutrition';

export function NutritionCalculator() {
  const { state } = useLocation();
  const recipeId = state.recipeId;
  const servings = state.servings;
  const ingredients = state.ingredients;
  const [newNutrition, setNewNutrition] = useState(null);
  const [existingNutrition, setExistingNutrition] = useState(null);
  const [nutritionCalulated, toggleNutritionCalulated] = useState(false);
  const [USDANutrition, setUSDANutrition] = useState(null);

  const handleLookupNutrition = async (id) => {
    let nutrition = await lookupNutrition(id);
    setUSDANutrition(nutrition.data);
  };

  const handleCalculateNutrition = async () => {
    let recipeNutrition = calculateNutrition(
      ingredients,
      USDANutrition,
      servings
    );
    console.log('recipeNutrition:', recipeNutrition);
    toggleNutritionCalulated(true);
    setNewNutrition(recipeNutrition.totalNutrition);
  };

  const handleGetNurition = async (id) => {
    let response = await getNutrition(id);
    setExistingNutrition(JSON.parse(response.data.nutritionData));
  };

  const handleSaveNutrition = async (id, newNutrition) => {
    let nutritionPayload = {
      nutrition: JSON.stringify(newNutrition),
    };
    let response = await saveNutrition(id, nutritionPayload);
    setExistingNutrition(JSON.parse(response.data.nutritionData));
  };

  useEffect(() => {
    handleGetNurition(recipeId);
  }, []);

  return (
    <>
      {existingNutrition ? (
        <DisplayNutritionData nutrition={existingNutrition} />
      ) : (
        <div>
          {nutritionCalulated ? (
            <>
              <button
                onClick={() => handleSaveNutrition(recipeId, newNutrition)}
              >
                Save Nutrition
              </button>
              <button onClick={() => handleCalculateNutrition()}>
                calculateNutrition
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleLookupNutrition(recipeId)}>
                Get Nutrition
              </button>
              <button onClick={() => handleCalculateNutrition()}>
                calculateNutrition
              </button>
            </>
          )}
          {newNutrition ? (
            <div className="nutrition-calculator-refactor">
              <div>
                <IngredientNutrition ingredients={ingredients} />
              </div>
              <DisplayNutritionData nutrition={newNutrition} />
            </div>
          ) : // <DisplayNutritionData nutrition={newNutrition} />
          null}
        </div>
      )}
    </>
  );
}
