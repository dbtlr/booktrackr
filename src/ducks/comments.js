
const ADD = 'booktrackr/comments/ADD';
const ADD_SUCCESS = 'booktrackr/comments/ADD_SUCCESS';
const ADD_FAIL = 'booktrackr/comments/ADD_FAIL';
const LOAD = 'booktrackr/comments/LOAD';
const LOAD_SUCCESS = 'booktrackr/comments/LOAD_SUCCESS';
const LOAD_FAIL = 'booktrackr/comments/LOAD_FAIL';

const initialState = {
  loaded: false,
  editing: {},
  saveError: {},
  comments: {},
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOAD_SUCCESS:
      let loadComments = state.comments || {};

      if (action.result[0]) {
        loadComments[action.result[0].post] = action.result;
      }

      return {
        ...state,
        comments: loadComments,
        loading: false,
        error: null,
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        error: { msg: action.error.message, stack: action.error.stack },
      };
    case ADD:
      return {
        ...state,
        adding: true,
        error: null,
      };
    case ADD_SUCCESS:
      let addComments = state.comments || {};

      if (!addComments[action.result.post]) {
        addComments[action.result.post] = [];
      }

      addComments[action.result.post].unshift(action.result);

      return {
        ...state,
        comments: addComments,
        adding: false,
        error: null,
      };
    case ADD_FAIL:
      return {
        ...state,
        adding: false,
        error: { msg: action.error.message, stack: action.error.stack },
      };
    default:
      return state;
  }
}

export function load(bookId) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/comments', { params: { post: bookId }, wp: true }),
  };
}

export function areLoaded(state, bookId) {
  return state.comments && state.comments.comments && state.comments.comments[bookId];
}

export function addComment(comment, next) {
  return {
    types: [ADD, ADD_SUCCESS, ADD_FAIL],
    promise: (client) => client.post('/comments', { data: comment, wp: true }).then(next),
  };
}
