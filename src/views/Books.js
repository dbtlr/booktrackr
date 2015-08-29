import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import DocumentMeta from 'react-document-meta';
import {connect} from 'react-redux';
import {initializeWithKey} from 'redux-form';

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
}

