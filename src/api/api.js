import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import config from '../config';
import * as book from './actions/books';
import * as auth from './actions/auth';

const app = express();

app.use(session({
  secret: 'is it secret? is it safe?',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));

app.use(bodyParser.json());

export default function api() {
  return new Promise((resolve) => {
    app.get('/book', book.getBooks);
    app.post('/book', book.addBook);
    app.put('/book/:id', book.updateBook);

    app.get('/login', auth.checkLogin);
    app.del('/login', auth.logout);
    app.post('/login', auth.login);

    app.get('/auth/authorize', auth.authorize);

    app.get('/auth/access/:token', auth.verifyAccess);

    app.get('*', function(req, res) {
      res.status(404).json({message: 'Not Found'});
    });

    app.listen(config.apiPort);
    resolve();
  });
}
