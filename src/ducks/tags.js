import * as helper from '../utils/Helper';

const LOAD = 'booktrackr/tags/LOAD';
const LOAD_SUCCESS = 'booktrackr/tags/LOAD_SUCCESS';
const LOAD_FAIL = 'booktrackr/tags/LOAD_FAIL';

const initialState = {
  loaded: false,
  editing: {},
  saveError: {},
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case LOAD_SUCCESS:
      let loadTags = state.tags || {};

      action.result.map(item => {
        loadTags[item.id] = item.name;
      });

      return {
        ...state,
        tags: loadTags,
        loading: false,
        loaded: true,
        error: null,
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: { msg: action.error.message, stack: action.error.stack },
      };
    default:
      return state;
  }
}

export function areTagsLoaded(globalState) {
  return globalState.tags && globalState.tags.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/wp/terms/genre', { params: {per_page: 100} }),
  };
}
