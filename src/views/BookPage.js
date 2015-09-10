import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import DocumentMeta from 'react-document-meta';
import {connect} from 'react-redux';
import {initializeWithKey} from 'redux-form';
import {getOne as getBook} from '../ducks/books';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';
import Reviews from '../components/Reviews';
import Highlights from '../components/Highlights';

@connect(
  state => ({user: state.auth.user}),
  dispatch => bindActionCreators({}, dispatch)
)

export default class BookPage extends Component {
  static propTypes = {
    book: PropTypes.object.isRequired
  }

  render() {
    const styles = require('./scss/Books.scss');

    return (
      <div className={'container'}>
        <header>
          <h1>
            // Book Title
          </h1>
          // Book Author
          // Book Status
          // Book Reading Started / Ended
        </header>

        // Book Image
        // Book Description

        <Reviews />
        <Highlights />

        <CommentForm />
        <CommentList comments={} />
      </div>
    );
  }

  static fetchData(store) {
    const promises = [];

    // Load this book

    // Load page comments

    // Load highlights

    // Load reviews

    return Promise.all(promises);
  }
}

