import { combineReducers } from 'redux';

import auth from './auth';
import books from './books';

export default combineReducers({
  auth,
  books
});
