import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Card } from '@material-ui/core';

import BestWayList from './BestWayList';
import BestDrivers from './BestDrivers';
import MostExpensiveDrivers from './BestWheels';
import Profit from './Profit';
import Expenses from './Expenses';
import '../styles/statistics.scss';

const Statistics = () => {

    return(
        <div style={{paddingTop: 120+'px', marginBottom: 50+'px'}}>
            <CssBaseline />
            <div className='statistic-cards'>
                <Card className='card'>
                    <BestWayList />
                </Card>
                <Card className='card'>
                    <BestDrivers />
                </Card>
                <Card className='card'>
                    <MostExpensiveDrivers />
                </Card>
                <div className='chart-row'>
                    <Profit />
                    <Expenses />
                </div>
            </div>
        </div>
    );
}

export default Statistics;