import config from '../../config';
import request from 'request';
import oauth from 'oauth-1.0a';

export function getBooks(req, res) {
  res.json([]);
}

export function addBook(req, res) {
  console.log(req.body);
  
  let title = req.body.title;
  let author = req.body.author;
  let status = req.body.status;
  let beganReadingDate = req.body.beganReadingDate;
  let finishedReadingDate = req.body.finishedReadingDate;
  let visibility = req.body.visibility;

  let oauth = OAuth({
    consumer: {
      public: config.wpApiKey,
      secret: config.wpApiSecret
    },

    signature_method: 'HMAC-SHA1'
  });

      // endpoint: config.wpApiEndPoint,
      // key: config.wpApiKey,
      // secret: config.wpApiSecret

  res.json([]);
}

export function updateBook(req, res) {
  res.json([]);
}


function callWpApi(endpoint, method, data, next) {
  let jsonObject = JSON.stringify(data);

  let postHeaders = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
  };  

  let options = {
    host: config.wpApiHost,
    port: config.wpApiPort,
    path: config.wpApiPrefix + endpoint,
    method: method,
    headers: postHeaders
  };

  let reqPost = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', next);
  });

  reqPost.write(jsonObject);
  reqPost.end();

  reqPost.on('error', function(e) {
    console.error(e);
  });
}
