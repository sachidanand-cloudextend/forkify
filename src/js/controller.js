import { MODAL_CLOSE_SEC } from './config.js';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}
const controlRecipes = async function () {
  try {
    model.initializeBookMarks();
    bookmarksView.render(model.state.bookMarks);
    const id = window.location.hash;
    if (!id) return;

    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookMarks);
    // Loading recipe
    recipeView.renderSpinner();
    await model.loadRecipe(id.slice(1));

    // 2) Rendering recipe

    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

//showRecipe();

const controlSearchResults = async function (e) {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();
    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage(1));
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};

const controlPaginationResults = async function (paginationBtn) {
  try {
    if (!paginationBtn) return;

    if (
      !paginationBtn.innerText ||
      paginationBtn.innerText.trim().length === 0 ||
      paginationBtn.innerText.split(' ').length === 0
    )
      return;

    const goToPageNum = +paginationBtn.innerText.split(' ')[1];
    resultsView.render(model.getSearchResultsPage(goToPageNum));
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  if (!model.state.recipe.bookMarked) model.addBookMark(model.state.recipe);
  else if (model.state.recipe.bookMarked) {
    model.deleteBookMark(model.state.recipe.id);
  }
  bookmarksView.render(model.state.bookMarks);
  model.persistBookMarks();
  recipeView.update(model.state.recipe);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // displaying successful message on recipe addition
    addRecipeView.renderMessage();

    // rendering newly added recipe
    recipeView.render(model.state.recipe);

    // render bookmark view
    bookmarksView.render(model.state.bookMarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    addRecipeView.renderError(error);
    throw error;
  }
};
// publisher - subscriber pattern
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookMark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPaginationResults);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
