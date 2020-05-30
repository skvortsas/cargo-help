import React, { useState, useEffect } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import { useAuth0 } from "../../react-auth0-spa";

const MostExpensiveDrivers = () => {
    const { getTokenSilently } = useAuth0();
    const [ popularParts, setPopularParts ] = useState([]);
    const [ popularTractor, setPopularTractor ] = useState([]);
    const [ readyPage, setReadyPage ] = useState({ parts: false, tractor: false });

    useEffect(() => {
        getPopularParts(getTokenSilently, setPopularParts);
        getPopularTractor(getTokenSilently, setPopularTractor);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (popularParts.msg) {
            getThree(popularParts.msg, setPopularParts, 'parts');
        }
        // eslint-disable-next-line
    }, [popularParts]);

    useEffect(() => {
        if (popularTractor.msg) {
            getThree(popularTractor.msg, setPopularTractor, 'tractor');
        }
        // eslint-disable-next-line
    }, [popularTractor]);

    const getThree = async (items, setItems, itemName) => {
        if (items.length > 3) {
            await setItems([items[0], items[1], items[2]]);
        } 
    
        await itemName === 'parts' ? setReadyPage({...readyPage, parts: true}) : setReadyPage({...readyPage, tractor: true});
    }

    return (
        <div>
            <div className='card-header'>
                <h2>Запчасти</h2>
            </div>
            <hr />
            <div className='card-sub-header'>
                <h4>Самые популярные запчасти</h4>
            </div>
            {
                readyPage.parts
                ? (
                    (popularParts.msg).map((item, index) => (
                        <div key={index} className='card-row'>
                            <div className='row-left'>
                                { item.part_name }
                            </div>
                            <div className='row-right'>
                                { item.sum }
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
                <h4>Самые ломающиеся тягачи</h4>
            </div>
            {
                readyPage.tractor
                ? (
                    (popularTractor.msg).map((item, index) => (
                        <div key={index} className='card-row'>
                            <div className='row-left'>
                                { item.number_of_tractor }
                            </div>
                            <div className='row-right'>
                                { item.sum }
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

const getPopularParts = async (getTokenSilently, setPopularParts) => {
    try {
        const token = await getTokenSilently();

        const response = await fetch("http://localhost:3001/api/popularParts", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        const responseData = await response.json();
        setPopularParts(responseData);
    } catch(err) {
        console.log(err);
    }
}

const getPopularTractor = async (getTokenSilently, setPopularTractor) => {
    try {
        const token = await getTokenSilently();

        const response = await fetch("http://localhost:3001/api/tractorParts", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const responseData = await response.json();
        setPopularTractor(responseData);
    } catch(err) {
        console.log(err);
    }
}

export default MostExpensiveDrivers;