import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import {Button, Input, Grid, Row, Col} from 'react-bootstrap';
import * as bookActions from '../ducks/books';

@connect(
  state => ({books: state.books}),
  dispatch => bindActionCreators(bookActions, dispatch)
)

export default class AddBook extends Component {
  static propTypes = {
    add: PropTypes.func
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={6} xsOffset={3}>
            <DocumentMeta title="Add Book | BookTrackr"/>
            <header>
              <h1>Add a Book</h1>
            </header>

            <form className="form-horizontal" onSubmit={::this.handleSubmit}>
              <Input
                type='text'
                label='Book title'
                labelClassName='col-xs-2'
                wrapperClassName='col-xs-10'
                ref='title' />

              <Input
                type='text'
                label='Author'
                labelClassName='col-xs-2'
                wrapperClassName='col-xs-10'
                ref='author' />

              <Input
                type='select'
                label='Status'
                placeholder='select'
                ref='status'
                labelClassName='col-xs-2'
                wrapperClassName='col-xs-10'>                  
                  <option value='to-read'>To Read</option>
                  <option value='reading'>Currently Reading</option>
                  <option value='read'>Read</option>
              </Input>

              <Input
                type='text'
                label='Began Reading'
                placeholder='mm-dd-yyyy'
                labelClassName='col-xs-2'
                wrapperClassName='col-xs-10'
                ref='beganReadingDate' />

              <Input
                type='text'
                label='Finished Reading'
                placeholder='mm-dd-yyyy'
                labelClassName='col-xs-2'
                wrapperClassName='col-xs-10'
                ref='finishedReadingDate' />

              <Input
                type='select'
                label='Visibility'
                placeholder='select'
                ref='visibility'
                labelClassName='col-xs-2'
                wrapperClassName='col-xs-10'>                  
                  <option value='public'>Public</option>
                  <option value='private'>Private</option>
              </Input>

              <Button bsStyle="primary" type="submit">Add Book</Button>
            </form>
          </Col>
        </Row>
      </Grid>
    )
  }

  handleSubmit(event) {
    event.preventDefault();
    
    let data = {
      'title': this.refs.title.getValue(),
      'author': this.refs.author.getValue(),
      'status': this.refs.status.getValue(),
      'beganReadingDate': this.refs.beganReadingDate.getValue(),
      'finishedReadingDate': this.refs.finishedReadingDate.getValue(),
      'visibility': this.refs.visibility.getValue()
    }

    this.props.add(data);

    // TODO: Add redirect to book detail page. 
  }
}
