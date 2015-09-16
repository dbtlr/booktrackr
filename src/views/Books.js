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
    auth: state.auth,
    books: state.books.bookList,
    loading: state.books.loading,
    nextPage: state.books.nextPage,
    hasMorePages: state.books.hasMorePages,
  }),
  dispatch => bindActionCreators(bookActions, dispatch)
)

export default class Books extends Component {

  static propTypes = {
    load: PropTypes.func,
    auth: PropTypes.object,
    books: PropTypes.array,
    loading: PropTypes.bool,
    hasMorePages: PropTypes.bool,
    nextPage: PropTypes.number
  }


  render() {
    const styles = require('./scss/Books.scss');
    const {books, loading, auth, hasMorePages} = this.props;

    return (
        <div className={styles.bookList + ' container'}>
          <Row>
            {books.length > 0 && books.map((book) => 
              (book.meta.visibility == 'public' || auth.user) ?
                <Col xs={12} sm={6} key={book.id}>
                  <BookItem book={book} />
                </Col>
                :
                ''
              )
            }
          </Row>
          <footer>
            {hasMorePages ?
              <Button bsStyle="default" onClick={::this.loadMoreBooks}>Load More Books</Button>
              :
              ''
            }
          </footer>
        </div>
    );
  }

  loadMoreBooks() {
    this.props.load(this.props.nextPage);
  }

  static fetchData(store) {
    if (!bookActions.isListLoaded(store.getState())) {
      return store.dispatch(bookActions.load(1));
    }
  }
}

