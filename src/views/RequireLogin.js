import React, {Component, PropTypes} from 'react';

export default class RequireLogin extends Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  static onEnter(store) {
    return (nextState, transition) => {
      const { auth: { loggedIn, authorized }} = store.getState();

      if (!loggedIn) {
        // oops, not logged in, so can't be here!
        transition.to('/login');
      }
    };
  }

  render() {
    return this.props.children;
  }
}
