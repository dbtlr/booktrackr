import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import DocumentMeta from 'react-document-meta';
import {connect} from 'react-redux';
import {initializeWithKey} from 'redux-form';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';
import Reviews from '../components/Reviews';
import Highlights from '../components/Highlights';
import NotFound from './NotFound';
import * as bookActions from '../ducks/books';
import {Grid, Row, Col} from 'react-bootstrap';

@connect(
  state => ({
    books: state.books,
    user: state.auth.user
  }),
  dispatch => ({
    ...bindActionCreators(bookActions, dispatch)
  })
)

export default class BookPage extends Component {
  static propTypes = {
    books: PropTypes.object,
    routeParams: PropTypes.object
  }

  render() {
    const styles = require('./scss/Books.scss');
    const {books, user} = this.props;
    const bookId = this.props.routeParams.bookId;

    if (!books.allBooks || !books.allBooks[bookId]) {
      return (<NotFound />);
    }

    const book = books.allBooks[bookId];

    let comments = {};

    const beganDate = book.beganReadingDate ? (new Date(book.beganReadingDate)) : '';
    const finishedDate = book.finishedReadingDate ? (new Date(book.finishedReadingDate)) : '';

    return (
      <Grid className={styles.bookPage}>
        <Row>
          <Col xs={12} md={6} lg={3}>
            <img className={styles.bookPageCover} src={book.thumbnail} />
          </Col>
          <Col xs={12} md={6} lg={9}>
            <h1>{book.title}</h1>

            <div className="author">{book.author}</div>
            <div className="status">{book.status}</div>
            {beganDate ? 
              <div className="beganDate">Date Started Reading: {beganDate.toDateString()}</div> : ''
            }
            {finishedDate ? 
              <div className="endDate">Date Finished Reading: {finishedDate.toDateString()}</div> : ''
            }
            <Reviews book={book} />
            <Highlights book={book} />

          <h3>Leave a Comment</h3>
          <CommentForm book={book} />
          <CommentList book={book} />
          </Col>
        </Row>
      </Grid>
    );
  }

  static fetchData(store, params) {
    const bookId = params.bookId;

    if (!bookActions.isBookLoaded(store.getState(), bookId)) {
      return store.dispatch(bookActions.loadOne(bookId));
    }
  }
}

