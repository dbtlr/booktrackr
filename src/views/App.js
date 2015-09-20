import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import {isLoaded as isAuthLoaded, logout} from '../ducks/auth';
import {createTransitionHook} from '../universalRouter';
import Header from '../components/Header';

const title = 'Booktrackr';
const description = 'Tracking my books';
const image = '';

const meta = {
  title,
  description,
  meta: {
    charSet: 'utf-8',
    property: {
      'og:site_name': title,
      'og:image': image,
      'og:locale': 'en_US',
      'og:title': title,
      'og:description': description,
      'twitter:card': 'summary',
      'twitter:site': '@erikras',
      'twitter:creator': '@erikras',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image,
      'twitter:image:width': '200',
      'twitter:image:height': '200',
    },
  },
};

@connect(
  state => ({loggedIn: state.auth.loggedIn}),
  dispatch => bindActionCreators({logout}, dispatch)
)

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool,
    logout: PropTypes.func.isRequired,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const {router, store} = this.context;
    this.transitionHook = createTransitionHook(store);
    router.addTransitionHook(this.transitionHook);
  }

  componentWillUnmount() {
    const {router} = this.context;
    router.removeTransitionHook(this.transitionHook);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.loggedIn && nextProps.loggedIn) {
      // login
      this.context.router.transitionTo('/login/authorize');
    } else if (this.props.loggedIn && !nextProps.loggedIn) {
      // logout
      this.context.router.transitionTo('/');
    }
  }

  render() {
    const {loggedIn} = this.props;
    return (
      <div className='application'>
        <DocumentMeta {...meta}/>
        <Header loggedIn={loggedIn} logout={this.props.logout} />
        <div className='content'>
          {this.props.children}
        </div>
      </div>
    );
  }
}
