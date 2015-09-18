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
import Loading from './Loading';
import * as bookActions from '../ducks/book';
import * as commentActions from '../ducks/comments';
import {Grid, Row, Col} from 'react-bootstrap';
import {Link} from 'react-router';

@connect(
  state => ({
    book: state.book.book,
    loading: state.book.loading,
    comments: state.comments,
    user: state.auth.user
  }),
  dispatch => ({
    ...bindActionCreators({...bookActions, ...commentActions}, dispatch)
  })
)

export default class BookPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: false,
    };
  }

  static propTypes = {
    book: PropTypes.object,
    user: PropTypes.object,
    routeParams: PropTypes.object,
    loading: PropTypes.boolean,
    addLike: PropTypes.func,
    unLike: PropTypes.func,
  }

  render() {
    const styles = require('./scss/Books.scss');
    const {book, user, loading} = this.props;
    const bookId = this.props.routeParams.bookId;

    if (loading) {
      return (<Loading />);
    }

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
            <div className={styles.likeButton} onClick={::this.toggleLikeBook}>
              <i className={'fa ' + (this.state.liked ? 'fa-thumbs-up' : 'fa-thumbs-o-up')}></i>
              <span>{::this.getLikeStatement(book.meta.likes)}</span>
            </div>

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

  getLikeStatement(likes) {
    likes = likes ? likes.length : 0;

    if (likes == 1) {
      return likes + ' person likes this';
    }

    if (likes > 1) {
      return likes + ' people like this';
    }

    return 'Nobody likes this yet.';
  }

  toggleLikeBook() {
    if (this.state.liked) {
      this.setState({liked: false});
      this.props.unLike(this.props.book);

    } else {
      this.setState({liked: true});
      this.props.addLike(this.props.book);
    }
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
