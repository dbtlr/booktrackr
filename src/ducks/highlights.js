import * as helper from '../utils/Helper';
import * as bookActions from './book';

const SAVE = 'booktrackr/highlights/SAVE';
const SAVE_SUCCESS = 'booktrackr/highlights/SAVE_SUCCESS';
const SAVE_FAIL = 'booktrackr/highlights/SAVE_FAIL';
const ADD = 'booktrackr/highlights/ADD';
const ADD_SUCCESS = 'booktrackr/highlights/ADD_SUCCESS';
const ADD_FAIL = 'booktrackr/highlights/ADD_FAIL';
const DELETE = 'booktrackr/highlights/DELETE';
const DELETE_SUCCESS = 'booktrackr/highlights/DELETE_SUCCESS';
const DELETE_FAIL = 'booktrackr/highlights/DELETE_FAIL';
const LIKE = 'booktrackr/highlights/LIKE';
const LIKE_SUCCESS = 'booktrackr/highlights/LIKE_SUCCESS';
const LIKE_FAIL = 'booktrackr/highlights/LIKE_FAIL';

const initialState = {
  saving: false,
  adding: false,
  deleting: false,
  error: null,
  response: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case DELETE:
      return {
        ...state,
        deleting: true,
      };
    case DELETE_SUCCESS:
      return {
        ...state,
        deleting: false,
        error: null,
      };
    case DELETE_FAIL:
      return {
        ...state,
        deleting: false,
        error: { msg: action.error.message, stack: action.error.stack },
      };
    case LIKE:
      return {
        ...state,
        deleting: true,
      };
    case LIKE_SUCCESS:
      return {
        ...state,
        deleting: false,
        error: null,
      };
    case LIKE_FAIL:
      return {
        ...state,
        deleting: false,
        error: { msg: action.error.message, stack: action.error.stack },
      };
    case SAVE:
      return {
        ...state,
        saving: true,
      };
    case SAVE_SUCCESS:
      return {
        ...state,
        response: action.result,
        saving: false,
        error: null
      };
    case SAVE_FAIL:
      return {
        ...state,
        response: action.result,
        saving: false,
        error: { msg: action.error.message, stack: action.error.stack },
      };
    case ADD:
      return {
        ...state,
        response: action.result,
        adding: true,
        error: [],
      };
    case ADD_SUCCESS:
      return {
        ...state,
        response: action.result,
        adding: false,
        error: [],
      };
    case ADD_FAIL:
      return {
        ...state,
        response: action.result,
        adding: false,
        error: { msg: action.error.message, stack: action.error.stack },
      };
    default:
      return state;
  }
}

export function addHighlight(highlight, book) {
  let meta = book.meta;
  meta.highlights = meta.highlights || [];
  meta.highlights.push({
    id: helper.generateUUID(),
    text: highlight,
    likes: [],
    createdDate: new Date(),
  });

  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: book.id,
    promise: bookActions.saveMetaPromise(book, meta),
  };
}

export function updateHighlight(id, highlight, book) {
  let meta = book.meta;
  meta.highlights = meta.highlights || [];

  for (let i in meta.highlights) {
    if (meta.highlights[i].id === id) {
      meta.highlights[i].text = highlight;
      meta.highlights[i].updatedDate = new Date();
      break;
    }
  }

  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: book.id,
    promise: bookActions.saveMetaPromise(book, meta),
  };
}

export function likeHighlight(id, book) {
  let meta = book.meta;
  meta.highlights = meta.highlights || [];

  for (let i in meta.highlights) {
    if (meta.highlights[i].id === id) {
      meta.highlights[i].like = meta.highlights[i].like || [];
      meta.highlights[i].like.push({
        date: new Date(),
      });
      break;
    }
  }

  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: book.id,
    promise: bookActions.saveMetaPromise(book, meta),
  };
}

export function deleteHighlight(id, book) {
  let meta = book.meta;
  let newHighLights = [];

  meta.highlights = meta.highlights || [];

  for (let i in meta.highlights) {
    if (meta.highlights[i].id !== id) {
      newHighLights.push(meta.highlights[i]);
    }
  }

  meta.highlights = newHighLights;

  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: book.id,
    promise: bookActions.saveMetaPromise(book, meta),
  };
}
