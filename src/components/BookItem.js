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
      <Link to={'/book/' + book.id} className={styles.item} key={book.id}>
        <header>
          <h3>{book.title}</h3>

          <div className={styles.status}>{book.meta.status}</div>
          <div className={styles.author}>by {book.meta.author}</div>
        </header>
        <img src={book.cover} />
      </Link>
    );
  }
}
