import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import DocumentMeta from 'react-document-meta';
import {connect} from 'react-redux';
import {initializeWithKey} from 'redux-form';
import NotFound from './NotFound';
import * as bookActions from '../ducks/book';
import * as booksActions from '../ducks/books';
import {Grid, Row, Col, Input, Button} from 'react-bootstrap';

@connect(
  state => ({
    book: state.book.book
  }),
  dispatch => ({
    ...bindActionCreators({...bookActions, ...booksActions}, dispatch)
  })
)

export default class EditHighlight extends Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    book: PropTypes.object,
    addHighlight: PropTypes.func,
    routeParams: PropTypes.object,
    router: PropTypes.object,
  }

  render() {
    const styles = require('./scss/Books.scss');
    const {book} = this.props;
    const highlightId = this.props.routeParams.highlightId;

    if (!book) {
      return (<NotFound />);
    }

    let highlight;

    if (highlightId) {
      if (!book.meta || !book.meta.highlights) {
        return (<NotFound />);
      }

      book.meta.highlights.map(item => {
        if (item.id == highlightId) {
          highlight = item;
        }
      });

      if (!highlight) {
        return (<NotFound />);
      }
    }

    return (
      <Grid className={styles.addHighlight}>
        <h1>{highlight ? 'Edit' : 'Add'} a Highlight</h1>
        <p>For {book.title}</p>

        <form className={'form-vertical'} onSubmit={::this.submitForm}>
          <Input
            type='textarea'
            rows='6'
            defaultValue={highlight ? highlight.text : ''}
            ref='highlight' />

          <Button bsStyle='primary' type='submit'>{highlight ? 'Edit' : 'Add'} Highlight</Button>
        </form>
      </Grid>
    );
  }

  submitForm(event) {
    event.preventDefault();

    const highlightId = this.props.routeParams.highlightId;
    const {book} = this.props;

    if (highlightId) {
      this.props.updateHighlight(highlightId, this.refs.highlight.getValue(), book);
    } else {
      this.props.addHighlight(this.refs.highlight.getValue(), book);
    }

    this.context.router.transitionTo('/book/' + book.id);
  }

  static fetchData(store, params) {
    const bookId = params.bookId;
    let promises = [];

    if (!bookActions.isBookLoaded(store.getState(), bookId)) {
      promises.push(store.dispatch(bookActions.loadBook(bookId)));
    }

    return promises;
  }
}
