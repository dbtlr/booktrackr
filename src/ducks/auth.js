const CHECK = 'booktrackr/auth/CHECK';
const CHECK_FAIL = 'booktrackr/auth/CHECK_FAIL';
const REGISTER = 'booktrackr/auth/REGISTER';
const REGISTER_FAIL = 'booktrackr/auth/REGISTER_FAIL';
const AUTHORIZE = 'booktrackr/auth/AUTHORIZE';
const AUTHORIZE_FAIL = 'booktrackr/auth/AUTHORIZE_FAIL';
const LOGIN = 'booktrackr/auth/LOGIN';
const LOGIN_SUCCESS = 'booktrackr/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'booktrackr/auth/LOGIN_FAIL';
const LOGOUT = 'booktrackr/auth/LOGOUT';
const LOGOUT_SUCCESS = 'booktrackr/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'booktrackr/auth/LOGOUT_FAIL';

const initialState = {
  loggingOut: false,
  loading: false,
  loggedIn: false,
  authorized: false,
  authorizedFail: false,
  registerFail: false,
  user: null,
  error: null,
  postLoginRedirect: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHECK:
      return {
        ...state,
        loading: true,
      };
    case CHECK_FAIL:
      return {
        ...state,
        loading: false,
        loggedIn: false,
        authorized: false,
        user: null,
        error: { msg: action.error.message, stack: action.error.stack },
      };
    case AUTHORIZE:
      return {
        ...state,
        loading: true,
        authorizedFail: false,
      };
    case AUTHORIZE_FAIL:
      return {
        ...state,
        loading: false,
        authorized: false,
        authorizedFail: true,
        user: null,
        error: { msg: action.error.message, stack: action.error.stack },
      };
    case REGISTER:
      return {
        ...state,
        loading: true,
        registerFail: false,
      };
    case REGISTER_FAIL:
      return {
        ...state,
        loading: false,
        loggedIn: false,
        authorized: false,
        registerFail: true,
        user: null,
        error: { msg: action.error.message, stack: action.error.stack },
      };
    case LOGIN:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        authorizedFail: false,
        loggedIn: action.result.loggedIn,
        authorized: action.result.authorized,
        user: action.result.user,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        loggedIn: false,
        authorized: false,
        user: null,
        error: { msg: action.error.message, stack: action.error.stack },
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        loggedIn: false,
        authorized: false,
        user: null,
        user: null,
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        authorized: false,
        user: null,
        error: { msg: action.error.message, stack: action.error.stack },
      };
    default:
      return state;
  }
}

export function resetAuthorizedFail() {
  return {
    types: [AUTHORIZE, LOGIN_SUCCESS, AUTHORIZE_FAIL],
    promise: (client) => client.get('/auth'),
  };
}

export function isLoggedIn(next) {
  next = next || function(res) { return res; };

  return {
    types: [CHECK, LOGIN_SUCCESS, CHECK_FAIL],
    promise: (client) => client.get('/auth').then(next),
  };
}

export function authorize(token, router, next) {
  next = next || function(res) { return res; };

  return {
    types: [AUTHORIZE, LOGIN_SUCCESS, AUTHORIZE_FAIL],
    promise: (client) => client.post('/auth/access', {
      data: {
        oauth_verifier: token,
      },
    }).then(next),
  };
}

export function register(email, name, password, next) {
  next = next || function(res) { return res; };

  return {
    types: [REGISTER, LOGIN_SUCCESS, REGISTER_FAIL],
    promise: (client) => client.post('/auth/register', {
      data: {
        email: email,
        name: name,
        password: password,
      },
    }).then(next),
  };
}

export function login(email, password, next) {
  next = next || function(res) { return res; };

  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.post('/auth/login', {
      data: {
        email: email,
        password: password,
      },
    }).then(next),
  };
}

export function logout(next) {
  next = next || function(res) { return res; };

  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: (client) => client.post('/auth/logout').then(next),
  };
}
