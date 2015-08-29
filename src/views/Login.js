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
            <DocumentMeta title="React Redux Example: Login"/>
            <header>
              <h1>Login</h1>
            </header>

            {!user &&
              <form className={ styles.formCentered + ' form-horizontal' } onSubmit={::this.handleSubmit}>
                <Input
                  type='text'
                  placeholder='Enter your username ...'
                  bsStyle={this.validationState()}
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

  validationState() {
    let length = this.refs.username ? this.refs.username.length : 0; 
    if (length > 10) return 'success';
    else if (length > 5) return 'warning';
    else if (length > 0) return 'error';
  }

  handleSubmit(event) {
    event.preventDefault();
    const input = this.refs.username;

    this.props.login(input.getValue());
    input.setValue('');
  }

  static fetchData(store) {
    if (!isAuthLoaded(store.getState())) {
      return store.dispatch(loadAuth());
    }
  }
}
