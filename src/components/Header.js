import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {Navbar, Nav, NavItem} from 'react-bootstrap';

export default class Header extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    user: PropTypes.object,
    loggedIn: PropTypes.bool,
  };

  render() {
    const {user, loggedIn} = this.props;

    return (
      <header className='navbar navbar-static-top bs-docs-nav' id='top' role='banner'>
        <div className='container'>
          <div className='navbar-header'>
            <button className='navbar-toggle collapsed' type='button' data-toggle='collapse' data-target='#bs-navbar' aria-controls='bs-navbar' aria-expanded='false'>
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
            </button>
            <Link to='/' className='navbar-brand'>BookTrackr</Link>
          </div>
          <nav id='bs-navbar' className='collapse navbar-collapse'>
            <ul className='nav navbar-nav'>
              <li>
                <Link to='/'>Books</Link>
              </li>
            </ul>
            {
              loggedIn ?
                <ul className='nav navbar-nav navbar-right'>
                  <li><Link to='/add-book' title='Add New Book'><i className="fa fa-plus"></i></Link></li>
                  <li><a onClick={::this.handleLogout} href='javascript:;' title='Logout'><i className="fa fa-power-off"></i></a></li>
                  <li><img className='avatar' src={user.avatar + '?s=30'} /></li>
                </ul>
              :
                <ul className='nav navbar-nav navbar-right'>
                  <li><Link to='/register'>Register</Link></li>
                  <li><Link to='/login'>Login</Link></li>
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
