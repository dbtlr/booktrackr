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
      <Link to={'/book/' + book.slug} className={styles.item} key={book.key.raw}>
        <header>
          <h3>{book.title}</h3>

          <div className={styles.status}>{book.status}</div>
          <div className={styles.author}>by {book.author}</div>
        </header>
        <img src={'http://lorempixel.com/400/500/?' + book.key.raw} />
      </Link>
    );
  }
}
