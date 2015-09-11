import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import {Input, Button, Grid, Row, Col} from 'react-bootstrap';
import {Link} from 'react-router';

export default class LoginComplete extends Component {
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
              <h2>Completed</h2>
              <p>You're all set!</p>
              
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}
