import React, {Component, PropTypes} from 'react';
import {Grid, Col, Row} from 'react-bootstrap';

export default class CommentItem extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    date: PropTypes.object.isRequired,
    url: PropTypes.string,
    comment: PropTypes.string.isRequired
  };

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12} md={8}>
            // Name // Website
          </Col>
          <Col xs={12} md={4}>
            // Date
          </Col>
          <Col xs={12}>
            // Comment Body
          </Col>
        </Row>
      </Grid>
    );
  }
}
