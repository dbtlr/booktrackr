import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import {Link} from 'react-router';
import * as bookActions from '../ducks/book';

export default class BookItem extends Component {
  static propTypes = {
    book: PropTypes.object.isRequired,
  };

  render() {
    const {book} = this.props;
    return (
      <Link to={'/book/' + book.id} className='item' key={'book-' + book.id}>
        <header>
          <h3>{book.title}</h3>

          <div className='status'>{bookActions.readableStatus(book.meta.status)}</div>
          <div className='author'>by {book.meta.author}</div>
        </header>
        <img src={book.cover} />
      </Link>
    );
  }
}
