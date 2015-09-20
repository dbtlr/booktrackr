import React, {Component, PropTypes} from 'react';

export default class RequireAuthorized extends Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  static onEnter(store) {
    return (nextState, transition) => {
      const { auth: { authorized }} = store.getState();

      if (!authorized) {
        // oops, not authorized, let's do that!
        transition.to('/login/authorize');
      }
    };
  }

  render() {
    return this.props.children;
  }
}
