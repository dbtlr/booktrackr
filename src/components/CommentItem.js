import React, {Component, PropTypes} from 'react';
import {Grid, Col, Row} from 'react-bootstrap';

export default class CommentItem extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    url: PropTypes.string,
    comment: PropTypes.string.isRequired,
  };

  render() {
    const date = new Date(this.props.date);
    const styles = require('./scss/CommentItem.scss');

    return (
      <Row className={styles.comment}>
        <Col xs={12} md={8} className={styles.author}>
          {this.props.name}
        </Col>
        <Col xs={12} md={4} className={styles.date}>
          {date.toDateString()}
        </Col>
        <Col xs={12} dangerouslySetInnerHTML={{__html: this.props.comment}} className={styles.body} />
      </Row>
    );
  }
}
