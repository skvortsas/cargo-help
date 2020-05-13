import React, { useState, useEffect } from "react";
import { useAuth0 } from "../react-auth0-spa";
import { Link } from "react-router-dom";
import './styles/navBar.scss';

const NavBar = ({ location }) => {
  const { isAuthenticated, logout } = useAuth0();
  const [page, setPage] = useState('');

  useEffect(() => {
    setPage(location.pathname.split('/')[1]);
    window.onpopstate  = (e) => {
      setPage(location.pathname.split('/')[1]);
    }
  }, [location.pathname]);

  return (
    <div>
      {isAuthenticated && (
        <div className='navBar'>
          <div className='links'>
            <Link
              id='main'
              className={page === 'main' ? 'current-page' : ''} 
              to="/main">Главная</Link>
            <Link
            id='way-list'
            className={page === 'way-list' ? 'current-page' : ''} 
            to="/way-list">Путевой лист</Link>
            <Link
            id='wheels'
            className={page === 'wheels' ? 'current-page' : ''} 
            to='/wheels'>Запчасти</Link>
          </div>
          <button onClick={() => logout()}>Выйти</button>
        </div>
      )}
    </div>
  );
};

export default NavBar;