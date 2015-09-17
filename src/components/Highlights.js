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
    user: PropTypes.object,
  };

  render() {
    const {book} = this.props;
    const highlights = book.meta && book.meta.highlights ? book.meta.highlights : [];

    return (
      <div>
        <h3>Highlights {this.props.user ? <Link className='small' to={'/book/' + book.id + '/highlight'}>Add</Link> : ''}</h3>
        {highlights.length > 0 ?
          <ul>
            {highlights.map((item) =>
              <li key={item.id || ''}>
                {item.text} {this.props.user ? <Link to={'/book/' + book.id + '/highlight/' + item.id }>(edit)</Link> : ''}
              </li>
            )}

          </ul>
          :
          <p>No highlights yet.</p>
        }
      </div>
    );
  }
}
