import React, { useState, useEffect } from 'react';
import { Search } from '@material-ui/icons';

import '../styles/wheels.scss';
import CssBaseline from '@material-ui/core/CssBaseline';
import { TextField } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import WheelsTable from './WheelsTable';

const Wheels = ({ location, wayList, setWayList }) => {
    const [chosenNumber, setChosenNumber] = useState(wayList.number);
    const [chosenYear, setChosenYear] = useState(wayList.year);
    const [changingWayList, setChangingWayList] = useState(false);

    const setWheelsWayList = () => {
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
            setWheelsWayList();
            event.target.blur();
        }
    }

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
            <div className='wheels-select'>
                <CssBaseline />
                <FormControl>
                    <div className='button-row'>
                    <TextField
                    type='number'
                    label='Номер путевого листа'
                    className='wheels-input'
                    onKeyUp={inputEnterPressed}
                    id='number' />
                    <TextField
                    type='number'
                    label='Год отправления'
                    className='wheels-input'
                    onKeyUp={inputEnterPressed}
                    id='year'/>
                    </div>
                    <div className='button-row'>
                        <Button onClick={setWheelsWayList}><Search /></Button>
                    </div>
                </FormControl>
            </div>
            {
                changingWayList
                ? (
                    <div style={{textAlign: 'center'}}>
                        Смена путевого листа
                    </div>
                )
                : (
                    chosenNumber && chosenNumber !== '0' && chosenYear &&  chosenYear !== '1999'
                ? (
                    <WheelsTable
                        number={ chosenNumber }
                        year={ chosenYear } />
                )
                : <div style={{textAlign: 'center'}}>
                    <h3>Введите номер и год выезда путевого листа</h3>
                </div>
                )
            }
        </div>
        </SnackbarProvider>
    );
}

export default Wheels;