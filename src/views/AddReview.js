import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import DocumentMeta from 'react-document-meta';
import {connect} from 'react-redux';
import {initializeWithKey} from 'redux-form';
import NotFound from './NotFound';
import * as bookActions from '../ducks/books';
import {Grid, Row, Col, Input, Button} from 'react-bootstrap';

@connect(
  state => ({
    books: state.books
  }),
  dispatch => ({
    ...bindActionCreators(bookActions, dispatch)
  })
)

export default class AddReview extends Component {
  static propTypes = {
    books: PropTypes.object,
    addReview: PropTypes.func,
    routeParams: PropTypes.object
  }

  render() {
    const styles = require('./scss/Books.scss');
    const {books} = this.props;
    const bookId = this.props.routeParams.bookId;

    if (!books.allBooks || !books.allBooks[bookId]) {
      return (<NotFound />);
    }

    const book = books.allBooks[bookId];

    return (
      <Grid className={styles.addReview}>
        <h1>Add a Review</h1>
        <p>For {book.title}</p>

        <form className={"form-vertical"} onSubmit={::this.submitForm}>
          <Input
            type='textarea'
            rows='6'
            ref='review' />

          <Button bsStyle="primary" type="submit">Add Review</Button>
        </form>
      </Grid>
    );
  }

  submitForm(event) {
    event.preventDefault();

    const bookId = this.props.routeParams.bookId;
    const {books} = this.props;

    this.props.addReview(this.refs.review.getValue(), books.allBooks[bookId]);

    // TODO: Add redirect to book detail page. 
  }

  static fetchData(store, params) {
    const bookId = params.bookId;

    if (!bookActions.isBookLoaded(store.getState(), bookId)) {
      return store.dispatch(bookActions.loadOne(bookId));
    }
  }
}

