import React from 'react';
import { Card } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';

import DetailedTable from '../DetailedTable';
import { useAuth0 } from "../../../react-auth0-spa";
import AddFuelUnit from './AddFuelUnit';
import { dateCheck } from '../../../inputChecks';

const Fuel = (props) => {
    const { enqueueSnackbar } = useSnackbar();
    const { getTokenSilently } = useAuth0();
    const [ apiMessage, setApiMessage ] = React.useState({});
    const [ updateResponse, setUpdateResponse ] = React.useState({});
    const [ deleteResponse, setDeleteResponse ] = React.useState({});
    const [skipPageReset, setSkipPageReset] = React.useState(false);

    const handleClickVariant = (message ,variant) => {
        enqueueSnackbar(message, { variant });
    };

    const сolumns = React.useMemo(
        () => [
            {
                Header: '',
                accessor: 'delete'
            },
            {
                Header: 'Нал/Безнал',
                accessor: 'by_cash',
            },
            {
                Header: 'Местонахожение',
                accessor: 'location',
            },
            {
                Header: 'Дата',
                accessor: 'date'
            },
            {
                Header: 'Стоимость литра',
                accessor: 'fuel_cost'
            },
            {
                Header: 'Общая сумма',
                accessor: 'cost_in_all'
            },
            {
                Header: 'Залито (тягач)',
                accessor: 'tractor_filled'
            },
            {
                Header: 'Залито (реф)',
                accessor: 'installation_filled'
            },
            {
                Header: 'Поступило',
                accessor: 'filled_indeed'
            },
            {
                Header: 'Итого',
                accessor: 'result'
            },
        ], []
    );

    const getFuelData = async () => {
        const wayListNubmer = props.number;
        const wayListYear = props.year;

    try {
      const token = await getTokenSilently();

      const response = await fetch("http://localhost:3001/api/getFuel?number=" + wayListNubmer + '&year=' + wayListYear, {
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

    React.useEffect(()=> {
        getFuelData();
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        if (updateResponse.success === true) {
            handleClickVariant(updateResponse.msg ,'success');
        } else if(updateResponse.success === false) {
            handleClickVariant(getError(updateResponse.msg), 'error');
        }
        // eslint-disable-next-line
    }, [updateResponse]);

    React.useEffect(() => {
        if (typeof(deleteResponse.success) === 'boolean') {
            deleteResponse.success
            ? handleClickVariant(deleteResponse.msg ,'success')
            : handleClickVariant(deleteResponse.msg ,'error')
        }
        // eslint-disable-next-line
      }, [deleteResponse]);
    
        const deleteUnitHandler = async unit => {
            const deleteBody = {
              "id": unit.id
          }
        
            try {
                const token = await getTokenSilently();
        
                const response = await fetch('http://localhost:3001/api/deleteFuel', {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(deleteBody)
                });
        
                const responseData = await response.json();
                setDeleteResponse(responseData);
            } catch (err) {
                console.log(err);
            } finally {
              getFuelData();
            }
          }

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
                    if (columnId === 'date') {
                        newValue = dateCheck(newValue) ? formatDate(newValue) : null;
                    }
                }
                return row;
            })
  
            const updateBody = {
                "id": id,
                "value": newValue,
                "column": column
            }
            console.log(updateBody);
            try {
                const token = await getTokenSilently();
  
                const response = await fetch('http://localhost:3001/api/updateFuel', {
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
                columnId === 'by_cash' 
                ? value > 0 
                    ? old.msg[rowIndex][columnId] = 'Наличка' 
                    : old.msg[rowIndex][columnId] = 'Безнал' 
                : old.msg[rowIndex][columnId] = value;
                await updateCountableCells(old.msg);
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
            "by_cash": Boolean(unit.by_cash),
            "location": unit.location,
            "date": formatDate(unit.date),
            "fuel_cost": unit.fuel_cost,
            "tractor_filled": unit.tractor_filled,
            "installation_filled": unit.installation_filled,
            "filled_indeed": unit.filled_indeed
        }

        try {
            const token = await getTokenSilently();

            const response = await fetch('http://localhost:3001/api/addFuel', {
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
            getFuelData();
        }
      };

    return(
        <div>
            {
                apiMessage.msg
                ? (<div className='button-row-add-way-list'>
                    <AddFuelUnit addUnitHandler={addUnitHandler}/>
                  </div>)
                : ('')
            }
            <Card className='detailed-card'>
                <div className='table-title'>
                    <h2>Заправки</h2>
                </div>
                {
                    apiMessage.msg
                    ? (<DetailedTable
                    columns={сolumns}
                    data={apiMessage.msg}
                    updateMyData={updateMyData}
                    deleteUnitHandler={deleteUnitHandler}
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
    return([dates[2], dates[1], dates[0]].join('-'));//хз почему но по какой-то причине не обдейтит только первую строку
}

const updateCountableCells = async old => {
    for (let i = 0; i < old.length; i++) {
        let fuel_in_all = Number(old[i].tractor_filled) + Number(old[i].installation_filled);
        old[i].cost_in_all = (old[i].fuel_cost * fuel_in_all).toFixed(2);
        old[i].result = (old[i].tractor_filled - old[i].filled_indeed).toFixed(2);
    }
}

const getError = errno => {
    console.log(errno);
    switch(errno) {
      case 1265:
      case 1292:
        return 'Неверный ввод';
      case 1366:
        return 'Неподходящее значение в ячейке';
      default:
        return 'Неизвестная ошибка';
    }
  }

export default Fuel;