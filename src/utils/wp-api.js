import * as wpConfig from 'wp-config';
import request from 'request';
import OAuth from 'oauth-1.0a';

function buildApiUrl(path) {
  const data = wpConfig.read();

  let url = data.wp_api_protocol + '://' + data.wp_api_host;

  if (data.wp_api_port != 80) {
    url += ':' + data.wp_api_port;
  }

  return url + data.wp_api_prefix + path
}

function buildOAuth() {
  const data = wpConfig.read();

  return OAuth({
    consumer: {
      public: data.oauth_token,
      secret: data.oauth_token_secret
    },

    signature_method: 'HMAC-SHA1'
  });
}

export function getAuthorizeUrl(oauthToken) {
  return buildApiUrl('/oauth1/authorize?oauth_token=' + oauthToken);
}

// Todo: Maybe remove this. Want to try moving these requests to the frontend.
export function makeRequest(path, method, data, token, callback) {
  let requestData = {
    url: buildApiUrl('/wp-json/wp/v2/' + path),
    method: method,
    data: data
  };

  let oauth = buildOAuth();

  request({
    url: requestData.url,
    method: requestData.method,
    form: requestData.data,
    headers: oauth.toHeader(oauth.authorize(requestData, token))
  }, function(err, res, body) {
    body = oauth.deParam(body);
    callback(body, err, res);
  });
}

export function getToken(callback) {
  let requestData = {
    url: buildApiUrl('/oauth1/request'),
    method: 'POST',
    data: {
        oauth_callback: '' // todo: expore using this to avoid the manual callback.
    }
  };

  let oauth = buildOAuth();

  request({
    url: requestData.url,
    method: requestData.method,
    form: oauth.authorize(requestData)
  }, function(err, res, body) {
    body = oauth.deParam(body);
    callback(body, err, res);
  });
}

export function getAccessToken(requestToken, verifier, callback) {
  let requestData = {
    url: buildApiUrl('/oauth1/access'),
    method: 'POST',
    data: {
        oauth_verifier: verifier
    }
  };

  let oauth = buildOAuth();

  request({
    url: requestData.url,
    method: requestData.method,
    form: oauth.authorize(requestData, { public: requestToken })
  }, function(err, res, body) {
    body = oauth.deParam(body);
    callback(body, err, res);
  });
}