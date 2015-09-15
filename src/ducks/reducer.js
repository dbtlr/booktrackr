import { combineReducers } from 'redux';

import api from './api';
import auth from './auth';
import books from './books';
import cover from './cover';
import comments from './comments';

export default combineReducers({
  api,
  auth,
  books,
  cover,
  comments
});
