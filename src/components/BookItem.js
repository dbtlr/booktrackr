import React, {Component, PropTypes} from 'react';
import {Col} from 'react-bootstrap';

export default class BookItem extends Component {
  static propTypes = {
    book: PropTypes.object.isRequired
  };

  render() {
    return (
      <Col xs={12} md={6} lg={4}>
        // image
        // name
        // description
        // author
        // status
      </Col>
    );
  }
}
