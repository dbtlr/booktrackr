import React, {Component, PropTypes} from 'react';
import CommentItem from './CommentItem';

export default class CommentList extends Component {
  render() {
    let name='', date={}, url='', comment='';

    return (
      <ul>
        // Loop here
        <li>
          <CommentItem name={name} date={date} url={url} comment={comment} />
        </li>
      </ul>
    );

  }
}
