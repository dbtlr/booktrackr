import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import {Button, Input, Grid, Row, Col} from 'react-bootstrap';
import * as bookActions from '../ducks/books';
import * as coverActions from '../ducks/cover';
import * as tagActions from '../ducks/tags';
import DragDropFileField from '../components/DragDropFileField';

@connect(
  state => ({api: state.api, user: state.user, cover: state.cover, tags: state.tags.tags}),
  dispatch => bindActionCreators({...bookActions, ...coverActions, ...tagActions}, dispatch)
)

export default class AddBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cover: null,
      filename: null,
      uploading: false
    };
  }

  static contextTypes = {
    router: PropTypes.object
  }
  
  static propTypes = {
    add: PropTypes.func,
    upload: PropTypes.func,
    tags: PropTypes.object,
    api: PropTypes.object,
    cover: PropTypes.object,
    user: PropTypes.object
  }

  render() {
    const styles = require('./scss/Books.scss');

    let tags = [];
    for (let id in this.props.tags) {
      tags.push(<Input type="checkbox" label={this.props.tags[id]} ref={'tags-' + id} key={id} value={id} />);
    }

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

        {tags}

        <Row>
          <Col xs={12} md={2}>
            <label>Cover Image</label>
          </Col>
          <Col xs={12} md={10}>
            <DragDropFileField
              textField={::this.filesTextField()}
              onDrop={::this.handleDroppedCover}
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
    const {cover, filename, uploading} = this.state;

    if (uploading) {
      return <strong>Uploading {filename}...</strong>;
    }

    if (!cover) {
      return <strong>Click or drag file here to add a cover image</strong>;
    }

    return <div>
      <strong>Added file: {filename}</strong>
      <p>Click or drag file here to replace</p>
    </div>;
  }

  handleDroppedCover(event, files) {
    const file = files[0];

    this.setState({ filename: file.name, uploading: true });

    this.props.upload(file, function(cover) {
      this.setState({
        cover: cover,
        uploading: false
      });

      return cover;
    }.bind(this));
  }

  clearCover() {
    this.setState({
      cover: null,
      filename: null
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const router = this.context.router;
    
    let data = {
      title: this.refs.title.getValue(),
      author: this.refs.author.getValue(),
      status: this.refs.status.getValue(),
      beganReadingDate: this.refs.beganReadingDate.getValue(),
      finishedReadingDate: this.refs.finishedReadingDate.getValue(),
      visibility: this.refs.visibility.getValue(),
      cover: this.state.cover ? { id: this.state.cover.id, url: this.state.cover.source_url } : null,
      tags: []
    };


    for (let id in this.props.tags) {
      if (this.refs['tags-' + id].getChecked()) {
        data.tags.push(id);
      }
    }

    this.props.add(data, function(book) {
      router.transitionTo('/book/' + book.id);

      return book;
    });
  }

  static fetchData(store) {
    if (!tagActions.areTagsLoaded(store.getState())) {
      return store.dispatch(tagActions.load());
    }
  }
}
