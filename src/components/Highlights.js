import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {Button, Col, Row} from 'react-bootstrap';
import {bindActionCreators} from 'redux';
import * as highlightActions from '../ducks/highlights';

@connect(
  state => ({
    user: state.auth.user
  }),
  dispatch => ({
    ...bindActionCreators(highlightActions, dispatch)
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
    const styles = require('./scss/Items.scss');

    return (
      <div className={styles.items}>
        <h3>Highlights {this.props.user ? <Link className='small' to={'/book/' + book.id + '/highlight'}>Add</Link> : ''}</h3>
        {highlights.length > 0 ?
          <ul>
            {highlights.map((item) =>
              <Row componentClass='li'  key={item.id || ''}>
                  { this.props.user ?
                    <Col xs={12} className={styles.actions}>
                      <Link to={'/book/' + book.id + '/highlight/' + item.id }>(edit)</Link>
                      <Button bsStyle='link' onClick={::this.deleteItem(item.id)}>(delete)</Button>
                    </Col>
                  :
                    ''
                  }
                <Col xs={12} className='body'>{item.text}</Col>
              </Row>
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
