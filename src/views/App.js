import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import {isLoggedIn, logout} from '../ducks/auth';
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
      'twitter:site': '@nodrew',
      'twitter:creator': '@nodrew',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image,
      'twitter:image:width': '200',
      'twitter:image:height': '200',
    },
  },
};

@connect(
  state => ({loggedIn: state.auth.loggedIn, authorized: state.auth.authorized, user: state.auth.user}),
  dispatch => bindActionCreators({logout, isLoggedIn}, dispatch)
)

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool,
    authorized: PropTypes.bool,
    isLoggedIn: PropTypes.func,
    user: PropTypes.object,
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

    this.props.isLoggedIn();
  }

  componentWillUnmount() {
    const {router} = this.context;
    router.removeTransitionHook(this.transitionHook);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.loggedIn && nextProps.loggedIn) {
      console.log(this.props);
      console.log(nextProps);
      // login
      this.context.router.transitionTo(nextProps.authorized ? '/' : '/login/authorize');
    } else if (this.props.loggedIn && !nextProps.loggedIn) {
      // logout
      this.context.router.transitionTo('/');
    }
  }

  render() {
    const {loggedIn, user} = this.props;
    return (
      <div className='application'>
        <DocumentMeta {...meta}/>
        <Header loggedIn={loggedIn} user={user} logout={this.props.logout} />
        <div className='content'>
          {this.props.children}
        </div>
      </div>
    );
  }
}
