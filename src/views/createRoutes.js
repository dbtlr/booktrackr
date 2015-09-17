import React from 'react';
import {Route} from 'react-router';
import App from 'views/App';
import Books from 'views/Books';
import Login from 'views/Login';
import LoginAuthorize from 'views/LoginAuthorize';
import LoginComplete from 'views/LoginComplete';
import RequireLogin from 'views/RequireLogin';
import AddBook from 'views/AddBook';
import AddReview from 'views/AddReview';
import AddHighlight from 'views/AddHighlight';
import NotFound from 'views/NotFound';
import BookPage from 'views/BookPage';

export default function(store) {
  return (
    <Route component={App}>
      <Route name='books' path='/' component={Books} />
      <Route name='single-book' path='/book/:bookId' component={BookPage} />
      <Route name='login' path='/login' component={Login} />
      <Route name='login-auth' path='/login/authorize' component={LoginAuthorize} />
      <Route name='login-done' path='/login/complete' component={LoginComplete} />
      <Route component={RequireLogin} onEnter={RequireLogin.onEnter(store)}>
        <Route name='book-add' path='/add-book' component={AddBook} />
        <Route name='book-edit' path='/book/:bookId/edit' component={AddBook} />
        <Route name='review-add' path='/book/:bookId/add-review' component={AddReview} />
        <Route name='highlight-add' path='/book/:bookId/add-highlight' component={AddHighlight} />
      </Route>

      // Purely test oriented path ... to get around login issues while testing.
      <Route name='test-form' path='/test-form' component={AddBook} />

      <Route name='not-found' path='*' component={NotFound}/>
    </Route>
  );
}
