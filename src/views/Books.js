import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import DocumentMeta from 'react-document-meta';
import {connect} from 'react-redux';
import {initializeWithKey} from 'redux-form';
import {isLoaded as areBooksLoaded, load as loadBooks} from '../ducks/books';

@connect(
  state => ({user: state.auth.user}),
  dispatch => bindActionCreators({}, dispatch)
)

export default class Books extends Component {
  static propTypes = {
  }

  render() {
    const styles = require('./scss/Books.scss');

    return (
      <div className={'container'}>
      </div>
    );
  }

  static fetchData(store) {
    const promises = [];

    if (!areBooksLoaded(store.getState())) {
      promises.push(store.dispatch(loadBooks()));
    }

    return Promise.all(promises);
  }
}

