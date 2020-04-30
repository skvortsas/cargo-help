import React from 'react';
import { useAuth0 } from "../react-auth0-spa";
import './styles/login.scss';
import brandLogo from '../img/brand-logo.svg';

const Login = () => {
    const { isAuthenticated, loginWithRedirect } = useAuth0();

    return(
        <div className='login'>
            <div className='tablet'>
                <div className='brand-logo'>
                    <img src={ brandLogo } alt='brand-logo' />
                </div>
                {
                    !isAuthenticated
                    ? <button onClick={ loginWithRedirect }>Авторизоваться</button>
                    : <h1>Вы уже авторизованы</h1>
                }
            </div>
        </div>
    )
    
}

export default Login;