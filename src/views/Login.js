import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import {Grid, Row, Col, Input, Button} from 'react-bootstrap';
import {Link} from 'react-router';
import * as auth from '../ducks/auth';

@connect(
  state => ({auth: state.auth}),
  dispatch => bindActionCreators(auth, dispatch)
)

export default class Login extends Component {
  static propTypes = {
    login: PropTypes.func,
    auth: PropTypes.object,
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={4} xsOffset={4}>
            <DocumentMeta title='Login | BookTrackr'/>
            <header>
              <h1>Login</h1>
            </header>

            <Input
              type='text'
              label='Username'
              ref='username' />

            <Input
              type='password'
              label='Password'
              ref='password' />

            <div className='button-group'>
              <Button bsStyle='primary' type='submit' onClick={::this.handleSubmit}>Login</Button>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }

  handleSubmit(e) {
    const router = this.context.router;

    this.props.login(this.refs.username.getValue(), this.refs.password.getValue());
  }
}
