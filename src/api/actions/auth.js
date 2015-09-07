import config from '../../config';


export function logout(req, res) {
  req.session.user = null;

  res.json({ msg: 'Logged Out' });
}

export function checkLogin(req, res) {
  res.json({ loggedIn: req.session.user ? true : false });
}

export function login(req, res) {
  const user = {
    name: 'Admin',
    api: {
      endpoint: config.wpApiEndPoint,
      key: config.wpApiKey,
      secret: config.wpApiSecret
    }
  };

  req.session.user = user;

  res.json({ msg: 'Logged In'});
}
