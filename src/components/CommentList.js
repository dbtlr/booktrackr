import React, {Component, PropTypes} from 'react';
import CommentItem from './CommentItem';
import {Alert} from 'react-bootstrap';

export default class CommentList extends Component {
  static propTypes = {
    book: PropTypes.object.isRequired
  };

  render() {
    const styles = require('./scss/CommentList.scss');
    const comments = [];
    const name='', date={}, url='', comment='';

    return (
      <div className={styles.commentList}>
        {comments.length > 0 ?
          <ul>
            // Loop here
            <li>
              <CommentItem name={name} date={date} url={url} comment={comment} />
            </li>
          </ul>
          :
          <Alert bsStyle="warning" className={styles.commentListAlert}>No comments yet.</Alert>
        }
      </div>
    );

  }
}
