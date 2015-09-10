import * as wpapi from '../wpapi';

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

  //let token = req.session.user && req.session.user.token ? req.session.user.token : null;

  // Short circuit for dev.
  let token = {
    public: '2fUvF30KLtHZQQjjGzquk6Np',
    secret: 'OpMIDD7gK4yh71syO7puP4sQeRwOEbdyLB7Uo4kPK1MAs1af'
  }

  if (!token) {
    res.status(401).json({ msg: 'Not authenticated' });
    return;
  }

  let data = {
    title: title
  };

  wpapi.makeRequest('books', 'POST', data, token, function(body, error, response) {  
    res.json({
      error: error,
      response: response,
      body: body
    });
  });
}

export function updateBook(req, res) {
  res.json([]);
}


