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
import * as bookActions from '../ducks/book';
import * as commentActions from '../ducks/comments';
import {Grid, Row, Col} from 'react-bootstrap';
import {Link} from 'react-router';

@connect(
  state => ({
    book: state.book.book,
    comments: state.comments,
    user: state.auth.user
  }),
  dispatch => ({
    ...bindActionCreators({...bookActions, ...commentActions}, dispatch)
  })
)

export default class BookPage extends Component {
  static propTypes = {
    book: PropTypes.object,
    user: PropTypes.object,
    routeParams: PropTypes.object,
  }

  render() {
    const styles = require('./scss/Books.scss');
    const {book, user} = this.props;
    const bookId = this.props.routeParams.bookId;

    if (!book) {
      return (<NotFound />);
    }

    const meta = book.meta || {};

    let comments = {};

    const beganDate = meta.beganReadingDate ? (new Date(meta.beganReadingDate)) : '';
    const finishedDate = meta.finishedReadingDate ? (new Date(meta.finishedReadingDate)) : '';

    return (
      <Grid className={styles.bookPage}>
        <Row>
          <Col xs={12} md={6} lg={3}>
            <img className={styles.bookPageCover} src={book.cover} />
          </Col>
          <Col xs={12} md={6} lg={9}>
            <h1>{book.title} {user ? <Link className='small' to={'/book/' + bookId + '/edit'}>Edit</Link> : ''}</h1>

            <div className='author'>Author: {meta.author}</div>
            <div className='genre'>Genre: {book.genre.join(', ')}</div>
            <div className='status'>Status: {bookActions.readableStatus(meta.status)}</div>
            {beganDate ?
              <div className='beganDate'>Date Started Reading: {beganDate.toDateString()}</div> : ''
            }
            {finishedDate ?
              <div className='endDate'>Date Finished Reading: {finishedDate.toDateString()}</div> : ''
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
    let promises = [];

    if (!bookActions.isBookLoaded(store.getState(), bookId)) {
      promises.push(store.dispatch(bookActions.loadBook(bookId)));
    }

    if (!commentActions.areLoaded(store.getState(), bookId)) {
      promises.push(store.dispatch(commentActions.load(bookId)));
    }

    return promises;
  }
}
