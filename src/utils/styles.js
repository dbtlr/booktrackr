
export const dragdropField = {
  root: {
    'width': '100%',
    'height': '100%',
    'position': 'relative',
    'overflow': 'hidden',
    cursor: 'pointer',
    padding: '10px',
    textAlign: 'center',
    border: '1px solid #ccc'
  },
  textField: {
    display: 'inline',
    width: '100%',
    height: '100%',
    float: 'left'
  },
  previews: {
    width: '20%',
    height: '100%',
    padding: '10px',
    float: 'right',
    display: 'flex'
  },
  previewFile: {
    WebkutBoxFlex: 1,
    WebkitFlex: 1,
    MozFlex: 1,
    msFlex: 1,
    flex: 1,
    margin: '5px'
  },
  previewImage: {
    'width': '100%',
    'height': '100%',
    'position': 'relative'
  },
  previewIcon: {
    'fontSize': '200%'
  },
  clearButton:{
    cursor: 'pointer',
    font: '14px/100% arial, sans-serif',
    position: 'absolute',
    zIndex: '2',
    top: '5px',
    right: '5px',
    width: '10px',
    textDecoration: 'none',
    textShadow: '0 1px 0 #fff',
    fontSize: '1.5em',
    lineHeight: '1em',
    filter: 'alpha(opacity=20)',
    opacity: '.2'
  },
  dragActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  hidden: {
    display: 'none'
  }
};
