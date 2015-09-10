import * as wpApi from '../../utils/wp-api';

export function checkLogin(req, res) {
  let loggedIn = req.session.user ? true : false;
  res.status(loggedIn ? 200 : 401).json({ loggedIn: loggedIn, user: req.session.user });
}

export function verifyAccess(req, res) {
  let requestToken = null;
  if (!req.session.oauth || !req.session.oauth.request || !req.session.oauth.request.public) {
    res.status(403).json({ msg: 'Cannot verify access, no request token.' });
    return;
  } else {
    requestToken = req.session.oauth.request.public;
  }

  wpApi.getAccessToken(requestToken, req.body.oauth_verifier, function(body, error, result) {
    if (body.oauth_token && body.oauth_token_secret) {
      if (!req.session.oauth) {
        req.session.oauth = {};
      }

      req.session.oauth.access = {
        public: body.oauth_token,
        secret: body.oauth_token_secret
      };

      //res.redirect(303, '/login/complete');
      res.status(201).json({ token: body.oauth_token });

    } else {
      res.status(401).json({ msg: 'Not Logged In'});
    }
  });
}

export function authorize(req, res) {
  wpApi.getToken(function(body, error, result) {
    if (body.oauth_token && body.oauth_token_secret) {
      if (!req.session.oauth) {
        req.session.oauth = {};
      }

      req.session.oauth.request = {
        public: body.oauth_token,
        secret: body.oauth_token_secret
      };

      res.redirect(303, wpapi.getAuthorizeUrl(body.oauth_token));

    } else {
      res.status(401).json({ msg: 'Not Logged In'});
    }
  });
}
