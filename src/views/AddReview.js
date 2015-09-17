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
  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    books: PropTypes.object,
    addReview: PropTypes.func,
    routeParams: PropTypes.object,
  }

  render() {
    const styles = require('./scss/Books.scss');
    const {books} = this.props;
    const bookId = this.props.routeParams.bookId;

    if (!books.allBooks || !books.allBooks[bookId]) {
      return (<NotFound />);
    }

    const book = books.allBooks[bookId];

    let ratings = [];

    for (let i = 1; i <= 5; i++) {
      ratings.push(
        <label key={'rating-' + i}>
          <input
            type='radio'
            name='rating'
            ref={'rating-' + i }
            value={i} /> {i}
        </label>
        );
    }

    return (
      <Grid className={styles.addReview}>
        <h1>Add a Review</h1>
        <p>For {book.title}</p>

        <form className={'form-vertical'} onSubmit={::this.submitForm}>
          <Input
            type='textarea'
            rows='6'
            ref='review' />

          <div className='form-group'>
            <Col xs={1} componentClass='label' className='control-label'><span>Rating</span></Col>
            <Col xs={11} className={styles.ratings}>{ratings}</Col>
          </div>

          <Button bsStyle='primary' type='submit'>Add Review</Button>
        </form>
      </Grid>
    );
  }

  submitForm(event) {
    event.preventDefault();

    let rating = 0;
    for (let i = 1; i <= 5; i++) {
      let node = React.findDOMNode(this.refs['rating-' + i]);

      if (node.checked === i) {
        rating = i;
        break;
      }
    }

    const bookId = this.props.routeParams.bookId;
    const {books} = this.props;

    this.props.addReview(this.refs.review.getValue(), rating, books.allBooks[bookId]);

    this.context.router.transitionTo('/book/' + bookId);
  }

  static fetchData(store, params) {
    const bookId = params.bookId;

    if (!bookActions.isBookLoaded(store.getState(), bookId)) {
      return store.dispatch(bookActions.loadOne(bookId));
    }
  }
}
