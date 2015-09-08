import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import {Button, Input, Grid, Row, Col} from 'react-bootstrap';
import * as authActions from '../ducks/auth';
import {isLoaded as isAuthLoaded, load as loadAuth} from '../ducks/auth';

@connect(
  state => ({user: state.auth.user}),
  dispatch => bindActionCreators(authActions, dispatch)
)

export default class Login extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func
  }

  render() {
    const {user, logout} = this.props;
    const styles = require('./scss/Login.scss');

    return (
      <Grid>
        <Row>
          <Col xs={4} xsOffset={4}>
            <DocumentMeta title="Login | BookTrackr"/>
            <header>
              <h1>Login</h1>
            </header>

            {!user &&
              <form className={ styles.formCentered + ' form-horizontal' } onSubmit={::this.handleSubmit}>
                <Input
                  type='text'
                  placeholder='Enter your username ...'
                  bsSize='small'
                  hasFeedback
                  ref='username' />

                <Button bsStyle="primary" type="submit">Login</Button>
              </form>
            }
            {user &&
            <div>
              <p>You are currently logged in as {user.name}.</p>

              <div>
                <Button bsStyle="danger" onClick={logout}><i className="fa fa-sign-out"/>{' '}Log Out</Button>
              </div>
            </div>
            }
          </Col>
        </Row>
      </Grid>
    );
  }

  handleSubmit(event) {
    event.preventDefault();

    this.props.login(this.refs.username.getValue());
  }

  static fetchData(store) {
    if (!isAuthLoaded(store.getState())) {
      return store.dispatch(loadAuth());
    }
  }
}
