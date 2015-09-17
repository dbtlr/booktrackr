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
  loaded: false,
  editing: {},
  saveError: {},
  bookList: [],
  allBooks: [],
  nextPage: 1,
  hasMorePages: true,
};

// Stole this from PHP.js, in order to combat the fact the WP turns on
// magic_quotes by default. What is this, PHP 4? (sad panda...)
function stripslashes(str) {
  return (str + '')
    .replace(/\\(.?)/g, function(s, n1) {
      switch (n1) {
        case '\\':
          return '\\';
        case '0':
          return '\u0000';
        case '':
          return '';
        default:
          return n1;
      }
    });
}

function filterBooks(books) {
  let newBooks = [];

  if (typeof books.length == 'undefined') {
    books = [books];
  }

  books.map(function(item) {
    let book = {
      id: item.id,
      key: item.guid.raw,
      title: stripslashes(item.title.raw),
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
          book.meta = JSON.parse(stripslashes(meta[0][key].value));

          if (book.meta.text) {
            book.meta.text = stripslashes(book.meta.text);
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

    newBooks.push(book);
  });

  return newBooks;
}

export function readableStatus(status) {
  const statuses = {
    read: 'Read',
    'to-read': 'To Read',
    reading: 'Currently Reading',
  };

  return statuses[status] || status;
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
      };
    case LOAD_ONE:
      return {
        ...state,
        loadingOne: true,
      };
    case LOAD_SUCCESS:
      const bookList = state.bookList || [];
      const allBooks = state.allBooks || {};

      let loadedList = state.loadedList || false;

      // Make sure this can handle single results as well.
      if (typeof action.result.map == 'undefined') {
        action.result = [action.result];
      }

      action.result.map(function(book) {
        if (!book) {
          return;
        }

        allBooks[book.id] = book;

        if (!state.loadingOne) {
          bookList.push(book);
          loadedList = true;
        }
      });

      return {
        ...state,
        loading: false,
        loadingOne: false,
        loaded: true,
        loadedList: loadedList,
        allBooks: allBooks,
        bookList: bookList,
        nextPage: state.nextPage + 1,
        hasMorePages: action.result.length > 0,
        error: null,
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: { msg: action.error.message, stack: action.error.stack },
      };
    case SAVE:
      return state;
    case SAVE_SUCCESS:
      const saveData = [...state.data];
      saveData[action.result.id - 1] = action.result;
      return {
        ...state,
        data: saveData,
        editing: {
          ...state.editing,
          [action.id]: false,
        },
        saveError: {
          ...state.saveError,
          [action.id]: null,
        },
      };
    case SAVE_FAIL:
      return {
        ...state,
        saveError: {
          ...state.saveError,
          [action.id]: { msg: action.error.message, stack: action.error.stack },
        },
      };
    case ADD:
      return {
        ...state,
        adding: true,
        addErrors: [],
      };
    case ADD_SUCCESS:
      return {
        ...state,
        adding: false,
        addErrors: [],
      };
    case ADD_FAIL:
      return {
        ...state,
        adding: false,
        addError: { msg: action.error.message, stack: action.error.stack },
      };
    default:
      return state;
  }
}

export function isBookLoaded(state, bookId) {
  return state.books && state.books.allBooks && state.books.allBooks[bookId];
}

export function isListLoaded(state) {
  return state.books && state.books.loadedList;
}

export function load(page = 1) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('books', { params: { '_embed': 1, per_page: 20, page: page }, wp: true }).then(filterBooks),
  };
}

export function loadOne(bookId) {
  return {
    types: [LOAD_ONE, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('books/' + bookId, { params: { '_embed': 1 }, wp: true }).then(filterBooks),
  };
}

export function save(data, originalBook, next) {
  const newBook = {
    title: data.title,
    status: 'publish',
    featured_image: data.cover ? data.cover.id : originalBook.featured_image,
  }

  let meta = originalBook.meta;
  meta.author = data.author;
  meta.status = data.status;
  meta.visibility = data.visibility;

  meta.beganReadingDate = (new Date(data.beganReadingDate)).toUTCString();
  meta.finishedReadingDate = (new Date(data.finishedReadingDate)).toUTCString();

  if (meta.beganReadingDate == 'Invalid Date') meta.beganReadingDate = '';
  if (meta.finishedReadingDate == 'Invalid Date') meta.finishedReadingDate = '';

  next = next || ((res) => { return res; });

  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: data.id,
    promise: (client) => client.put('books/' + originalBook.id, { data: newBook, wp: true })
        .then((res) => { client.post('books/' + originalBook.id + '/meta', { data: { key: 'data', value: JSON.stringify(meta)}, wp: true}); return res; })
        .then((res) => { originalBook.terms[0] && originalBook.terms[0].map(term => client.del('books/' + originalBook.id + '/terms/genre/' + term.id, {data: {}, wp: true})); return res; })
        .then((res) => { data.tags.map(tagId => client.post('books/' + originalBook.id + '/terms/genre/' + tagId, {data: {}, wp: true})); return res; })
        .then(next)
  };
}

export function getOne(state, bookId) {
  if (state.books && state.books.allBooks && state.books.allBooks[bookId]) {
    return state.books.allBooks[bookId];
  }
}

export function likeBook(book) {
  let meta = book.meta;

  meta.likes = meta.likes || [];
  meta.likes.push({
    date: new Date(),
  });

  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: book.id,
    promise: (client) => client.post('books/' + book.id + '/meta', { data: { key: 'data', value: JSON.stringify(meta)}, wp: true}),
  };
}

export function addReview(review, rating, book) {
  let meta = book.meta;
  meta.reviews = meta.reviews || [];
  meta.reviews.push({
    id: helper.generateUUID(),
    text: review,
    rating: rating,
    likes: [],
    createdDate: new Date(),
  });

  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: book.id,
    promise: (client) => client.post('books/' + book.id + '/meta', { data: { key: 'data', value: JSON.stringify(meta)}, wp: true}),
  };
}

export function addHighlight(highlight, book) {
  let meta = book.meta;
  meta.highlights = meta.highlights || [];
  meta.highlights.push({
    id: helper.generateUUID(),
    text: highlight,
    likes: [],
    createdDate: new Date(),
  });

  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: book.id,
    promise: (client) => client.post('books/' + book.id + '/meta', { data: { key: 'data', value: JSON.stringify(meta)}, wp: true}),
  };
}

export function updateHighlight(id, highlight, book) {
  let meta = book.meta;
  meta.highlights = meta.highlights || [];

  for (let i in meta.highlights) {
    if (meta.highlights[i].id === id) {
      meta.highlights[i].text = highlight;
      meta.highlights[i].updatedDate = new Date();
      break;
    }
  }

  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: book.id,
    promise: (client) => client.post('books/' + book.id + '/meta', { data: { key: 'data', value: JSON.stringify(meta)}, wp: true}),
  };
}

export function likeHighlight(id, book) {
  let meta = book.meta;
  meta.highlights = meta.highlights || [];

  for (let i in meta.highlights) {
    if (meta.highlights[i].id === id) {
      meta.highlights[i].like = meta.highlights[i].like || [];
      meta.highlights[i].like.push({
        date: new Date(),
      });
      break;
    }
  }

  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: book.id,
    promise: (client) => client.post('books/' + book.id + '/meta', { data: { key: 'data', value: JSON.stringify(meta)}, wp: true}),
  };
}

export function deleteHighlight(id, book) {
  let meta = book.meta;
  let newHighLights = [];

  meta.highlights = meta.highlights || [];

  for (let i in meta.highlights) {
    if (meta.highlights[i].id !== id) {
      newHighLights.push(meta.highlights[i]);
    }
  }

  meta.highlights = newHighLights;

  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: book.id,
    promise: (client) => client.post('books/' + book.id + '/meta', { data: { key: 'data', value: JSON.stringify(meta)}, wp: true}).then(next),
  };
}

export function updateReview(id, review, rating, book) {
  let meta = book.meta;
  meta.reviews = meta.reviews || [];

  for (let i in meta.reviews) {
    if (meta.reviews[i].id === id) {
      meta.reviews[i].text = review;
      meta.reviews[i].rating = rating;
      meta.reviews[i].updatedDate = new Date();
      break;
    }
  }

  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: book.id,
    promise: (client) => client.post('books/' + book.id + '/meta', { data: { key: 'data', value: JSON.stringify(meta)}, wp: true}),
  };
}

export function likeReview(id, book) {
  let meta = book.meta;
  meta.reviews = meta.reviews || [];

  for (let i in meta.reviews) {
    if (meta.reviews[i].id === id) {
      meta.reviews[i].like = meta.reviews[i].like || [];
      meta.reviews[i].like.push({
        date: new Date(),
      });
      break;
    }
  }

  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: book.id,
    promise: (client) => client.post('books/' + book.id + '/meta', { data: { key: 'data', value: JSON.stringify(meta)}, wp: true}),
  };
}

export function deleteReview(id, book, next) {
  let meta = book.meta;
  let newReviews = [];

  meta.reviews = meta.reviews || [];

  for (let i in meta.reviews) {
    if (meta.reviews[i].id !== id) {
      newReviews.push(meta.reviews[i]);
    }
  }

  meta.reviews = newReviews;

  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: book.id,
    promise: (client) => client.post('books/' + book.id + '/meta', { data: { key: 'data', value: JSON.stringify(meta)}, wp: true}).then(next),
  };
}

export function add(book, next) {
  book.beganReadingDate = (new Date(book.beganReadingDate)).toUTCString();
  book.finishedReadingDate = (new Date(book.finishedReadingDate)).toUTCString();

  if (book.beganReadingDate == 'Invalid Date') book.beganReadingDate = '';
  if (book.finishedReadingDate == 'Invalid Date') book.finishedReadingDate = '';

  next = next || ((res) => { return res; });

  const data = {
    title: book.title,
    status: 'publish',
    featured_image: book.cover ? book.cover.id : null,
  }

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
