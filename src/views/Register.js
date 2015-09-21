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

export default class Register extends Component {
  static propTypes = {
    register: PropTypes.func,
    auth: PropTypes.object,
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={6} xsOffset={3}>
            <DocumentMeta title='Register | BookTrackr'/>
            <header>
              <h1>Create an account</h1>
              <p>Already have one? <Link to='/login'>Log in now</Link>.</p>
            </header>

            <Input
              type='text'
              label='Email'
              ref='email' />

            <Input
              type='text'
              label='Name'
              ref='name' />

            <Input
              type='password'
              label='Password'
              ref='password' />

            <div className='button-group'>
              <Button bsStyle='primary' type='submit' onClick={::this.handleSubmit}>Get Started</Button>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }

  handleSubmit(e) {
    const router = this.context.router;

    this.props.register(this.refs.email.getValue(), this.refs.name.getValue(), this.refs.password.getValue());
  }
}
