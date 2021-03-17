import React from 'react';
import {Link} from 'react-router-dom';
import './resources/styles/index.css';
import HamburgerMenu from './HamburgerMenu';

export default function Menu() {
    return(
      <header>
        <div className="container">
          <div className="row hader-content">
            <nav className="menu">
              <div className="nav-left">
                <div className="display-mode">
                  <div className="logo">
                    <h1>CovidTacker</h1>
                  </div>
                </div>
              </div>
              <div className="nav-center">
                <div className="display-nav">
                  <div className="btn-group-nav">
                    <ul>
                      <Link to="/">Inicio</Link>
                      <Link to="/data">Datos Recopilados</Link>
                      <a href="/">Servidor</a>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="nav-right">
              <HamburgerMenu/>
              </div>
            </nav>
          </div>
        </div>
      </header>
    );
}
