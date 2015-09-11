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
          let wp = false, data = {};

          if (options) {
            if (options.wp) {
              wp = true;
            }

            if (options.data) {
              data = options.data;
            }
          }


          return new Promise((resolve, reject) => {
            const url = this.formatUrl(path, wp);
            const request = superagent[method](url);

            if (options && options.params) {
              request.query(options.params);
            }

            if (__SERVER__) {
              if (req.get('cookie')) {
                request.set('cookie', req.get('cookie'));
              }
            }

            if (wp) {
              let requestData = {
                url: url,
                method: method
              };

              const oauth = this.buildOAuth();
              const token = this.store.getState().auth.user.access;

              console.log(token);

              const headers = oauth.toHeader(oauth.authorize(requestData, token));

              request.set(headers); 
            }

            console.log(request);

            if (data) {
              request.send(data);
            }

            request.end((err, res) => {
              if (err) {
                reject(res.body || err);
              } else {
                resolve(res.body);
              }
            });
          });
        };
      });
  }

  addStore(store) {
    this.store = store;
  }

  buildOAuth() {
    return OAuth({
      consumer: this.store.getState().auth.user.consumer,

      signature_method: 'HMAC-SHA1'
    });
  }

  /* This was originally a standalone function outside of this class, but babel kept breaking, and this fixes it  */
  formatUrl(path, wp=false) {
    const adjustedPath = path[0] !== '/' ? '/' + path : path;

    if (wp) {
      console.log(this.store.getState().api.url + '/wp-json/wp/v2' + adjustedPath);
      return this.store.getState().api.url + '/wp-json/wp/v2' + adjustedPath;
    }

    if (__SERVER__) {
      // Prepend host and port of the API server to the path.
      return 'http://localhost:' + config.apiPort + adjustedPath;
    }

    // Prepend `/api` to relative URL, to proxy to API server.
    return '/api' + adjustedPath;
  }
}
const ApiClient = ApiClient_;

export default ApiClient;
