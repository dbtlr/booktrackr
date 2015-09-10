import React from 'react';
import {Route} from 'react-router';
import App from 'views/App';
import Books from 'views/Books';
import Login from 'views/Login';
import LoginAuthorize from 'views/LoginAuthorize';
import LoginComplete from 'views/LoginComplete';
import RequireLogin from 'views/RequireLogin';
import AddBook from 'views/AddBook';
import NotFound from 'views/NotFound';
import BookPage from 'views/BookPage';

export default function(store) {
  return (
    <Route component={App}>
      <Route name="books" path="/" component={Books} />
      <Route name="single-book" path="/book/:bookSlug" component={BookPage} />
      <Route name="login" path="/login" component={Login} />
      <Route name="login-auth" path="/login/authorize" component={LoginAuthorize} />
      <Route name="login-done" path="/login/complete" component={LoginComplete} />
      <Route component={RequireLogin} onEnter={RequireLogin.onEnter(store)}>
        <Route name="book-add" path="/add-book" component={AddBook} />
      </Route>
      <Route name="not-found" path="*" component={NotFound}/>
    </Route>
  );
}
