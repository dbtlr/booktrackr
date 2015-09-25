import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import {Input, Button, Grid, Row, Col, Alert} from 'react-bootstrap';
import {Link} from 'react-router';
import * as auth from '../ducks/auth';

@connect(
  state => ({auth: state.auth}),
  dispatch => bindActionCreators(auth, dispatch)
)

export default class LoginAuthorize extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
    };
  }

  static propTypes = {
    authorize: PropTypes.func,
    resetAuthorizedFail: PropTypes.func,
    auth: PropTypes.object
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  render() {
    const step = this.state.step;

    // if (step == 1) {
    //   this.props.resetAuthorizedFail();
    // }

    return (
      <Grid className='login-page'>
        <Row>
          <Col xs={6} xsOffset={3}>
            <DocumentMeta title='Login | BookTrackr'/>
            <header>
              <h1>Connect your account to WP API</h1>
            </header>

            <div>
              {::this.renderStep(step)}

            </div>
          </Col>
        </Row>
      </Grid>
    );
  }

  renderStep(step) {
    const authorizedFail = this.props.auth.authorizedFail;

    switch (step) {
      case 2:
        return (
          <div>
            <h2>Step 2</h2>
            <p>Next, paste the verification link from the WordPress authorization page here.</p>
            {authorizedFail ? 
              <Alert bsStyle='danger'>There was an issue validating your token, maybe it is old?</Alert>
              : ''
            }
            <Input
              type='text'
              placeholder='Verification Token'
              ref='verificationToken'
              bsStyle={authorizedFail ? 'error' : null}
              hasFeedback />

            <Button bsStyle='primary' onClick={::this.handleVerify}>Verify</Button>
          </div>
        );

      case 3: 
        return (
          <div>
            <h2>Completed</h2>
            <p>You are ready to go. <Link to='/add-book'>Maybe add a book</Link></p>
          </div>
        );

      case 1:
      default:
        return (
          <div>
            <h2>Step 1</h2>
            <p>First head over to the WordPress blog, login and authorize the connection. Once you have done that, copy the verificiion token and come back here.
            <Button bsStyle='primary' onClick={::this.launchAuthorize}>Get Authorization Token</Button></p>
          </div>
        );
    }
  }


  launchAuthorize() {
    window.open('/api/auth/authorize');

    this.setState({step: 2});
  }

  handleVerify(event) {
    event.preventDefault();

    this.props.authorize(this.refs.verificationToken.getValue(), this.context.router, this.postVerify.bind(this));
  }

  postVerify(res) {
    this.setState({step: 3});

    return res;
  }
}
