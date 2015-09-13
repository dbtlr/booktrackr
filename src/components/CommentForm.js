import React, {Component, PropTypes} from 'react';
import {Input, Button, Row} from 'react-bootstrap';

export default class CommentForm extends Component {
  static propTypes = {
    book: PropTypes.object.isRequired
  };

  render() {

    const styles = require('./scss/CommentForm.scss');

    return (
      <form className={styles.commentForm + " form-vertical"} onSubmit={::this.submitForm}>
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
      'name': this.refs.name.getValue(),
      'email': this.refs.email.getValue(),
      'url': this.refs.url.getValue(),
      'comment': this.refs.comment.getValue()
    }
  }
}
