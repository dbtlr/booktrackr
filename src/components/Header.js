import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {Navbar, Nav, NavItem} from 'react-bootstrap';

export default class Header extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    user: PropTypes.object
  };


  render() {
    let user = this.props.user;

    return (
      <header className="navbar navbar-static-top bs-docs-nav" id="top" role="banner">
        <div className="container">
          <div className="navbar-header">
            <button className="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target="#bs-navbar" aria-controls="bs-navbar" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link to="/" className="navbar-brand">BookTrackr</Link>
          </div>
          <nav id="bs-navbar" className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <li>
                <Link to="/">Books</Link>
              </li>
            </ul>
            { 
              user ?
                <ul className="nav navbar-nav">
                  <li><p className="navbar-text">Logged in as <strong>{user.name}</strong>.</p></li>
                  <li><a href="/add-book">Add Book</a></li>
                  <li><a onClick={::this.handleLogout} href="javascript:;">Logout</a></li>
                </ul>
              :
                <ul className="nav navbar-nav">
                  <li><Link to="/login">Login</Link></li>
                </ul>
            }
          </nav>
        </div>
      </header>
    );
  }

  handleLogout(event) {
    event.preventDefault();
    this.props.logout();
  }
}
