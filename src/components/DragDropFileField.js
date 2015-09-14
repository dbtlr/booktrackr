import React, {Component, PropTypes} from 'react';
import * as helper from '../utils/Helper';
import * as styles from '../utils/styles';

export default class DragDropFileField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
    };
  }

  static propTypes = {
    textField: React.PropTypes.element,
    iconClassNamesByExtension: React.PropTypes.object,
    previewImageStyle: React.PropTypes.object,
    previewIconStyle: React.PropTypes.object,
    dragActiveStyle: React.PropTypes.object,
    maxFileCount: React.PropTypes.number,
    onDrop: React.PropTypes.func,
    onFileClear: React.PropTypes.func,
    accept: React.PropTypes.string,
    multiple: React.PropTypes.bool
  }

  static defaultProps = {
    textField: (<div/>),
    iconClassNamesByExtension: {},
    previewImageStyle: {},
    previewIconStyle: {},
    dragActiveStyle: {},
    maxFileCount: 1,
    onDrop: () => {},
    onFileClear: () => {}
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentWillReceiveProps() {}

  componentWillUpdate() {}

  handleDragLeave(e) {
    if (this.state.isDragActive) {
      this.setState({
        isDragActive: false
      });
    }
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!this.state.isDragActive) {
      this.setState({
        isDragActive: true
      });
    }

  }

  handleDrop(e) {
    e.preventDefault();
    let files;

    if (e.dataTransfer) {
     files = e.dataTransfer.files;

    } else if (e.target) {
     files = e.target.files;
    }

    this.setFiles(files, e);
  }

  toggleInput() {
    React.findDOMNode(this.refs.hiddenFileInput).click();
  }

  setFiles(_files, e) {
    if (_files) {
      let files = Array.prototype.slice.call(_files, 0, this.props.maxFileCount);
      this.setState({
        files: files,
        isDragActive: false
      }, () =>{
        this.props.onDrop(e, files);
      });
    }
  }

  clearFiles() {
    this.setState({
      files:[]
    }, () => {
      React.findDOMNode(this.refs.hiddenFileInput).value='';
      this.props.onFileClear();
    });
  }

  render() {

    let rootStyle = styles.dragdropField.root;
    let textFieldStyle = styles.dragdropField.textField;
    let previewStyle = styles.dragdropField.hidden;
    let previewImageStyle = helper.merge(styles.dragdropField.previewImage, this.props.previewImageStyle);
    let previewIconStyle = helper.merge(styles.dragdropField.previewIcon, this.props.previewIconStyle);

    if (this.state.isDragActive) {
      rootStyle = helper.merge(rootStyle, styles.dragdropField.dragActive);
      rootStyle = helper.merge(rootStyle, this.props.dragActiveStyle);
    }

    let preview;
    if (this.state.files.length > 0) {
      preview = Array.prototype.map.call(this.state.files, (f, i) =>{
        if (f.type.indexOf('image') > -1) {
          let src = helper.getUrl().createObjectURL(f);

          return (
            <div className='df-preview' key={i} style={styles.previewFile}>
              <img src={src} style={previewImageStyle}/>
            </div>
          );
        } else {
          let extension = helper.getFileExtension(f.name);
          let iconClassName = this.props.iconClassNamesByExtension[extension] || this.props.iconClassNamesByExtension.default;
          return (
            <div className='df-preview' key={i} style={styles.previewFile}>
              <icon className={iconClassName} style={previewIconStyle} />
            </div>
          );
        }
      });
      previewStyle = styles.dragdropField.previews;
      textFieldStyle = helper.merge(textFieldStyle, {width: '70%'});
    }

    return (
      <div
        style={rootStyle}
        className={this.state.isDragActive ? 'dragActive' : ''}
        onDragLeave={this.handleDragLeave.bind(this)}
        onDragOver={this.handleDragOver.bind(this)}
        onDrop={this.handleDrop.bind(this)}
        >
        <div ref='textField' style={textFieldStyle} onClick={this.toggleInput.bind(this)}>
          {this.props.textField}
        </div>
        <div ref='preview' style={previewStyle}>
          {preview}
          <span style={styles.clearButton} onClick={this.clearFiles.bind(this)}>&times;</span>
        </div>

        <input
          ref='hiddenFileInput'
          style={styles.dragdropField.hidden}
          type='file'
          accept={this.props.accept}
          multiple={this.props.multiple}
          onChange={this.handleDrop.bind(this)} />
      </div>
    );
  }
}
