import React from 'react';
import {Route} from 'react-router';
import App from 'views/App';
import Books from 'views/Books';
import Login from 'views/Login';
import Register from 'views/Register';
import LoginAuthorize from 'views/LoginAuthorize';
import RequireLogin from 'views/RequireLogin';
import RequireAuthorized from 'views/RequireAuthorized';
import EditBook from 'views/EditBook';
import EditReview from 'views/EditReview';
import EditHighlight from 'views/EditHighlight';
import NotFound from 'views/NotFound';
import BookPage from 'views/BookPage';

export default function(store) {
  return (
    <Route component={App}>
      <Route name='books' path='/' component={Books} />
      <Route name='single-book' path='/book/:bookId' component={BookPage} />
      <Route name='login' path='/login' component={Login} />
      <Route name='register' path='/register' component={Register} />
      <Route component={RequireLogin} onEnter={RequireLogin.onEnter(store)}>
        <Route name='login-auth' path='/login/authorize' component={LoginAuthorize} />

        <Route component={RequireAuthorized} onEnter={RequireAuthorized.onEnter(store)}>
          <Route name='book-add' path='/add-book' component={EditBook} />
          <Route name='book-edit' path='/book/:bookId/edit' component={EditBook} />
          <Route name='review-add' path='/book/:bookId/review(/:reviewId)' component={EditReview} />
          <Route name='highlight-add' path='/book/:bookId/highlight(/:highlightId)' component={EditHighlight} />
        </Route>
      </Route>

      <Route name='not-found' path='*' component={NotFound}/>
    </Route>
  );
}
