import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {Button, Col, Row} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as reviewActions from '../ducks/reviews';

@connect(
  state => ({
    authorized: state.auth.authorized
  }),
  dispatch => ({
    ...bindActionCreators(reviewActions, dispatch)
  })
)

export default class Reviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      likes: {},
    };
  }

  static propTypes = {
    book: PropTypes.object.isRequired,
    authorized: PropTypes.bool,
    deleteReview: PropTypes.func,
    likeReview: PropTypes.func,
    unLikeReview: PropTypes.func,
  };

  render() {
    const {book} = this.props;
    const reviews = book.meta && book.meta.reviews ? book.meta.reviews : [];

    return (
      <div className='items-list'>
        <h3>Reviews {this.props.authorized ? <Link className='small' to={'/book/' + book.id + '/review'}>Add</Link> : ''}</h3>
        { reviews.length > 0 ?
          <ul>
            {reviews.map((item) => item.deleted ? '' : this.getReview(item))}
          </ul>
          :
          <p>No Reviews Yet.</p>
        }
      </div>
    );
  }

  getReview(item) {
    const {book} = this.props;

    return (
      <Row componentClass='li' key={item.id || ''}>
        <Col xs={12} md={6}>{item.from} <span className='rating'>{this.printRating(item.rating)}</span></Col>
        { this.props.isAuthorized ?
          <Col xs={12} md={6} className='actions'>
            <Link to={'/book/' + book.id + '/review/' + item.id }>(edit)</Link>
            <Button bsStyle='link' onClick={::this.deleteItem(item.id)}>(delete)</Button>
          </Col>
        :
          ''
        }
        <Col xs={12} className='body' dangerouslySetInnerHTML={{__html: item.text}} />
        <Col xs={12}  className='like-button' onClick={::this.toggleLike(item.id)}>
          <i className={'fa ' + (this.state.likes[item.id] ? 'fa-thumbs-up' : 'fa-thumbs-o-up')}></i>
          <span>{::this.getLikeStatement(item.likes)}</span>
        </Col>
      </Row>
    );
  }

  getLikeStatement(likes) {
    likes = likes ? likes.length : 0;

    if (likes == 1) {
      return likes + ' person likes this';
    }

    if (likes > 1) {
      return likes + ' people like this';
    }

    return 'Nobody likes this yet.';
  }

  toggleLike(id) {
    return () => {
      let likes = this.state.likes;

      if (likes[id]) {
        likes[id] = false;
        this.props.unLikeReview(id, this.props.book);

      } else {
        likes[id] = true;
        this.props.likeReview(id, this.props.book);
      }

      this.setState({likes: likes});
    };
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
