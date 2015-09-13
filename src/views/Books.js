import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import DocumentMeta from 'react-document-meta';
import {connect} from 'react-redux';
import {initializeWithKey} from 'redux-form';
import * as bookActions from '../ducks/books';
import BookItem from '../components/BookItem';
import {Grid, Row, Col, Button} from 'react-bootstrap';

@connect(
  state => ({
    books: state.books.bookList,
    loading: state.books.loading
  }),
  dispatch => bindActionCreators(bookActions, dispatch)
)

export default class Books extends Component {

  static propTypes = {
    books: PropTypes.array,
    loading: PropTypes.bool,
  }

  render() {
    const styles = require('./scss/Books.scss');

    const {books, loading} = this.props;

    let book = {};

    return (
        <div className={styles.bookList + ' container'}>
          <Row>
            {books && books.length && books.map((book) => 
              <Col xs={12} sm={6} key={book.id}>
                <BookItem book={book} />
              </Col>
            )}
          </Row>
          <footer>
            <Button bsStyle="default" onClick={::this.loadMoreBooks}>Load More Books</Button>
          </footer>
        </div>
    );
  }

  loadMoreBooks() {
    bookActions.load();
  }

  static fetchData(store) {
    if (!bookActions.isLoaded(store.getState())) {
      return store.dispatch(bookActions.load());
    }
  }
}

