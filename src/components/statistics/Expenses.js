import React, { useState, useEffect } from 'react';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
  Tooltip,
  Title
} from '@devexpress/dx-react-chart-material-ui';
import { Animation } from '@devexpress/dx-react-chart';
import { EventTracker } from '@devexpress/dx-react-chart';

import { useAuth0 } from "../../react-auth0-spa";

const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", 
                "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

const Expenses = () => {
    const { getTokenSilently } = useAuth0();
    const [ chartData, setChartData ] = useState([]);
    const [ mainData, setMainData ] = useState([]);
    const [ expensesData, setExpensesData ] = useState([]);
    const [ years, setYears ] = useState([]);
    const [ readyToShow, setReadyToShow ] = useState(false);
    const [ chosenYearTo, setChosenYearTo ] = useState('');
    const [ chosenYearFrom, setChosenYearFrom ] = useState('');
    const [ chosenMonthTo, setChosenMonthTo ] = useState('');
    const [ chosenMonthFrom, setChosenMonthFrom ] = useState('');
    const [ show, setShow ] = useState(false);

    useEffect(() => {
        getMainData(getTokenSilently, setMainData);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (years.length) {
            years.sort((a, b) => b - a);
        }
        // eslint-disable-next-line
    }, [years]);

    useEffect(() => {
        if (mainData.msg && !mainData.msg[0].start_month) {
            getChartDates(mainData.msg, setMainData);
        } else if(mainData.length !== 0) {
            getExpensesData();
        }
        // eslint-disable-next-line
    }, [mainData.msg]);

    useEffect(() => {
        if (chartData.length && readyToShow) {
            setShow(false);
            let tmpData = [...chartData]
            for (let i = 0; i < chartData.length; i++) {
                tmpData[i].mediana = (chartData.reduce(sum, 0) / tmpData.length).toFixed(2);
            }
            setChartData(tmpData);
            setShow(true);
        } 
        // eslint-disable-next-line
    }, [readyToShow]);

    useEffect(() => {
        if (chartData.length) {
            pushSelectData();
            setReadyToShow(true);
        }
        // eslint-disable-next-line
    }, [chartData]);

    const pushSelectData = () => {
        const monthFrom = Number(chartData[0].month.split('.')[0]);
        const monthTo = Number(chartData[chartData.length - 1].month.split('.')[0])
        setChosenYearFrom(chartData[0].year);
        setChosenYearTo(chartData[chartData.length - 1].year);
        setChosenMonthFrom(monthFrom - 1);
        setChosenMonthTo(monthTo - 1);
    }

    const renameMonths = async (data, setData) => {
        let tmpData = [...data];
        for (let i = 0; i < tmpData.length; i++) {
            tmpData[i].month = tmpData[i].month < 10 
                                ? ('0' + String(tmpData[i].month + 1) + '.' + String(tmpData[i].year)) 
                                : (String(tmpData[i].month + 1) + '.' + String(tmpData[i].year));
        }
        setData(tmpData);
    }

    const pushInitChartData = (data, setData) => {
        if (data.length > 11) {
            let twelveDatas = data.filter((item, index) => (index < data.length) && (index > (data.length - 13))); // getting last 12 values
            setData(twelveDatas);
        } else {
            setData(data);
        }
        setReadyToShow(true);
    }

    const getExpensesData = async () => {
        let tmpData = expensesData;

        for (let i = 0; i < mainData.length; i++) {
            if (!expensesData.some(item => (
                item.year === mainData[i].start_year
                && item.month === mainData[i].start_month
            ))) {
                const expenses = mainData[i].expenses + mainData[i].fuel + mainData[i].car_parts + mainData[i].driver_salary;
                
                tmpData.push({
                    year: mainData[i].start_year,
                    month: mainData[i].start_month,
                    expenses: expenses
                });
            } else {
                let item = expensesData.find(item => (
                    item.year === mainData[i].start_year 
                        && item.month === mainData[i].start_month
                ));
                tmpData[tmpData.indexOf(item)].expenses += mainData[i].expenses + mainData[i].fuel + mainData[i].car_parts + mainData[i].driver_salary;
            }
        }

        setExpensesData(tmpData);
        getYears(expensesData, setYears);

        await doubleSort(expensesData);
        await renameMonths(expensesData, setExpensesData);
        pushInitChartData(expensesData, setChartData);
    }

    const buildChart = async () => {
        if (dateLessThanToday(chosenMonthTo)) {
            setReadyToShow(false);
            let tmpData = [...expensesData];
            tmpData = tmpData.filter(item => (((item.year >= chosenYearFrom
                                    && item.year <= chosenYearTo)) 
                                    && ((item.year === chosenYearFrom ? (chosenMonthFrom + 1) <= (item.month).split('.')[0] : true) 
                                        && (item.year === chosenYearTo ? (chosenMonthTo + 1) >= (item.month).split('.')[0] : true))));
            setChartData(tmpData);
        } else {
            alert('choose date less than today')
        }
    }

    const dateLessThanToday = (month) => {
        let todaysMonth = new Date().getMonth();

        if (month <= todaysMonth) {
            return true;
        }
        return false;
    }

    const changeYearFrom = e => {
        setChosenYearFrom(e.target.value);
    }

    const changeYearTo = e => {
        setChosenYearTo(e.target.value);
    }

    const changeMonthFrom = e => {
        setChosenMonthFrom(e.target.value);
    }

    const changeMonthTo = e => {
        setChosenMonthTo(e.target.value);
    }

    return(
        <div>
            <Paper>
                {
                    show && readyToShow
                    ? (
                        <div>
                            <Chart
                            data={chartData}
                            height = {320}
                            >
                            <ArgumentAxis />
                            <ValueAxis />

                            <LineSeries valueField="expenses" argumentField="month" />
                            <LineSeries valueField="mediana" argumentField="month" />
                            <Animation />
                            <EventTracker />
                            <Tooltip />
                            <Title text="Расходы в путевых листах" />
                            </Chart>
                            <div className='chart-select-row'>
                                <div className='from'>
                                    <div className='header-select'>
                                        От:
                                    </div>
                                    <div className='select-row'>
                                        <Select
                                        value={chosenYearFrom}
                                        onChange={changeYearFrom}>
                                            {
                                                years.map((item, index) => (
                                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                        <Select
                                        value={chosenMonthFrom}
                                        onChange={changeMonthFrom}>
                                            {
                                                months.map((item, index) => (
                                                    <MenuItem key={index} value={index}>{item}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </div>
                                </div>
                                <div className='to'>
                                    <div className='header-select'>
                                        До:
                                    </div>
                                    <div className='select-row'>
                                        <Select
                                        value={chosenYearTo}
                                        onChange={changeYearTo}>
                                            {
                                                years.map((item, index) => (
                                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                        <Select
                                        value={chosenMonthTo}
                                        onChange={changeMonthTo}>
                                            {
                                                months.map((item, index) => (
                                                    <MenuItem key={index} value={index}>{item}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </div>
                                </div>
                                <div className='button-row'>
                                    <Button onClick={buildChart} variant="outlined" color="primary">
                                        Выбрать
                                    </Button>
                                </div>
                            </div>
                        </div>
                        )
                    : (
                        <div className='load-row'>
                            <CircularProgress />
                        </div>
                    )
                }
            </Paper>
        </div>
    );
}

const getYears = (data, setData) => {
    let years = [];
    for (let i = 0; i < data.length; i++) {
        if (!years.includes(data[i].year)) {
            years.push(data[i].year);
        }
    }
    setData(years);
}

const doubleSort = async data => {
    data.sort((a, b) => a.year === b.year ? a.month - b.month : a.year - b.year);
}

const getChartDates = async (mainData, setMainData) => {
    let tmpData = mainData;

    for (let i = 0; i < tmpData.length; i++) {
        tmpData[i].start_month = new Date(formatDate(tmpData[i].date_start)).getMonth();
        tmpData[i].start_year = new Date(formatDate(tmpData[i].date_start)).getFullYear();
    }

    setMainData(tmpData);
}

const getMainData = async (getTokenSilently, setMainData) => {
    try {
        const token = await getTokenSilently();

        const response = await fetch('http://localhost:3001/api/getMain', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        const responseData = await response.json();
        setMainData(responseData);
    } catch(err) {
        console.log(err);
    }
}

const formatDate = dateString => {
    let dates = dateString.split('.');
    return([dates[2], dates[1], dates[0]].join('-'));
}

const sum = (a, b) => a + b.expenses;

export default Expenses;