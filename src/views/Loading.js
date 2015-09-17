import React, {Component} from 'react';
import {Grid, Col} from 'react-bootstrap';

export default class NotFound extends Component {
  render() {
    const styles = require('./scss/App.scss');
    return (
      <Grid>
        <Col xs={12} className={styles.loading}>
          <img src="/img/loader.gif" />
        </Col>
      </Grid>
    );
  }
}
