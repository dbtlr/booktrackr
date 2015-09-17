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

export default class Reviews extends Component {
  static propTypes = {
    book: PropTypes.object.isRequired,
    user: PropTypes.object,
  };

  render() {
    const {book} = this.props;
    const reviews = book.meta && book.meta.reviews ? book.meta.reviews : [];

    return (
      <div>
        <h3>Reviews</h3>
        {reviews.length > 0 ?
          <ul>
            {reviews.map((item) =>
              <li key={item.id || ''}>
                {item.text} {this.printRating(item.rating)}
              </li>
            )}
            {this.props.user ? <li><Link to={'/book/' + book.id + '/review'}>Add another review</Link></li> : ''}
          </ul>
          :
          <p>No Reviews Yet. {this.props.user ? <Link to={'/book/' + book.id + '/review'}>Add one</Link> : ''}</p>
        }
      </div>
    );
  }

  printRating(rating) {
    let rendered = [];
    for (let i = 1; i <= 5; i++) {
      rendered.push(<span>★</span>);
    }

    return rendered;
  }
}
