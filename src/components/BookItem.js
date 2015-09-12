import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import {Link} from 'react-router';

export default class BookItem extends Component {
  static propTypes = {
    book: PropTypes.object.isRequired
  };

  render() {
    const styles = require('./scss/BookItem.scss');
    const {book} = this.props;
    return (
      <div className={styles.item} key={book.key}>
        <h3><Link to={'/book/' + book.slug}>{book.title}</Link></h3>
          <Row>
            <Col xs={8}>by {book.author}</Col>
            <Col xs={4} className={styles.status}>{book.status}</Col>
          </Row>
      </div>
    );
  }
}
