import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import {Button, Input, Grid, Row, Col} from 'react-bootstrap';
import * as bookActions from '../ducks/books';
import DragDropFileField from '../components/DragDropFileField';

@connect(
  state => ({api: state.api, user: state.user}),
  dispatch => bindActionCreators(bookActions, dispatch)
)

export default class AddBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cover: null
    };
  }

  static contextTypes = {
    router: PropTypes.object
  }
  
  static propTypes = {
    add: PropTypes.func,
    api: PropTypes.object,
    user: PropTypes.object
  }

  render() {
    const styles = require('./scss/Books.scss');

    return (
      <Grid className='form-horizontal'>
        <DocumentMeta title="Add Book | BookTrackr"/>
        <header>
          <h1>Add a Book</h1>
        </header>

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

        <Row>
          <Col xs={12} md={2}>
            <label>Cover Image</label>
          </Col>
          <Col xs={12} md={10}>
            <DragDropFileField
              action='/api/upload-cover'
              creds={this.props.user && this.props.user.auth ? this.props.user.auth : {}}
              textField={::this.filesTextField()}
              onDrop={::this.handleDroppedCover}
              onUploadSuccess={::this.handleFileUploadSuccess}
              onUploadError={::this.handleFileUploadError}
              onFileClear={::this.clearCover} />
          </Col>
        </Row>

        <div className={styles.buttonGroup}>
          <Button bsStyle="primary" type="submit" onClick={::this.handleSubmit}>Add Book</Button>
        </div>
      </Grid>
    )
  }

  filesTextField() {
    const cover = this.state.cover;

    if (!cover) {
      return <strong>Click or drag file here to add a cover image</strong>;
    }

    console.log(cover[0]);

    return <div>
      <strong>Added file: {cover[0].name}</strong>
      <p>Click or drag file here to replace</p>
    </div>;
  }

  handleDroppedCover(event, files) {
    this.setState({
      cover: files
    });
  }

  clearCover() {
    this.setState({
      cover: null
    });
  }

  handleFileUploadError(e, i) {
    console.log(e, i);
  }

  handleFileUploadSuccess(e, i) {
    console.log(e, i);
  }

  handleSubmit(event) {
    event.preventDefault();

    console.log(this.refs);
    return;

    const router = this.context.router;
    
    let data = {
      'title': this.refs.title.getValue(),
      'author': this.refs.author.getValue(),
      'status': this.refs.status.getValue(),
      'beganReadingDate': this.refs.beganReadingDate.getValue(),
      'finishedReadingDate': this.refs.finishedReadingDate.getValue(),
      'visibility': this.refs.visibility.getValue()
    }

    this.props.add(data, function(book) {
      router.transitionTo('/book/' + book.id);

      return book;
    });

  }
}
