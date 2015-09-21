import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {Button, Col, Row} from 'react-bootstrap';
import {bindActionCreators} from 'redux';
import * as highlightActions from '../ducks/highlights';

@connect(
  state => ({
    authorized: state.auth.authorized
  }),
  dispatch => ({
    ...bindActionCreators(highlightActions, dispatch)
  })
)

export default class Highlights extends Component {
  constructor(props) {
    super(props);
    this.state = {
      likes: {},
    };
  }

  static propTypes = {
    book: PropTypes.object.isRequired,
    authorized: PropTypes.bool,
    deleteHighlight: PropTypes.func,
    unLikeHighlight: PropTypes.func,
    likeHighlight: PropTypes.func,
  };

  render() {
    const {book} = this.props;
    const highlights = book.meta && book.meta.highlights ? book.meta.highlights : [];

    return (
      <div className='items-list'>
        <h3>Highlights {this.props.authorized ? <Link className='small' to={'/book/' + book.id + '/highlight'}>Add</Link> : ''}</h3>
        {highlights.length > 0 ?
          <ul>
            {highlights.map((item) => item.deleted ? '' : this.getHighlight(item))}
          </ul>
          :
          <p>No highlights yet.</p>
        }
      </div>
    );
  }

  getHighlight(item) {
    const {book} = this.props;
    return (
      <Row componentClass='li'  key={item.id || ''}>
          { this.props.authorized ?
            <Col xs={12} className='actions'>
              <Link to={'/book/' + book.id + '/highlight/' + item.id }>(edit)</Link>
              <Button bsStyle='link' onClick={::this.deleteItem(item.id)}>(delete)</Button>
            </Col>
          :
            ''
          }
        <Col xs={12} className='body'>{item.text}</Col>
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
        this.props.unLikeHighlight(id, this.props.book);

      } else {
        likes[id] = true;
        this.props.likeHighlight(id, this.props.book);
      }

      this.setState({likes: likes});
    };
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
