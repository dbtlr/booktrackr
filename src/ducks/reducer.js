import { combineReducers } from 'redux';

import api from './api';
import auth from './auth';
import books from './books';
import cover from './cover';
import comments from './comments';
import tags from './tags';

export default combineReducers({
  api,
  auth,
  books,
  cover,
  comments,
  tags
});
