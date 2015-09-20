import React from 'react';
import {Route} from 'react-router';
import App from 'views/App';
import Books from 'views/Books';
import Login from 'views/Login';
import LoginAuthorize from 'views/LoginAuthorize';
import LoginComplete from 'views/LoginComplete';
import RequireLogin from 'views/RequireLogin';
import RequireAuthorized from 'views/RequireAuthorized';
import EditBook from 'views/EditBook';
import EditReview from 'views/EditReview';
import EditHighlight from 'views/EditHighlight';
import NotFound from 'views/NotFound';
import Loading from 'views/Loading';
import BookPage from 'views/BookPage';

export default function(store) {
  return (
    <Route component={App}>
      <Route name='books' path='/' component={Books} />
      <Route name='single-book' path='/book/:bookId' component={BookPage} />
      <Route name='login' path='/login' component={Login} />
      <Route component={RequireLogin} onEnter={RequireLogin.onEnter(store)}>
        <Route name='login-auth' path='/login/authorize' component={LoginAuthorize} />

        <Route component={RequireAuthorized} onEnter={RequireAuthorized.onEnter(store)}>
          <Route name='book-add' path='/add-book' component={EditBook} />
          <Route name='book-edit' path='/book/:bookId/edit' component={EditBook} />
          <Route name='review-add' path='/book/:bookId/review(/:reviewId)' component={EditReview} />
          <Route name='highlight-add' path='/book/:bookId/highlight(/:highlightId)' component={EditHighlight} />
        </Route>
      </Route>

      // Purely test oriented paths ...
      <Route name='test-form' path='/test-form' component={EditBook} />
      <Route name='loading' path='/loading' component={Loading} />

      <Route name='not-found' path='*' component={NotFound}/>
    </Route>
  );
}
