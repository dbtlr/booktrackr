import * as helper from '../utils/Helper';
import * as coverActions from './cover'
import * as bookActions from './book'

const LOAD = 'booktrackr/bookList/LOAD';
const LOAD_SUCCESS = 'booktrackr/bookList/LOAD_SUCCESS';
const LOAD_FAIL = 'booktrackr/bookList/LOAD_FAIL';

const initialState = {
  loading: false,
  error: {},
  bookList: [],
  nextPage: 1,
  hasMorePages: true,
};

export function filterBooks(books) {
  let newBooks = [];

  if (typeof books.length == 'undefined') {
    books = [books];
  }

  books.map(item => newBooks.push(bookActions.formatBook(item)));

  return newBooks;
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        bookList: {...state.bookList, ...action.result},
        nextPage: state.nextPage + 1,
        hasMorePages: action.result.length > 0,
        error: null,
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        error: { msg: action.error.message, stack: action.error.stack },
      };
    default:
      return state;
  }
}

export function isListLoaded(state) {
  return state.bookList && state.bookList.bookList > 0;
}

export function loadList(page = 1) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('books', { params: { '_embed': 1, per_page: 20, page: page }, wp: true }).then(filterBooks),
  };
}
