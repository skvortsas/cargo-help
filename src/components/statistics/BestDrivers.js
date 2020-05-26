import React, { useState, useEffect } from 'react';

import { useAuth0 } from "../../react-auth0-spa";

const BestDrivers = () => {
    const { getTokenSilently } = useAuth0();
    const [ driverStatistics, setDriverStatistics ] = useState({});
    const [ bestDrivers, setBestDrivers ] = useState([]);
    const [ worstDrivers, setWorstDrivers ] = useState([]);

    useEffect(() => {
        getDriverStatistics(getTokenSilently, setDriverStatistics);
    }, []);

    useEffect(() => {
        if (driverStatistics.msg) {
            getDrivers(driverStatistics.msg, setBestDrivers, setWorstDrivers);
        }
    }, [driverStatistics]);

    return (
        <div>
            <div className='card-header'>
                <h2>Топ водителей</h2>
            </div>
            <hr />
            <div className='card-sub-header'>
                <h4>Самые продуктивные</h4>
            </div>
            {
                driverStatistics.msg
                ? (
                    bestDrivers.map(item => (
                        <div className='card-row'>
                            <div className='row-left'>
                                { item.driver }
                            </div>
                            <div className='row-right'>
                                {
                                    //расходы на 1км(x Л/1км)                 //стоимость километра исходя из стоимости топлива
                                    (((item.average_tractor_expenses / 100) * (item.fuel / item.distance))/item.count).toFixed(2)
                                }
                            </div>
                        </div>
                    ))
                )
                : 'loading...'
            }
            <div className='card-sub-header'>
                <h4>Самые транжирные</h4>
            </div>
            {
                driverStatistics.msg
                ? (
                    worstDrivers.map(item => (
                        <div className='card-row'>
                            <div className='row-left'>
                                { item.driver }
                            </div>
                            <div className='row-right'>
                                {
                                    (((item.average_tractor_expenses / 100) * (item.fuel / item.distance))/item.count).toFixed(2)
                                }
                            </div>
                        </div>
                    ))
                )
                : 'loading...'
            }
        </div>
    );
}

const getDrivers = (data, setBestDrivers, setWorstDrivers) => {
    let tmpData = data; //not to change initial data

    //sort by distance cost(via fuel)
    tmpData.sort((a, b) => ((a.average_tractor_expenses * (a.fuel / a.distance))/a.count) - ((b.average_tractor_expenses * (b.fuel / b.distance))/b.count));
    setBestDrivers([tmpData[0], tmpData[1], tmpData[2]]);
    setWorstDrivers([tmpData[tmpData.length-1], tmpData[tmpData.length-2], tmpData[tmpData.length-3]]);
}

const getDriverStatistics = async (getTokenSilently, setDriverStatistics) => {
    try {
        const token = await getTokenSilently();

        const response = await fetch("http://localhost:3001/api/driverStatistics", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        const responseData = await response.json();
        setDriverStatistics(responseData);
    } catch (err) {
        console.log(err);
    }
}

export default BestDrivers