import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import {logout} from '../ducks/auth';

export default class Header extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    user: PropTypes.object
  };


  render() {
    let user = this.props.user;

    const styles = require('./scss/Header.scss');
    const inlineForceShow = { display: 'block !important' };

    return (
      <div className={styles.topNav}>
        <Navbar brand='Booktrackr' fixedTop={true}>
          <Nav>
            <NavItem eventKey={1}><Link to="/" style={inlineForceShow}>Books</Link></NavItem>
          </Nav>

          { 
            user ?
              <Nav>
                <NavItem eventKey={2}><Link style={inlineForceShow}>Logged in as <strong>{user.name}</strong>.</Link></NavItem>
                <NavItem eventKey={3}><Link style={inlineForceShow} onClick={::this.handleLogout} to="/logout">Logout</Link></NavItem>
              </Nav>
            :
              <Nav>
                <NavItem eventKey={4}><Link to="/login" style={inlineForceShow}>Login</Link></NavItem>
              </Nav>
          }
        </Navbar>
      </div>
    );
  }

  handleLogout(event) {
    event.preventDefault();
    this.props.logout();
  }
}
