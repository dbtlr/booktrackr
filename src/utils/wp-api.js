import * as wpConfig from './wp-config';
import request from 'request';
import OAuth from 'oauth-1.0a';

export function buildApiUrl(path) {
  const data = wpConfig.read();

  return data.wp_api + path
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

function getOAuthToken(token) {
  const data = wpConfig.read();
  token = token || {};

  if (!token.public || !token.secret) {
    return null;
  }

  return {
    consumer_key: data.oauth_token,
    consumer_secret: data.oauth_token_secret,
    token: token.public || null,
    token_secret: token.secret || null
  };
}

function buildUrl(url, parameters) {
  var qs = '';

  for (var key in parameters) {
    var value = parameters[key];
    qs += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
  }

  if (qs.length > 0) {
    qs = qs.substring(0, qs.length-1); //chop off last "&"
    url = url + '?' + qs;
  }

  return url;
}

export function getAuthorizeUrl(oauthToken) {
  return buildApiUrl('/oauth1/authorize?oauth_token=' + oauthToken);
}

export function makeRequest(path, method, data, token, callback) {
  let requestData = {
    url: buildApiUrl('/wp-json/wp/v2/' + path),
    method: method,
    data: data
  };

  let oauth = buildOAuth();
  let headers = {};
  if (token) {
    headers = oauth.toHeader(oauth.authorize(requestData, token));
  }

  let url = requestData.url;
  let body = {};
  let query = '';
  switch (method) {
    case 'GET':
      url = buildUrl(url, data);
      break;

    case 'POST':
    case 'PUT':
      body = data;
      break;
  }

  request({
    url: url,
    json: true,
    method: requestData.method,
    body: data,
    oauth: getOAuthToken(token)

  }, function(err, res, body) {
    if (typeof body === 'string') {
      body = oauth.deParam(body);
    }

    callback(body, err, res);
  });
}

export function uploadMedia(stream, filename, fieldname, token, callback) {
  let requestData = {
    url: buildApiUrl('/wp-json/wp/v2/media'),
    method: 'POST'
  };

  let oauth = buildOAuth();

  const formData = {};

  formData[fieldname] = {
    value: stream,
    options: {
      filename: filename
    }
  };

  request({
    url: requestData.url,
    method: requestData.method,
    formData: formData,
    oauth: getOAuthToken(token)
  }, function(err, res, body) {
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

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
    if (typeof body === 'string') {
      body = oauth.deParam(body);
    }

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
    if (typeof body === 'string') {
      body = oauth.deParam(body);
    }

    callback(body, err, res);
  });
}