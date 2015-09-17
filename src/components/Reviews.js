import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {Button, Col, Row} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as reviewActions from '../ducks/reviews';

@connect(
  state => ({
    user: state.auth.user
  }),
  dispatch => ({
    ...bindActionCreators(reviewActions, dispatch)
  })
)

export default class Reviews extends Component {
  static propTypes = {
    book: PropTypes.object.isRequired,
    user: PropTypes.object,
    deleteReview: PropTypes.func,
  };

  render() {
    const {book} = this.props;
    const reviews = book.meta && book.meta.reviews ? book.meta.reviews : [];
    const styles = require('./scss/Items.scss');

    return (
      <div className={styles.items}>
        <h3>Reviews {this.props.user ? <Link className='small' to={'/book/' + book.id + '/review'}>Add</Link> : ''}</h3>
        { reviews.length > 0 ?
          <ul>
            {reviews.map((item) =>
              <Row componentClass='li' key={item.id || ''}>
                <Col xs={12} md={6}>{item.from} <span className={styles.rating}>{this.printRating(item.rating)}</span></Col>
                { this.props.user ?
                  <Col xs={12} md={6} className={styles.actions}>
                    <Link to={'/book/' + book.id + '/review/' + item.id }>(edit)</Link>
                    <Button bsStyle='link' onClick={::this.deleteItem(item.id)}>(delete)</Button>
                  </Col>
                :
                  ''
                }
                <Col xs={12} className={styles.body}>{item.text}</Col>
              </Row>
            )}
          </ul>
          :
          <p>No Reviews Yet.</p>
        }
      </div>
    );
  }

  deleteItem(reviewId) {
    const {book} = this.props;
    return e => {
      if (confirm('Are you sure you want to delete this review?')) {
        this.props.deleteReview(reviewId, book);
      }
    };
  }

  printRating(rating) {
    let rendered = [];
    for (let i = 1; i <= rating; i++) {
      rendered.push(<span>★</span>);
    }

    return rendered;
  }
}
