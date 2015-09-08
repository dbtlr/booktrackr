import config from '../../config';
import request from 'request';
import OAuth from 'oauth-1.0a';


export function logout(req, res) {
  req.session.user = null;

  res.json({ msg: 'Logged Out' });
}

export function checkLogin(req, res) {
  res.json({ loggedIn: req.session.user ? true : false });
}

export function login(req, res) {
  const requestData = {
    url: config.wpApiProtocol + '://' + config.wpApiHost + config.wpApiPort + config.wpApiPrefix + '/oauth1/request',
    method: 'POST',
    data: {
        oauth_callback: ''
    }
  };

  let oauth = OAuth({
    consumer: {
      public: config.wpApiKey,
      secret: config.wpApiSecret
    },
    signature_method: 'HMAC-SHA1'
  });

  request({
    url: requestData.url,
    method: requestData.method,
    form: oauth.authorize(requestData)

  }, function(err, res2, body) {
    body = oauth.deParam(body);

    if (body.oauth_token && body.oauth_token_secret) {
      const user = {
        name: 'Admin',
        token: {
          public: body.oauth_token,
          secret: body.oauth_token_secret
        }
      };

      req.session.user = user;

      res.json({ msg: 'Logged In'});

    } else {
      res.json({ msg: 'Not Logged In'});
    }
  });
}
