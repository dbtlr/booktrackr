import * as helper from '../utils/Helper';
import * as bookActions from './book';

const SAVE = 'booktrackr/reviews/SAVE';
const SAVE_SUCCESS = 'booktrackr/reviews/SAVE_SUCCESS';
const SAVE_FAIL = 'booktrackr/reviews/SAVE_FAIL';
const ADD = 'booktrackr/reviews/ADD';
const ADD_SUCCESS = 'booktrackr/reviews/ADD_SUCCESS';
const ADD_FAIL = 'booktrackr/reviews/ADD_FAIL';
const DELETE = 'booktrackr/reviews/DELETE';
const DELETE_SUCCESS = 'booktrackr/reviews/DELETE_SUCCESS';
const DELETE_FAIL = 'booktrackr/reviews/DELETE_FAIL';
const LIKE = 'booktrackr/reviews/LIKE';
const LIKE_SUCCESS = 'booktrackr/reviews/LIKE_SUCCESS';
const LIKE_FAIL = 'booktrackr/reviews/LIKE_FAIL';

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


export function addReview(review, rating, book) {
  let meta = book.meta;
  meta.reviews = meta.reviews || [];
  meta.reviews.push({
    id: helper.generateUUID(),
    text: review,
    rating: rating,
    likes: [],
    createdDate: new Date(),
  });

  return {
    types: [ADD, ADD_SUCCESS, ADD_FAIL],
    id: book.id,
    promise: bookActions.saveMetaPromise(book, meta),
  };
}

export function updateReview(id, review, rating, book) {
  let meta = book.meta;
  meta.reviews = meta.reviews || [];

  for (let i in meta.reviews) {
    if (meta.reviews[i].id === id) {
      meta.reviews[i].text = review;
      meta.reviews[i].rating = rating;
      meta.reviews[i].updatedDate = new Date();
      break;
    }
  }

  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: book.id,
    promise: bookActions.saveMetaPromise(book, meta),
  };
}

export function likeReview(id, book) {
  let meta = book.meta;
  meta.reviews = meta.reviews || [];

  for (let i in meta.reviews) {
    if (meta.reviews[i].id === id) {
      meta.reviews[i].like = meta.reviews[i].like || [];
      meta.reviews[i].like.push({
        date: new Date(),
      });
      break;
    }
  }

  return {
    types: [LIKE, SAVE_SUCCESS, SAVE_FAIL],
    id: book.id,
    promise: bookActions.saveMetaPromise(book, meta),
  };
}

export function deleteReview(id, book, next) {
  let meta = book.meta;
  let newReviews = [];

  meta.reviews = meta.reviews || [];

  for (let i in meta.reviews) {
    if (meta.reviews[i].id !== id) {
      newReviews.push(meta.reviews[i]);
    }
  }

  meta.reviews = newReviews;

  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: book.id,
    promise: bookActions.saveMetaPromise(book, meta),
  };
}
