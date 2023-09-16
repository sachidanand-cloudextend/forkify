import { BaseView } from './baseView';

class SearchView extends BaseView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }

  #clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault(); // in case of form submit event, we need to prevent the default behaviour otherwhise it will reload the page
      handler();
    });
  }
}

export default new SearchView();
