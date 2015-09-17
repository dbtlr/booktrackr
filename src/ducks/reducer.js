import { combineReducers } from 'redux';

import api from './api';
import auth from './auth';
import book from './book';
import bookList from './book-list';
import cover from './cover';
import comments from './comments';
import tags from './tags';
import reviews from './reviews';
import highlights from './highlights';

export default combineReducers({
  api,
  auth,
  book,
  bookList,
  cover,
  comments,
  tags,
  reviews,
  highlights,
});
