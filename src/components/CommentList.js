import React, {Component, PropTypes} from 'react';
import CommentItem from './CommentItem';
import {Alert} from 'react-bootstrap';
import {connect} from 'react-redux';
import * as commentActions from '../ducks/comments';

@connect(
  state => ({comments: state.comments.comments })
)

export default class CommentList extends Component {
  static propTypes = {
    book: PropTypes.object,
    comments: PropTypes.object
  };

  render() {
    const styles = require('./scss/CommentList.scss');
    const {comments, book} = this.props;

    let commentList = [];
    if (typeof comments[book.id] !== 'undefined') {
      commentList = comments[book.id];
    }

    return (
      <div className={styles.commentList}>
        {commentList.length > 0 ?
          <ul>
            {commentList.map(comment =>
            <li key={comment.id}>
              <CommentItem name={comment.author_name} date={comment.date} url={comment.author_url} comment={comment.content.rendered} />
            </li>)}
          </ul>
          :
          <Alert bsStyle="warning" className={styles.commentListAlert}>No comments yet.</Alert>
        }
      </div>
    );
  }
}
