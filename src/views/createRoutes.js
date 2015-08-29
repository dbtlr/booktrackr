import React from 'react';
import {Route} from 'react-router';
import App from 'views/App';
import Books from 'views/Books';
import Login from 'views/Login';
import RequireLogin from 'views/RequireLogin';
import AddBook from 'views/AddBook';
import NotFound from 'views/NotFound';

export default function(store) {
  return (
    <Route component={App}>
      <Route path="/" component={Books} />
      <Route path="/login" component={Login} />
      <Route component={RequireLogin} onEnter={RequireLogin.onEnter(store)}>
        <Route path="/add-book" component={AddBook} />
      </Route>
      <Route path="*" component={NotFound}/>
    </Route>
  );
}
