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
  saveError: {}
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

// Stolen from Stack Overflow - http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function generateUUID(){
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
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

      // Make sure this can handle single results as well.
      if (typeof action.result.map == 'undefined') {
        action.result = [action.result];
      }

      action.result.map(function(item) { 
        if (!item.content || !item.content.raw || item.content.raw.length == 0) {
          return;
        }

        let data = JSON.parse(stripslashes(item.content.raw));

        let book = {
          id: item.id,
          key: item.guid,
          title: data.title,
          author: data.author || null,
          beganReadingDate: data.beganReadingDate,
          finishedReadingDate: data.finishedReadingDate,
          status: data.status || null,
          reviews: data.reviews || null,
          highlights: data.highlights || null,
          visibility: data.visibility || null,
          slug: item.slug || null
        };

        allBooks[item.id] = book;

        if (!state.loadingOne) {
          bookList.push(book);
        }
      });

      return {
        ...state,
        loading: false,
        loadingOne: false,
        loaded: true,
        allBooks: allBooks,
        bookList: bookList,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
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
          [action.id]: action.error
        }
      };
    case ADD:
      return {
        ...state,
        adding: true,
        addErrors: []
      }; 
    case ADD_SUCCESS:
      const add_data = [...state.data];
      add_data[action.result.id - 1] = action.result;
      return {
        data: add_data,
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

export function isLoaded(state) {
  return state.books && state.books.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/books', { wp: true })
  };
}

export function loadOne(bookId) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/books/' + bookId, { wp: true })
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
    promise: (client) => client.put('/books/' + book.id, { data: data, wp: true })
  };
}

export function getOne(state, bookId) {
  if (state.books && state.books.allBooks && state.books.allBooks[bookId]) {
    return state.books.allBooks[bookId];
  }
}

export function addReview(review, book) {
  book.reviews = book.reviews || [];
  book.reviews.push({
    id: generateUUID(),
    text: review,
    createdDate: new Date()
  });

  return save(book);
}

export function addHighlight(highlight, book) {
  book.highlights = book.highlights || [];
  book.highlights.push({
    id: generateUUID(),
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
    content: JSON.stringify(book)
  }

  return {
    types: [ADD, ADD_SUCCESS, ADD_FAIL],
    promise: (client) => client.post('books', { data: data, wp: true }).then(next)
  };
}