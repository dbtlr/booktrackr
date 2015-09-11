const LOAD = 'booktrackr/books/LOAD';
const LOAD_SUCCESS = 'booktrackr/books/LOAD_SUCCESS';
const LOAD_FAIL = 'booktrackr/books/LOAD_FAIL';
const SAVE = 'booktrackr/books/SAVE';
const SAVE_SUCCESS = 'booktrackr/books/SAVE_SUCCESS';
const SAVE_FAIL = 'booktrackr/books/SAVE_FAIL';

const initialState = {
  loaded: false,
  editing: {},
  saveError: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        error: action.error
      };
    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      const data = [...state.data];
      data[action.result.id - 1] = action.result;
      return {
        ...state,
        data: data,
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
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.books && globalState.books.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/book')
  };
}

export function save(book) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: book.id,
    promise: (client) => client.put('/book/' + book.id, { data: book })
  };
}

export function getOne(bookSlug) {
  return {

  };
}

export function add(book) {
  const data = {
    title: book.title,
    status: 'publish',
    content: JSON.stringify(book)
  }

  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: (client) => client.post('books', { data: data, wp: true }).then((result) => {console.log(result); return result;})
  };
}