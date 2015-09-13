import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

@connect(
  state => ({
    user: state.auth.user
  }),
  dispatch => ({
    ...bindActionCreators({}, dispatch)
  })
)

export default class Highlights extends Component {
  static propTypes = {
    book: PropTypes.object.isRequired,
    user: PropTypes.object
  };

  render() {
    const {book} = this.props;
    const highlights = book.highlights || [];

    return (
      <div>
        <h3>Highlights</h3>
        {highlights.length > 0 ?
          <ul>
            {highlights.map((item) => 
              <li key={item.id || ''}>
                {item.text}
              </li>
            )}
          </ul>
          :
          <p>No highlights yet. {this.props.user ? <Link to={"/book/" + book.id + "/add-highlight"}>Add one</Link> : ''}</p>
        }
      </div>
    );
  }
}
