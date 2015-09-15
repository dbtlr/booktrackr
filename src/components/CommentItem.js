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
    const date = new Date(this.props.date);

    return (
      <Row>
        <Col xs={12} md={8}>
          {this.props.name}
        </Col>
        <Col xs={12} md={4}>
          {date.toDateString()}
        </Col>
        <Col xs={12} dangerouslySetInnerHTML={{__html: this.props.comment.rendered}}>
          
        </Col>
      </Row>
    );
  }
}
