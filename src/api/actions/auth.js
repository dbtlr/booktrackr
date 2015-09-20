import * as wpApi from '../../utils/wp-api';
import * as wpConfig from '../../utils/wp-config';

function getUserResponse(session) {
  const {user, oauth} = session;
  if (typeof user === 'undefined') {
    return { loggedIn: false, authorized: false, name: 'anonymous' };
  }

  return { 
    loggedIn: true, 
    authorized: oauth && oauth.access ? true : false,
    name: user.name || 'Mr. E.',
  }
}

export function checkLogin(req, res) {
  res.status(200).json(getUserResponse(req.session));
}

export function login(req, res) {
  req.session.user = {
    name: req.body.username,
  };

  res.status(200).json(getUserResponse(req.session));
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

      let data = wpConfig.read();

      res.status(200).json(getUserResponse(req.session));

    } else {
      res.status(401).json({ msg: result.body || 'Not logged in' });
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

      res.redirect(303, wpApi.getAuthorizeUrl(body.oauth_token));

    } else {
      res.status(401).json({ msg: result.body || 'Not logged in' });
    }
  });
}
