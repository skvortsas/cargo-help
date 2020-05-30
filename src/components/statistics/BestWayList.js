import React, { useState, useEffect } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import { useAuth0 } from "../../react-auth0-spa";

const BestWayList = () => {
    const { getTokenSilently } = useAuth0();
    const [ apiMessage, setApiMessage ] = useState({});
    const [ mostMoney, setMostMoney ] = useState([]);
    const [ mostProfitable, setMostProfitable ] = useState([]);

    useEffect(() => {
        getMainData(getTokenSilently, setApiMessage);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (apiMessage.msg) {
            getMostMoney(apiMessage.msg, setMostMoney);
            getMostProfitable(apiMessage.msg, setMostProfitable);
        }
    }, [apiMessage]);

    return (
        <div>
            <div className='card-header'>
                <h2>Топ путевых листов</h2>
            </div>
            <hr />
            <div className='card-sub-header'>
                <h4>Больше всего принесли</h4>
            </div>
            {
                apiMessage.msg
                ? (
                    mostMoney.map((item, index) => (
                        <div key={index} className='card-row'>
                            <div className='row-left'>
                                <div style={{ width: 30+'px' }}>
                                    {item.way_list_number}
                                </div>
                                <span>
                                    ({item.way_list_year} год,  {item.driver})
                                </span>
                            </div>
                            <div className='row-right'>
                                {item.income} руб.
                            </div>
                        </div>
                    ))
                )
                : (
                    <div className='load-row'>
                        <CircularProgress />
                    </div>
                )
            }
            <div className='card-sub-header'>
                <h4>Самые выгодные</h4>
            </div>
            {
                apiMessage.msg
                ? (
                    mostProfitable.map((item, index) => (
                        <div key={index} className='card-row'>
                            <div className='row-left'>
                                <div style={{ width: 30+'px' }}>
                                    {item.way_list_number}
                                </div>
                                <span>
                                    ({item.way_list_year} год,  {item.driver})
                                </span>
                            </div>
                            <div className='row-right'>
                                {(item.income/item.distance).toFixed(2)} руб/км
                            </div>
                        </div>
                    ))
                )
                : (
                    <div className='load-row'>
                        <CircularProgress />
                    </div>
                )
            }
        </div>
    );
}

const getMostProfitable = (data, setMostProfitable) => {
    let tmpData = data; //not to change initial data

    (tmpData.sort((a, b) => a.income/a.distance - b.income/b.distance)).reverse();
    setMostProfitable([tmpData[0], tmpData[1], tmpData[2]]);
}

const getMostMoney = (data, setMostMoney) => {
    let tmpData = data; //not to change initial data

    (tmpData.sort((a, b) => a.income - b.income)).reverse();
    setMostMoney([tmpData[0], tmpData[1], tmpData[2]]);
}

const getMainData = async (getTokenSilently, setApiMessage) => {
    try {
        const token = await getTokenSilently();

        const response = await fetch("http://localhost:3001/api/getMain", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        const responseData = await response.json();
        setApiMessage(responseData);
    } catch (err) {
        console.log(err);
    }
}

export default BestWayList;