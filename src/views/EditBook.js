import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import {Button, Input, Grid, Row, Col} from 'react-bootstrap';
import * as bookActions from '../ducks/book';
import * as coverActions from '../ducks/cover';
import * as tagActions from '../ducks/tags';
import DragDropFileField from '../components/DragDropFileField';

@connect(
  state => ({api: state.api, user: state.user, cover: state.cover, tags: state.tags.tags, book: state.book.book}),
  dispatch => bindActionCreators({...bookActions, ...coverActions, ...tagActions}, dispatch)
)

export default class EditBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cover: null,
      filename: null,
      uploading: false,
    };
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    addBook: PropTypes.func,
    updateBook: PropTypes.func,
    upload: PropTypes.func,
    tags: PropTypes.object,
    book: PropTypes.object,
    api: PropTypes.object,
    cover: PropTypes.object,
    user: PropTypes.object,
  }

  render() {
    const bookId = this.props.routeParams.bookId;
    const {book} = this.props;

    let terms = [];

    if (bookId) {
      if (!book) {
        return (<NotFound />);
      }

      book.terms[0] && book.terms[0].map(term => {
        terms.push(term.id);
      });
    }

    let tags = [];
    for (let id in this.props.tags) {
      tags.push(
        <Col key={id} lg={3} xs={6}>
          <Input
            type='checkbox'
            label={this.props.tags[id]}
            ref={'tags-' + id}
            checked={terms.find(x => x == id)}
            value={id} />
        </Col>
      );
    }

    return (
      <Grid className='form-horizontal'>
        <DocumentMeta title='Add Book | BookTrackr'/>
        <header>
          <h1>{book ? 'Edit' : 'Add'} a Book</h1>
        </header>

        <Input
          type='text'
          label='Book title'
          labelClassName='col-xs-2'
          wrapperClassName='col-xs-10'
          defaultValue={book ? book.title : ''}
          ref='title' />

        <Input
          type='text'
          label='Author'
          labelClassName='col-xs-2'
          wrapperClassName='col-xs-10'
          defaultValue={book ? book.author : ''}
          ref='author' />

        <Input
          type='select'
          label='Status'
          placeholder='select'
          ref='status'
          labelClassName='col-xs-2'
          wrapperClassName='col-xs-10'>
            <option value='to-read' checked={book && book.status == 'to-read' ? 'checked' : ''}>To Read</option>
            <option value='reading' checked={book && book.status == 'reading' ? 'checked' : ''}>Currently Reading</option>
            <option value='read' checked={book && book.status == 'read' ? 'checked' : ''}>Read</option>
        </Input>

        <Input
          type='text'
          label='Began Reading'
          placeholder='mm-dd-yyyy'
          labelClassName='col-xs-2'
          wrapperClassName='col-xs-10'
          defaultValue={book && book.meta.beganReadingDate ? new Date(book.meta.beganReadingDate).toLocaleDateString() : ''}
          ref='beganReadingDate' />

        <Input
          type='text'
          label='Finished Reading'
          placeholder='mm-dd-yyyy'
          labelClassName='col-xs-2'
          wrapperClassName='col-xs-10'
          defaultValue={book && book.meta.finishedReadingDate ? new Date(book.meta.finishedReadingDate).toLocaleDateString() : ''}
          ref='finishedReadingDate' />

        <Input
          type='select'
          label='Visibility'
          placeholder='select'
          ref='visibility'
          labelClassName='col-xs-2'
          wrapperClassName='col-xs-10'>
            <option value='public' checked={book && book.visibility == 'public' ? 'checked' : ''}>Public</option>
            <option value='private' checked={book && book.visibility == 'private' ? 'checked' : ''}>Private</option>
        </Input>

        <div className='form-group'>
          <Col xs={2} componentClass='label' className='control-label'><span>Genre</span></Col>
          <Col xs={10}>{tags}</Col>
        </div>

        <div className='form-group'>
          <Col xs={2} componentClass='label' className='control-label'>
            <span>Cover Image</span>
          </Col>
          <Col xs={10}>
            <DragDropFileField
              textField={::this.filesTextField()}
              onDrop={::this.handleDroppedCover}
              onFileClear={::this.clearCover} />
          </Col>
        </div>

        <div className='button-group'>
          <Button bsStyle='primary' type='submit' onClick={::this.handleSubmit}>{book ? 'Edit' : 'Add'} Book</Button>
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
        uploading: false,
      });

      return cover;
    }.bind(this));
  }

  clearCover() {
    this.setState({
      cover: null,
      filename: null,
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const {book} = this.props;
    const router = this.context.router;
    const bookId = this.props.routeParams.bookId;

    let data = {
      title: this.refs.title.getValue(),
      author: this.refs.author.getValue(),
      status: this.refs.status.getValue(),
      beganReadingDate: this.refs.beganReadingDate.getValue(),
      finishedReadingDate: this.refs.finishedReadingDate.getValue(),
      visibility: this.refs.visibility.getValue(),
      cover: this.state.cover ? { id: this.state.cover.id, url: this.state.cover.sourceUrl } : null,
      tags: [],
    };

    for (let id in this.props.tags) {
      if (this.refs['tags-' + id].getChecked()) {
        data.tags.push(id);
      }
    }

    if (bookId) {
      if (!book) {
        router.transitionTo('/book/' + book.id);
        return;
      }

      this.props.updateBook(data, book, function(item) {
        router.transitionTo('/book/' + item.id);

        return item;
      });

    } else {
      this.props.addBook(data, function(item) {
        router.transitionTo('/book/' + item.id);

        return item;
      });
    }
  }

  static fetchData(store, params) {
    const bookId = params.bookId;
    let promises = [];

    if (bookId && !bookActions.isBookLoaded(store.getState(), bookId)) {
      promises.push(store.dispatch(bookActions.loadBook(bookId)));
    }

    if (!tagActions.areTagsLoaded(store.getState())) {
      promises.push(store.dispatch(tagActions.load()));
    }

    return promises;
  }
}
