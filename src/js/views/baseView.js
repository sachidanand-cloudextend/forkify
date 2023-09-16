import icons from 'url:../../img/icons.svg';

export class BaseView {
  #parentElement;
  #data;

  constructor(parentElement) {
    this.#parentElement = parentElement;
  }

  clear() {
    this.#parentElement.innerHTML = '';
  }

  render(markUp) {
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  #clear() {
    this.#parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markUp = `
      <div class="spinner">
      <svg>
      <use href="${icons}#icon-loader"></use>
      </svg>
      </div>
    `;

    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markUp);
  }
}
