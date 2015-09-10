import React, {Component, PropTypes} from 'react';
import CommentItem from 'CommentItem';

export default class CommentList extends Component {
  render() {
    return (
      <ul>
        // Loop here
        <li>
          <CommentItem name={} date={} url={} comment={} />
        </li>
      </ul>
    );

  }

  submitForm(event) {
    event.preventDefault();

  }
}
