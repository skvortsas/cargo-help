import React, { useState, useEffect } from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import Truck from './truck/Truck';
import Expeditions from './expeditions/Expeditions';
import Fuel from './fuel/Fuel';
import Stops from './stops/Stops';
import Expenses from './expenses/Expenses';
import MoneyFlow from './money-flow/MoneyFlow';
import '../styles/wayList.scss';
import CssBaseline from '@material-ui/core/CssBaseline';
import { TextField } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { Explore } from '@material-ui/icons';
import { LocalGasStation } from '@material-ui/icons';
import { Hotel } from '@material-ui/icons';
import { MoneyOff } from '@material-ui/icons';
import { AccountBalanceWallet } from '@material-ui/icons';
import { LocalShipping } from '@material-ui/icons';
import { SnackbarProvider } from 'notistack';

const WayList = ({ match, history, location, wayList, setWayList }) => {
    const [chosenNumber, setChosenNumber] = useState(wayList.number);
    const [chosenYear, setChosenYear] = useState(wayList.year);
    const [changingWayList, setChangingWayList] = useState(false);
    const [page, setPage] = useState('');

    const setThisWayList = () => {
        const number = document.getElementById('number');
        const year = document.getElementById('year');
        
        setWayList({
            "number": number.value,
            "year": year.value
        });
        setChangingWayList(true);
    }

    const inputEnterPressed = event => {
        if (event.keyCode === 13) {
            setThisWayList();
            event.target.blur();
        }
    }

    const switchPage = event => {
        setPage(event.target.parentNode.id);
    }

    useEffect(() => {
    window.onpopstate  = (e) => {
      setPage(history.location.pathname.split('/')[2]);
    }
    }, []);

    useEffect(() => {
        const number = document.getElementById('number');
        const year = document.getElementById('year');

        if (location.state) {
            number.value = location.state.redirectedNumber;
            year.value = location.state.redirectedYear;
        } else if (wayList.number !== '0' && wayList.year !== '1999') {
            number.value = Number(wayList.number);
            year.value = Number(wayList.year); // если не обернуть в number, то label не поднимется вверх
        }

        if (location.pathname !== '/way-list') {
            setPage(location.pathname.split('/')[2]);
        }
    }, [location]);

    useEffect(() => {
        const number = document.getElementById('number').value;
        const year = document.getElementById('year').value;

        setChosenNumber(number);
        setChosenYear(year);
        setChangingWayList(false);
    }, [changingWayList]);

    return(
        <SnackbarProvider maxSnack={3}>
        <div style={{paddingTop: 120+'px', marginBottom: 50+'px'}}>
            <div className='side-bar'>
                <ul>
                    <li className={page === '' ? 'current-page' : ''}
                        id=''
                        onClick={switchPage}>
                            <Link to={`${match.url}`}><LocalShipping />Грузовик</Link>
                    </li>
                    <li className={page === 'expeditions' ? 'current-page' : ''}
                        id='expeditions'
                        onClick={switchPage}>
                            <Link to={`${match.url}/expeditions`}><Explore />Маршруты</Link>
                    </li>
                    <li className={page === 'fuel' ? 'current-page' : ''}
                        id='fuel'
                        onClick={switchPage}>
                            <Link to={`${match.url}/fuel`}><LocalGasStation />Заправки</Link>
                    </li>
                    <li className={page === 'stops' ? 'current-page' : ''}
                        id='stops'
                        onClick={switchPage}>
                            <Link to={`${match.url}/stops`}><Hotel />Остановки</Link>
                    </li>
                    <li className={page === 'expenses' ? 'current-page' : ''}
                        id='expenses'
                        onClick={switchPage}>
                            <Link to={`${match.url}/expenses`}><MoneyOff />Затраты</Link>
                    </li>
                    <li className={page === 'money-flow' ? 'current-page' : ''}
                        id='money-flow'
                        onClick={switchPage}>
                            <Link to={`${match.url}/money-flow`}><AccountBalanceWallet />Денежный поток</Link>
                    </li>
                </ul>
            </div>
        <div className='way-list-select'>
            <CssBaseline />
        <FormControl>
            <div className='button-row'>
            <TextField
            type='number'
            label='Номер путевого листа'
            className='way-list-input'
            onKeyUp={inputEnterPressed}
            id='number' />
            <TextField
            type='number'
            label='Год отправления'
            className='way-list-input'
            onKeyUp={inputEnterPressed}
            id='year'/>
            </div>
            <div className='button-row'>
                <Button onClick={setThisWayList}><Search /></Button>
            </div>
        </FormControl>
        </div>
            {
                changingWayList
                ? (
                    <div style={{textAlign: 'center', paddingLeft: 200+'px'}}>
                        Смена путевого листа
                    </div>
                )
                : (
                    chosenNumber && chosenNumber !== '0' && chosenYear &&  chosenYear !== '1999'
                ? (<Switch>
                    <Route exact path={`${match.path}`}>
                        <Truck
                        number={chosenNumber}
                        year={chosenYear} />
                    </Route>
                    <Route path={`${match.path}/expeditions`}>
                        <Expeditions
                        number={chosenNumber}
                        year={chosenYear} />
                    </Route>
                    <Route path={`${match.path}/fuel`}>
                        <Fuel
                        number={chosenNumber}
                        year={chosenYear} />
                    </Route>
                    <Route path={`${match.path}/stops`}>
                        <Stops
                        number={chosenNumber}
                        year={chosenYear} />
                    </Route>
                    <Route path={`${match.path}/expenses`}>
                        <Expenses
                        number={chosenNumber}
                        year={chosenYear} />
                    </Route>
                    <Route path={`${match.path}/money-flow`}>
                        <MoneyFlow
                        number={chosenNumber}
                        year={chosenYear} />
                    </Route>
                </Switch>)
                : <div style={{textAlign: 'center', paddingLeft: 200+'px'}}>
                    <h3>Введите номер и год выезда путевого листа</h3>
                </div>
                )
            }
        </div>
        </SnackbarProvider>
    );
}

export default WayList;