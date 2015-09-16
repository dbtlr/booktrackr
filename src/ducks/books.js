import * as helper from '../utils/Helper';
import * as coverActions from './cover'

const LOAD = 'booktrackr/books/LOAD';
const LOAD_ONE = 'booktrackr/books/LOAD_ONE';
const LOAD_SUCCESS = 'booktrackr/books/LOAD_SUCCESS';
const LOAD_FAIL = 'booktrackr/books/LOAD_FAIL';
const SAVE = 'booktrackr/books/SAVE';
const SAVE_SUCCESS = 'booktrackr/books/SAVE_SUCCESS';
const SAVE_FAIL = 'booktrackr/books/SAVE_FAIL';
const ADD = 'booktrackr/books/ADD';
const ADD_SUCCESS = 'booktrackr/books/ADD_SUCCESS';
const ADD_FAIL = 'booktrackr/books/ADD_FAIL';

const initialState = {
  loaded: false,
  editing: {},
  saveError: {},
  bookList: [],
  allBooks: [],
};

// Stole this from PHP.js, in order to combat the fact the WP turns on 
// magic_quotes by default. What is this, PHP 4? (sad panda...)
function stripslashes(str) {
  return (str + '')
    .replace(/\\(.?)/g, function(s, n1) {
      switch (n1) {
        case '\\':
          return '\\';
        case '0':
          return '\u0000';
        case '':
          return '';
        default:
          return n1;
      }
    });
}

function filterBooks(books) {
  let newBooks = [];

  if (!books.length) {
    books = [books];
  }

  books.map(function(item) {
    let book = {
      id: item.id,
      key: item.guid.raw,
      title: item.title.raw,
      slug: item.slug || null,
      meta: {},
      terms: {},
      genre: [],
      cover: ''
    };

    let meta = item._embedded['http://v2.wp-api.org/meta'];
    if (meta) {
      for (let key in meta[0]) {
        if (meta[0][key].key == 'data') {
          book.meta = JSON.parse(stripslashes(meta[0][key].value));
        }
      }
    }

    let attachment = item._embedded['http://v2.wp-api.org/attachment'];
    if (attachment) {
      for (let key in attachment[0]) {
        if (attachment[0][key].id == item.featured_image) {
          book.cover = attachment[0][key].source_url;
          break;
        }
      }
    }

    let terms = item._embedded['http://v2.wp-api.org/term'];
    if (terms) {
      book.terms = terms;
      for (let key in terms[0]) {
          book.genre.push(terms[0][key].name);
      }
    }

    newBooks.push(book);
  });

  return newBooks;
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_ONE:
      return {
        ...state,
        loadingOne: true
      };
    case LOAD_SUCCESS:
      const bookList = state.bookList || [];
      const allBooks = state.allBooks || {};

      let loadedList = state.loadedList || false;

      // Make sure this can handle single results as well.
      if (typeof action.result.map == 'undefined') {
        action.result = [action.result];
      }

      action.result.map(function(book) {

        allBooks[book.id] = book;

        if (!state.loadingOne) {
          bookList.push(book);
          loadedList = true;
        }
      });

      return {
        ...state,
        loading: false,
        loadingOne: false,
        loaded: true,
        loadedList: loadedList,
        allBooks: allBooks,
        bookList: bookList,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: { msg: action.error.message, stack: action.error.stack }
      };
    case SAVE:
      return state;
    case SAVE_SUCCESS:
      const save_data = [...state.data];
      save_data[action.result.id - 1] = action.result;
      return {
        ...state,
        data: save_data,
        editing: {
          ...state.editing,
          [action.id]: false
        },
        saveError: {
          ...state.saveError,
          [action.id]: null
        }
      };
    case SAVE_FAIL:
      return {
        ...state,
        saveError: {
          ...state.saveError,
          [action.id]: { msg: action.error.message, stack: action.error.stack }
        }
      };
    case ADD:
      return {
        ...state,
        adding: true,
        addErrors: []
      }; 
    case ADD_SUCCESS:
      return {
        ...state,
        adding: false,
        addErrors: []
      };
    case ADD_FAIL: 
      return {
        ...state,
        adding: false,
        addError: { msg: action.error.message, stack: action.error.stack }
      };
    default:
      return state;
  }
}

export function isBookLoaded(state, bookId) {
  return state.books && state.books.allBooks && state.books.allBooks[bookId];
}

export function isListLoaded(state) {
  return state.books && state.books.loadedList;
}

export function load(page = 1) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('books', { params: { '_embed': 1, per_page: 20, page: page }, wp: true }).then(filterBooks)
  };
}

export function loadOne(bookId) {
  return {
    types: [LOAD_ONE, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('books/' + bookId, { params: { '_embed': 1 }, wp: true }).then(filterBooks)
  };
}

export function save(book) {
  const data = {
    title: book.title,
    status: 'publish',
    content: JSON.stringify(book)
  }

  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: book.id,
    promise: (client) => client.put('books/' + book.id, { data: data, wp: true })
  };
}

export function getOne(state, bookId) {
  if (state.books && state.books.allBooks && state.books.allBooks[bookId]) {
    return state.books.allBooks[bookId];
  }
}

export function addReview(review, rating, book) {
  book.reviews = book.reviews || [];
  book.reviews.push({
    id: helper.generateUUID(),
    text: review,
    rating: rating,
    createdDate: new Date()
  });

  return save(book);
}

export function addHighlight(highlight, book) {
  book.highlights = book.highlights || [];
  book.highlights.push({
    id: helper.generateUUID(),
    text: highlight,
    createdDate: new Date()
  });
  return save(book);
}

export function add(book, next) {
  book.beganReadingDate = (new Date(book.beganReadingDate)).toUTCString();
  book.finishedReadingDate = (new Date(book.finishedReadingDate)).toUTCString();

  if (book.beganReadingDate == 'Invalid Date') book.beganReadingDate = '';
  if (book.finishedReadingDate == 'Invalid Date') book.finishedReadingDate = '';

  next = next || ((res) => {return res});

  const data = {
    title: book.title,
    status: 'publish',
    featured_image: book.cover ? book.cover.id : null
  }

  return {
    types: [ADD, ADD_SUCCESS, ADD_FAIL],
    promise: (client) => {
      return client.post('books', { data: data, wp: true })
        .then((res) => { client.post('books/' + res.id + '/meta', { data: { key: 'data', value: JSON.stringify(book)}, wp: true}); return res; })
        .then((res) => { book.tags.map(tagId => client.post('books/' + res.id + '/terms/genre/' + tagId, {data: {}, wp: true})); return res; })
        .then(next)
    }
  };
}