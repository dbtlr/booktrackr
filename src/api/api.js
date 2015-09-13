import express from 'express';
import bodyParser from 'body-parser';
import * as auth from './actions/auth';
import * as upload from './actions/upload';
import busboy from 'connect-busboy';

export function routeHandler() {
  const jsonBodyParser = bodyParser.json();
  const router = express.Router();

  router.get('/auth', jsonBodyParser, auth.checkLogin);
  router.get('/auth/authorize', jsonBodyParser, auth.authorize);
  router.post('/auth/access', jsonBodyParser, auth.verifyAccess);
  router.post('/upload-cover', busboy(), upload.uploadCover);

  router.get('*', function(req, res) {
    res.status(404).json({message: 'Not Found'});
  });

  return router;
}
