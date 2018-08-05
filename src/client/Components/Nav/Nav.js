import React from 'react';
import { Link } from 'react-router-dom';
import isAuthorized from '../../Utils/isAuthorized';
import LogOut from '../LogOut/LogOut';

function Nav() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link to="/" className="navbar-brand">
        EasyGo
      </Link>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/trips" className="nav-link">
              Trips
            </Link>
          </li>

          { isAuthorized() ? (
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/subscriptions" className="nav-link">
                    Subscriptions
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/mytrips" className="nav-link">
                    My Trips
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link">
                    Profile
                </Link>
              </li>
              <li className="nav-item">
                <LogOut className="nav-link" />
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                    Register
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                    Login
                </Link>
              </li>
            </ul>
          )}

        </ul>
      </div>
    </nav>
  );
}

export default Nav;
