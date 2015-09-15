import React, {Component, PropTypes} from 'react';
import CommentItem from './CommentItem';
import {Alert} from 'react-bootstrap';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as commentActions from '../ducks/comments';

@connect(
  state => ({comments: state.comments.comments }),
  dispatch => ({
    ...bindActionCreators(commentActions, dispatch)
  })
)

export default class CommentList extends Component {
  static propTypes = {
    book: PropTypes.object,
    comments: PropTypes.object,
    load: PropTypes.func
  };

  render() {
    const styles = require('./scss/CommentList.scss');
    const {comments} = this.props;
    const name='', date={}, url='', comment='';

    let commentList = [];
    if (comments[this.props.book.id]) {
      commentList = comments[this.props.book.id];
    }

    console.log(commentList);

    return (
      <div className={styles.commentList}>
        {commentList.length > 0 ?
          <ul>
            {commentList.map(comment =>
            <li>
              <CommentItem name={comment.author_name} date={comment.date} url={comment.author_url} comment={comment.content} />
            </li>)}
          </ul>
          :
          <Alert bsStyle="warning" className={styles.commentListAlert}>No comments yet.</Alert>
        }
      </div>
    );
  }
}
