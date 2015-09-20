import React, {Component} from 'react';
import {Grid, Col} from 'react-bootstrap';

export default class Loading extends Component {
  render() {
    return (
      <Grid>
        <Col xs={12} className='loading'>
          <img src='/img/loader.gif' />
        </Col>
      </Grid>
    );
  }
}
