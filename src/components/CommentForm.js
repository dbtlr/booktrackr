import React, {Component, PropTypes} from 'react';
import {Input, Button, Row} from 'react-bootstrap';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as commentActions from '../ducks/comments';

@connect(
  state => ({}),
  dispatch => ({
    ...bindActionCreators(commentActions, dispatch)
  })
)

export default class CommentForm extends Component {
  static propTypes = {
    addComment: PropTypes.func,
    book: PropTypes.object.isRequired
  };

  render() {

    const styles = require('./scss/CommentForm.scss');

    return (
      <form ref='form' className={styles.commentForm + " form-vertical"} onSubmit={::this.submitForm}>
        <Input
          type='text'
          label='Name'
          labelClassName='col-xs-2'
          wrapperClassName='col-xs-10'
          ref='name' />

        <Input
          type='text'
          label='Email'
          labelClassName='col-xs-2'
          wrapperClassName='col-xs-10'
          ref='email' />

        <Input
          type='text'
          label='Website'
          labelClassName='col-xs-2'
          wrapperClassName='col-xs-10'
          ref='url' />

        <Input
          type='textarea'
          label='Comment'
          rows='10'
          labelClassName='col-xs-2'
          wrapperClassName='col-xs-10'
          ref='comment' />

        <Button bsStyle="primary" type="submit">Add Comment</Button>
      </form>
    );

  }

  submitForm(event) {
    event.preventDefault();

    let data = {
      post: this.props.book.id,
      author_name: this.refs.name.getValue(),
      author_email: this.refs.email.getValue(),
      author_url: this.refs.url.getValue(),
      content: this.refs.comment.getValue()
    }

    this.props.addComment(data, function(comment) {
      // Reset the form on sumbit.
      React.findDOMNode(this.refs.form).reset();
      React.findDOMNode(this.refs.email).value = '';
      React.findDOMNode(this.refs.url).value = '';
      React.findDOMNode(this.refs.comment).value = '';

      return comment;
    }.bind(this));
  }
}
