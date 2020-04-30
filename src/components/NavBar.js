import React, { useState } from "react";
import { useAuth0 } from "../react-auth0-spa";
import { Link } from "react-router-dom";
import './styles/navBar.scss';

const NavBar = (props) => {
  const { isAuthenticated, logout } = useAuth0();
  const { page } = props;

  return (
    <div>
      {isAuthenticated && (
        <div className='navBar'>
          <div className='links'>
            <Link
              id='main'
              className={page === 'main' ? 'current-page' : ''} to="/main">Главная</Link>
            <Link
            id='way-list'
            className={page === 'way-list' ? 'current-page' : ''} to="/way-list">Путевой лист</Link>
            <Link
            id='wheels'
            className={page === 'wheels' ? 'current-page' : ''} to='/wheels'>Колеса</Link>
          </div>
          <button onClick={() => logout()}>Выйти</button>
        </div>
      )}
    </div>
  );
};

export default NavBar;