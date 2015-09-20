import superagent from 'superagent';
import config from 'config';
import OAuth from 'oauth-1.0a';

/*
 * This silly underscore is here to avoid a mysterious "ReferenceError: ApiClient is not defined" error.
 * See Issue #14. https://github.com/erikras/react-redux-universal-hot-example/issues/14
 *
 * Remove it at your own risk.
 */
class ApiClient_ {
  constructor(req) {
    ['get', 'post', 'put', 'patch', 'del'].
      forEach((method) => {
        this[method] = (path, options) => {
          let wp = false, data = null, files = {}, params = {}, headers = {};

          if (options) {
            if (options.wp) {
              wp = true;
            }

            if (options.data) {
              data = options.data;
            }

            if (options.files) {
              files = options.files;
            }

            if (options.params) {
              params = options.params;
            }
          }


          return new Promise((resolve, reject) => {
            const url = this.formatUrl(path, wp);
            const request = superagent[method](url);

            if (params) {
              request.query(params);
            }

            if (__SERVER__) {
              if (req.get('cookie')) {
                request.set('cookie', req.get('cookie'));
              }
            }

            if (data) {
              request.send(data);
            }

            if (files) {
              for (var name in files) {
                request.field(name, files[name]);
              }
            }

            request.set(headers);

            request.end((err, res) => {
              if (!res) {
                reject(err || 'Something very weird happened. No response, no error ...');
              } else if (err) {
                reject(res.body || err);
              } else {
                resolve(res.body);
              }
            });
          });
        };
      });
  }

  buildOAuth(consumerToken) {
    return OAuth({
      consumer: consumerToken,
      signature_method: 'HMAC-SHA1'
    });
  }

  /* This was originally a standalone function outside of this class, but babel kept breaking, and this fixes it  */
  formatUrl(path) {
    const adjustedPath = path[0] !== '/' ? '/' + path : path;

    if (__SERVER__) {
      // Prepend host and port of the API server to the path.
      return 'http://localhost:' + config.port + adjustedPath;
    }

    // Prepend `/api` to relative URL, to proxy to API server.
    return '/api' + adjustedPath;
  }
}
const ApiClient = ApiClient_;

export default ApiClient;
