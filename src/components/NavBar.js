import React, { useState, useEffect } from "react";
import { useAuth0 } from "../react-auth0-spa";
import { Link } from "react-router-dom";
import './styles/navBar.scss';

const NavBar = ({ history }) => {
  const { isAuthenticated, logout } = useAuth0();
  const [page, setPage] = useState('');

  useEffect(() => {
    window.onpopstate  = (e) => {
      console.log(history.location.pathname.split('/')[1]);//idk, but this sht doesn't work without console.log(somethimes it doesn't highligt)
      setPage(history.location.pathname.split('/')[1]);
    }
  }, [history.location.pathname]);

  const switchPage = (event) => {
    setPage(event.target.id);
  }

  return (
    <div>
      {isAuthenticated && (
        <div className='navBar'>
          <div className='links'>
            <Link
              id='main'
              className={page === 'main' ? 'current-page' : ''} 
              onClick={switchPage}
              to="/main">Главная</Link>
            <Link
            id='way-list'
            className={page === 'way-list' ? 'current-page' : ''} 
            onClick={switchPage}
            to="/way-list">Путевой лист</Link>
            <Link
            id='wheels'
            className={page === 'wheels' ? 'current-page' : ''} 
            onClick={switchPage}
            to='/wheels'>Колеса</Link>
          </div>
          <button onClick={() => logout()}>Выйти</button>
        </div>
      )}
    </div>
  );
};

export default NavBar;