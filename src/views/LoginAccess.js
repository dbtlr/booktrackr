import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import {Grid, Row, Col} from 'react-bootstrap';
import {Link} from 'react-router';

export default class Login extends Component {
  render() {
    const styles = require('./scss/Login.scss');

    return (
      <Grid>
        <Row>
          <Col xs={4} xsOffset={4}>
            <DocumentMeta title='Login | BookTrackr'/>
            <header>
              <h1>Login</h1>
            </header>

            <div>
              <h2>Step 1</h2>
              <p>First head over to the WordPress blog, login and authorize the connection. Once you have done that, copy the verificatiion token and come back here.
              <Link className='btn btn-primary' to='/login/authorize' onClick={this.launchAuthorize}>Get Authorization Token</Link></p>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }

  launchAuthorize() {
    window.open('/api/auth/authorize');
  }
}
