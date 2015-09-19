import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import DocumentMeta from 'react-document-meta';
import {connect} from 'react-redux';
import {initializeWithKey} from 'redux-form';
import * as bookListActions from '../ducks/book-list';
import BookItem from '../components/BookItem';
import Loading from './Loading';
import {Grid, Row, Col, Button} from 'react-bootstrap';
import {Link} from 'react-router';

@connect(
  state => ({
    auth: state.auth,
    books: state.bookList.bookList,
    loading: state.bookList.loading,
    nextPage: state.bookList.nextPage,
    hasMorePages: state.bookList.hasMorePages,
  }),
  dispatch => bindActionCreators(bookListActions, dispatch)
)

export default class Books extends Component {

  static propTypes = {
    load: PropTypes.func,
    auth: PropTypes.object,
    books: PropTypes.array,
    loading: PropTypes.bool,
    hasMorePages: PropTypes.bool,
    nextPage: PropTypes.number,
  }

  render() {
    const styles = require('./scss/Books.scss');
    const {books, loading, auth, hasMorePages} = this.props;

    if (loading) {
      return (<Loading />);
    }

    let list = [];

    for (let id in books) {
      let book = books[id];
      if (book.meta.visibility == 'private' && !auth.user) {
        continue;
      }

      list.push(
        <Col xs={12} sm={6} key={'book-list-' + book.id}>
          <BookItem book={book} />
        </Col>
      );
    }

    if (list.length === 0) {
      return this.noBooksFound();
    }

    return (
        <div className={styles.bookList + ' container'}>
          <Row>
            {list}
          </Row>
          <footer>
            {hasMorePages ?
              <Button bsStyle='default' onClick={::this.loadMoreBooks}>Load More Books</Button>
              :
              ''
            }
          </footer>
        </div>
    );
  }

  noBooksFound() {
    const styles = require('./scss/Books.scss');
    return (
      <Grid className={styles.noBooks}>
        <h1>No Books Loaded</h1>
        <p>Maybe you should <Link to='/add-book'>add one</Link>.</p>
      </Grid>
    );
  }

  loadMoreBooks() {
    this.props.loadList(this.props.nextPage);
  }

  static fetchData(store) {
    if (!bookListActions.isListLoaded(store.getState())) {
      return store.dispatch(bookListActions.loadList(1));
    }
  }
}
