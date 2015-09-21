import * as wpApi from '../../utils/wp-api';
import * as config from '../../models/config';
import * as userModel from '../../models/user';
import md5 from 'md5';

function getUserResponse(session) {
  const {user} = session;
  if (typeof user === 'undefined') {
    return { loggedIn: false, authorized: false, user: null };
  }

  const model = userModel.getUser(user.email);
  if (!model) {
    return { loggedIn: false, authorized: false, user: null };
  }

  return { 
    loggedIn: true, 
    authorized: model.access_token ? true : false,
    user: {
      name: model.name,
      avatar: model.avatar,
    },
  }
}

export function register(req, res) {
  req.assert('name', 'Name is required').notEmpty();
  req.assert('email', 'A valid email is required').isEmail();
  req.assert('password', 'Your password must be at least 8 characters').isLength(8);

  const errors = req.validationErrors();  
  if (errors) {
    res.status(422).json({ msg: 'Validation error', errors: errors });
    return;
  }

  if (userModel.getUser(req.body.email)) {
    res.status(422).json({ msg: 'Validation error', errors: [{key: 'email', msg: 'That email is already taken by another user.'}] });
    return;
  }

  let user = {
    name: req.body.name,    
    email: req.body.email,    
    password: req.body.password,
    avatar: 'http://www.gravatar.com/avatar/' + md5(req.body.email),  
  };

  userModel.saveUser(user);

  // Proxy this to the login action to do the rest.
  login(req, res);
}

export function checkLogin(req, res) {
  res.status(200).json(getUserResponse(req.session));
}

export function login(req, res) {
  let user = userModel.getUser(req.body.email);

  if (!user) {
    res.status(422).json({ msg: 'Validation error', errors: [{key: 'email', msg: 'Invalid email or password combination'}] });
    return;
  }

  if (!userModel.checkPassword(req.body.password, user)) {
    res.status(422).json({ msg: 'Validation error', errors: [{key: 'email', msg: 'Invalid email or password combination'}] });
    return;
  }

  req.session.user = {
    email: req.body.email,
  };

  res.status(200).json(getUserResponse(req.session));
}

export function verifyAccess(req, res) {
  if (!req.session.user) {
    res.status(401).json({ msg: 'Not logged in' });
    return;
  } 

  if (!req.session.oauth || !req.session.oauth.request || !req.session.oauth.request.public) {
    res.status(403).json({ msg: 'Cannot verify access, no request token.' });
    return;
  } 
  
  const requestToken = req.session.oauth.request.public;

  let user = userModel.getUser(req.session.user.email);

  wpApi.getAccessToken(requestToken, req.body.oauth_verifier, function(body, error, result) {
    if (body.oauth_token && body.oauth_token_secret) {
      user.access_token = {
        public: body.oauth_token,
        secret: body.oauth_token_secret
      };

      userModel.saveUser(user);

      res.status(200).json(getUserResponse(req.session));

    } else {
      res.status(401).json({ msg: result.body || 'Not logged in' });
    }
  });
}

export function authorize(req, res) {
  if (!req.session.user) {
    res.status(401).json({ msg: 'Not logged in' });
    return;
  } 

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
