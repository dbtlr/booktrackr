import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import {Input, Button, Grid, Row, Col} from 'react-bootstrap';
import {Link} from 'react-router';
import * as auth from '../ducks/auth';

@connect(
  state => ({user: state.auth.user}),
  dispatch => bindActionCreators(auth, dispatch)
)

export default class LoginAuthorize extends Component {
  static propTypes = {
    authorize: PropTypes.func
  }
  render() {
    const styles = require('./scss/Login.scss');

    return (
      <Grid>
        <Row>
          <Col xs={4} xsOffset={4}>
            <DocumentMeta title="Login | BookTrackr"/>
            <header>
              <h1>Login</h1>
            </header>

            <div>
              <h2>Step 2</h2>
              <p>Next, paste the verification link from the wordpress authorization page here.</p>
              <form onSubmit={::this.handleSubmit}>
                <Input
                  type='text'
                  placeholder='Verification Token'
                  ref='verificationToken' />

                <Button bsStyle="primary" type="submit">Verify</Button>
              </form>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }

  handleSubmit(event) {
    event.preventDefault();

    this.props.authorize(this.refs.verificationToken.getValue());
  }
}
