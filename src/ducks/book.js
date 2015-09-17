import * as helper from '../utils/Helper';
import * as coverActions from './cover'

const LOAD = 'booktrackr/books/LOAD';
const LOAD_ONE = 'booktrackr/books/LOAD_ONE';
const LOAD_SUCCESS = 'booktrackr/books/LOAD_SUCCESS';
const LOAD_FAIL = 'booktrackr/books/LOAD_FAIL';
const SAVE = 'booktrackr/books/SAVE';
const SAVE_SUCCESS = 'booktrackr/books/SAVE_SUCCESS';
const SAVE_FAIL = 'booktrackr/books/SAVE_FAIL';
const ADD = 'booktrackr/books/ADD';
const ADD_SUCCESS = 'booktrackr/books/ADD_SUCCESS';
const ADD_FAIL = 'booktrackr/books/ADD_FAIL';

const initialState = {
  loading: false,
  saving: false,
  adding: false,
  error: null,
  book: null,
  response: null,
};

export function formatBook(item) {
  let book = {
    id: item.id,
    key: item.guid.raw,
    title: helper.stripslashes(item.title.raw),
    slug: item.slug || null,
    meta: {},
    terms: {},
    genre: [],
    cover: '',
  };

  let meta = item._embedded['http://v2.wp-api.org/meta'];
  if (meta) {
    for (let key in meta[0]) {
      if (meta[0][key].key == 'data') {
        book.meta = JSON.parse(helper.stripslashes(meta[0][key].value));

        if (book.meta.text) {
          book.meta.text = helper.stripslashes(book.meta.text);
        }
      }
    }
  }

  let attachment = item._embedded['http://v2.wp-api.org/attachment'];
  if (attachment) {
    for (let key in attachment[0]) {
      if (attachment[0][key].id == item.featured_image) {
        book.cover = attachment[0][key].source_url;
        break;
      }
    }
  }

  let terms = item._embedded['http://v2.wp-api.org/term'];
  if (terms) {
    book.terms = terms;
    for (let key in terms[0]) {
      book.genre.push(terms[0][key].name);
    }
  }

  return book;
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        book: action.result,
        error: null,
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        error: { msg: action.error.message, stack: action.error.stack },
      };
    case SAVE:
      return {
        ...state,
        saving: true,
      };
    case SAVE_SUCCESS:
      return {
        ...state,
        response: action.result,
        saving: false,
        error: null
      };
    case SAVE_FAIL:
      return {
        ...state,
        response: action.result,
        saving: false,
        error: { msg: action.error.message, stack: action.error.stack },
      };
    case ADD:
      return {
        ...state,
        response: action.result,
        adding: true,
        error: [],
      };
    case ADD_SUCCESS:
      return {
        ...state,
        response: action.result,
        adding: false,
        error: [],
      };
    case ADD_FAIL:
      return {
        ...state,
        response: action.result,
        adding: false,
        error: { msg: action.error.message, stack: action.error.stack },
      };
    default:
      return state;
  }
}

export function isBookLoaded(state, bookId) {
  return state.book && state.book.book && state.books.book.id === bookId;
}

export function loadBook(bookId) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('books/' + bookId, { params: { '_embed': 1 }, wp: true }).then(formatBook),
  };
}

function getMetaForBook(book, meta) {
  meta.author = book.author;
  meta.status = book.status;
  meta.visibility = book.visibility;

  meta.beganReadingDate = (new Date(data.beganReadingDate)).toUTCString();
  meta.finishedReadingDate = (new Date(data.finishedReadingDate)).toUTCString();

  if (meta.beganReadingDate == 'Invalid Date') meta.beganReadingDate = '';
  if (meta.finishedReadingDate == 'Invalid Date') meta.finishedReadingDate = '';

  return meta;
}

export function updateBook(data, originalBook, next) {
  const newBook = {
    title: data.title,
    status: 'publish',
    featured_image: data.cover ? data.cover.id : originalBook.featured_image,
  }

  let meta = getMetaForBook(data, originalBook.meta);

  next = next || ((res) => { return res; });

  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: (client) => client.put('books/' + originalBook.id, { data: newBook, wp: true })
        .then((res) => { client.post('books/' + originalBook.id + '/meta', { data: { key: 'data', value: JSON.stringify(meta)}, wp: true}); return res; })
        .then((res) => { originalBook.terms[0] && originalBook.terms[0].map(term => client.del('books/' + originalBook.id + '/terms/genre/' + term.id, {data: {}, wp: true})); return res; })
        .then((res) => { data.tags.map(tagId => client.post('books/' + originalBook.id + '/terms/genre/' + tagId, {data: {}, wp: true})); return res; })
        .then(next)
  };
}

export function addBook(book, next) {
  const data = {
    title: book.title,
    status: 'publish',
    featured_image: book.cover ? book.cover.id : null,
  }

  let meta = getMetaForBook(data, originalBook.meta);
  next = next || ((res) => { return res; });

  return {
    types: [ADD, ADD_SUCCESS, ADD_FAIL],
    promise: (client) => {
      return client.post('books', { data: data, wp: true })
        .then((res) => { client.post('books/' + res.id + '/meta', { data: { key: 'data', value: JSON.stringify(book)}, wp: true}); return res; })
        .then((res) => { book.tags.map(tagId => client.post('books/' + res.id + '/terms/genre/' + tagId, {data: {}, wp: true})); return res; })
        .then(next)
    }
  };
}
