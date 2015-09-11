import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import DocumentMeta from 'react-document-meta';
import {connect} from 'react-redux';
import {initializeWithKey} from 'redux-form';
import {isLoaded as areBooksLoaded, load as loadBooks} from '../ducks/books';
import BookItem from '../components/BookItem';
import {Grid, Row, Button} from 'react-bootstrap';

@connect(
  state => ({user: state.auth.user}),
  dispatch => bindActionCreators({}, dispatch)
)

export default class Books extends Component {
  render() {
    const styles = require('./scss/Books.scss');

    let book = {};

    return (
      <div className={'container'}>
        <Grid>
          // Loop over books
          <Row>
            <BookItem book={book} />
          </Row>
        </Grid>
        <Button bsStyle="default" onClick={::this.loadMoreBooks}>Load More Books</Button>
      </div>
    );
  }

  loadMoreBooks() {

  }

  static fetchData(store) {
    const promises = [];

    if (!areBooksLoaded(store.getState())) {
      promises.push(store.dispatch(loadBooks()));
    }

    return Promise.all(promises);
  }
}

