const LOAD = 'booktrackr/cover/LOAD';
const LOAD_SUCCESS = 'booktrackr/cover/LOAD_SUCCESS';
const LOAD_FAIL = 'booktrackr/cover/LOAD_FAIL';
const ADD = 'booktrackr/cover/LOGIN';
const ADD_SUCCESS = 'booktrackr/cover/LOGIN_SUCCESS';
const ADD_FAIL = 'booktrackr/cover/ADD_FAIL';

const initialState = {
  loaded: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      const loadCovers = state.covers || {};
      loadCovers[action.result.id] = action.result;

      return {
        ...state,
        loading: false,
        loaded: true,
        covers: loadCovers
      };

    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: { msg: action.error.message, stack: action.error.stack }
      };

    case ADD:
      return {
        ...state,
        adding: true
      };

    case ADD_SUCCESS:
      const addCovers = state.covers || {};
      addCovers[action.result.id] = action.result;

      return {
        ...state,
        adding: false,
        covers: addCovers
      };

    case ADD_FAIL:
      console.log(action);
      return {
        ...state,
        adding: false,
        addError: { msg: action.error.message, stack: action.error.stack }
      };

    default:
      return state;
  }
}

export function upload(file, next) {
  return {
    types: [ADD, ADD_SUCCESS, ADD_FAIL],
    promise: (client) => client.post('media', { wp: true, files: {file: file} }).then(next)
  };
}
