import { API_URL, KEY, RECIPE_BOOKMARK_KEY, RES_PER_PAGE } from './config';
import { AJAX } from './helper';
import recipeView from './views/recipeView';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookMarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    imageUrl: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    bookMarked: false,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookMarks.some(rec => rec.id === id))
      state.recipe.bookMarked = true;
  } catch (error) {
    console.error(`Error occurred while fetching the recipe ${error.message}`);
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  state.search.query = query;
  try {
    const recipies = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = recipies.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        publisher: recipe.publisher,
        title: recipe.title,
        imageUrl: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (error) {
    console.error(`Error occurred while searching the recipe ${error}`);
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

export const addBookMark = function (recipe) {
  state.bookMarks.push(recipe);

  if (state.recipe.id === recipe.id) state.recipe.bookMarked = true;
  persistBookMarks();
};

export const deleteBookMark = function (id) {
  const index = state.bookMarks.findIndex(bookMark => bookMark.id === id);
  if (index !== -1) {
    state.bookMarks.splice(index, 1);
    state.recipe.bookMarked = false;
  }
};

export const persistBookMarks = function () {
  localStorage.setItem(RECIPE_BOOKMARK_KEY, JSON.stringify(state.bookMarks));
};

export const initializeBookMarks = function () {
  const bookMarkedRecipes = JSON.parse(
    localStorage.getItem(RECIPE_BOOKMARK_KEY)
  );
  if (bookMarkedRecipes) {
    state.bookMarks = bookMarkedRecipes;
  }
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(([_, ing]) => {
        const ingArr = ing.replaceAll(' ', '').split(',');
        if (ingArr.length !== 3) {
          throw new Error(
            'Wrong ingredient format! Please use the correct format'
          );
        }
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
  } catch (error) {
    throw error;
  }
};
