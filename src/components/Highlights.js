import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {Button} from 'react-bootstrap';
import {bindActionCreators} from 'redux';
import * as bookActions from '../ducks/books';

@connect(
  state => ({
    user: state.auth.user
  }),
  dispatch => ({
    ...bindActionCreators(bookActions, dispatch)
  })
)

export default class Highlights extends Component {
  static propTypes = {
    book: PropTypes.object.isRequired,
    user: PropTypes.object,
    deleteHighlight: PropTypes.func,
  };

  render() {
    const {book} = this.props;
    const highlights = book.meta && book.meta.highlights ? book.meta.highlights : [];

    return (
      <div>
        <h3>Highlights {this.props.user ? <Link className='small' to={'/book/' + book.id + '/highlight'}>Add</Link> : ''}</h3>
        {highlights.length > 0 ?
          <ul>
            {highlights.map((item) =>
              <li key={item.id || ''}>
                {item.text} {this.props.user ? <Link to={'/book/' + book.id + '/highlight/' + item.id }>(edit)</Link> : ''}
                {this.props.user ? <Button bsStyle='link' onClick={::this.deleteItem(item.id)}>(delete)</Button> : ''}
              </li>
            )}

          </ul>
          :
          <p>No highlights yet.</p>
        }
      </div>
    );
  }

  deleteItem(highlightId) {
    const {book} = this.props;
    return e => {
      if (confirm('Are you sure you want to delete this highlight?')) {
        this.props.deleteHighlight(highlightId, book);
      }
    };
  }
}
