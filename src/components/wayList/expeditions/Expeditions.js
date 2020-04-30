import React from 'react';
import { Card } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';

import DetailedTable from '../DetailedTable';
import { useAuth0 } from "../../../react-auth0-spa";
import AddExpeditionsUnitDialog from './AddExpeditionsUnit';

const Expeditions = (props) => {
    const { enqueueSnackbar } = useSnackbar();
    const { getTokenSilently } = useAuth0();
    const [ apiMessage, setApiMessage ] = React.useState({});
    const [ updateResponse, setUpdateResponse ] = React.useState({});

    const handleClickVariant = (message ,variant) => {
        if (variant === 'success') {
            enqueueSnackbar(message, { variant });
        } else if(variant === 'error') {
            enqueueSnackbar(message, { variant });
        }
    };

    const columns = React.useMemo(
        () => [
            {
                Header: 'Маршрут',
                accessor: 'expedition',
            },
            {
                Header: 'Дата',
                accessor: 'date'
            },
            {
                Header: 'Груз',
                accessor: 'cargo'
            },
            {
                Header: 'Нал/Безнал',
                accessor: 'cash'
            },
        ], []
    );

    const getExpeditionsData = async () => {
        const wayListNubmer = props.number;
        const wayListYear = props.year;

    try {
      const token = await getTokenSilently();

      const response = await fetch("http://localhost:3001/api/getExpeditions?number=" + wayListNubmer + '&year=' + wayListYear, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const responseData = await response.json();

      setApiMessage(responseData);
    } catch (error) {
      console.error(error);
    }
    }

    React.useEffect(() => {
        getExpeditionsData();
    }, []);

    React.useEffect(() => {
        if (updateResponse.success === true) {
            handleClickVariant(updateResponse.msg ,'success');
        } else if(updateResponse.success === false) {
            handleClickVariant(updateResponse.msg, 'error');
        }
    }, [updateResponse]);

    const [skipPageReset, setSkipPageReset] = React.useState(false);

    const updateMyData = (rowIndex, columnId, value) => {
        // We also turn on the flag to not reset the page
        setSkipPageReset(true);
        setApiMessage(async old => {
            let newValue = value;
            const column = columnId;
            let id = undefined;

            old.msg.map((row, index) => {
                if (index === rowIndex) {
                    id = old.msg[index].id;
                    newValue = columnId === 'date' ? formatDate(newValue) : newValue;
                }
            })

            const updateBody = {
                "id": id,
                "value": newValue,
                "column": column
            }
            try {
                const token = await getTokenSilently();

                const response = await fetch('http://localhost:3001/api/updateExpeditions', {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateBody)
                });
                
                const responseData = await response.json();

                setUpdateResponse(responseData);
            } catch (err) {
                console.log(err);
            } finally {
                old.msg[rowIndex][columnId] = value;
                setApiMessage(old);
                return old;
            }
        }
        )
      }

      const addUnitHandler = async unit => {
        const postBody = {
            "number": props.number,
            "year": props.year,
            "expedition": unit.expedition,
            "date": formatDate(unit.date),
            "cargo": unit.cargo,
            "cash": unit.cash
        }

        try {
            const token = await getTokenSilently();

            const response = await fetch('http://localhost:3001/api/addExpedition', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postBody)
                });

                const responseData = await response.json();

                responseData.success
              ? handleClickVariant(responseData.msg ,'success')
              : handleClickVariant(responseData.msg ,'error');
        } catch (err) {
            console.log(err);
        } finally {
            getExpeditionsData();
        }
      };

    return(
        <div>
            {
                apiMessage.msg
                ? (<div className='button-row-add-way-list'>
                    <AddExpeditionsUnitDialog addUnitHandler={addUnitHandler}/>
                  </div>)
                : ('')
            }
            <Card className='detailed-card'>
                <div className='table-title'>
                    <h2>Маршруты</h2>
                </div>
                {
                    apiMessage.msg
                    ? (<DetailedTable
                    columns={columns}
                    data={apiMessage.msg}
                    updateMyData={updateMyData}
                    skipPageReset={skipPageReset} />)
                    : (
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <CircularProgress />
                        </div>
                    )
                }
            </Card>
        </div>
    );
}

const formatDate = dateString => {
    let dates = dateString.split('.');
    return([dates[2], dates[1], dates[0]].join('-'));
}

export default Expeditions;