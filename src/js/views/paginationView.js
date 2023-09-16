import View from './View';
import icons from 'url:../../img/icons.svg';
import { RES_PER_PAGE } from '../config';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const paginationBtn = e?.target.closest('.btn--inline');
      if (paginationBtn && paginationBtn.classList.contains('btn--inline')) {
        handler(paginationBtn);
      }
    });
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(this._data.results.length / RES_PER_PAGE);

    // Page 1 , and there are no other pages
    if (currPage === 1 && numPages === 1) {
      return ``; // when the results count is less than or equal to 10, then we don't need pagination at all.
    }

    return this.generatePaginationMarkup(currPage, numPages);
  }

  generatePaginationMarkup(currPage, numPages) {
    const prevBtn = `<button class="btn--inline pagination__btn--prev">
           <svg class="search__icon">
           <use href="${icons}#icon-arrow-left"></use>
           </svg>
           <span>Page ${currPage - 1}</span>
         </button>`;

    const nextBtn = `
       <button class="btn--inline pagination__btn--next">
        <span>Page ${currPage + 1}</span>
             <svg class="search__icon"> 
                   <use href="${icons}#icon-arrow-right"></use>
            </svg>   
    </button>
    `;

    // Page 1 , and there are other pages
    if (currPage === 1 && numPages > 1) {
      return nextBtn;
    }

    // Last page
    if (currPage === numPages) {
      return prevBtn;
    }

    // other page
    return prevBtn + '  ' + nextBtn;
  }
}

export default new PaginationView();
