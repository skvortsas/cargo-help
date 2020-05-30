import React from 'react';
import { Card } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';

import DetailedTable from '../DetailedTable';
import { useAuth0 } from "../../../react-auth0-spa";
import AddTruckUnitDialog from './AddTruckUnit';
import DeleteDialog from '../../main/DeleteDialog';

const Truck = (props) => {
    const { enqueueSnackbar } = useSnackbar();
    const { getTokenSilently } = useAuth0();
    const [ apiMessage, setApiMessage ] = React.useState({});
    const [ updateResponse, setUpdateResponse ] = React.useState({});
    const [ deleteResponse, setDeleteResponse ] = React.useState({});
    const [skipPageReset, setSkipPageReset] = React.useState(false);

    const handleClickVariant = (message ,variant) => {
        enqueueSnackbar(message, { variant });
    };

    const tractorColumns = React.useMemo(
        () => [
            {
                Header: 'Спидометр при выезде',
                accessor: 'speedometer_start',
            },
            {
                Header: 'Спидометр при возвращении',
                accessor: 'speedometer_end'
            },
            {
                Header: 'Топливо при выезде',
                accessor: 'fuel_start'
            },
            {
                Header: 'Топливо при возвращении',
                accessor: 'fuel_end'
            },
            {
                Header: 'Общий киллометраж',
                accessor: 'traveled_in_all'
            },
            {
                Header: 'Общий расход(л)',
                accessor: 'fuel_in_all'
            },
            {
                Header: 'Средний расход(л/100км)',
                accessor: 'average_fuel_in_distance'
            },
        ], []
    );

    const installationColumns = React.useMemo(
        () => [
            {
                Header: 'Моточасы при выезде',
                accessor: 'instal_speedometer_start',
            },
            {
                Header: 'Моточасы при возвращении',
                accessor: 'instal_speedometer_end'
            },
            {
                Header: 'Топливо при выезде',
                accessor: 'instal_fuel_start'
            },
            {
                Header: 'Топливо при возвращении',
                accessor: 'instal_fuel_end'
            },
            {
                Header: 'Моточасы за рейс',
                accessor: 'instal_traveled_in_all'
            },
            {
                Header: 'Общий расход(л)',
                accessor: 'instal_fuel_in_all'
            },
            {
                Header: 'Средний расход(л/час)',
                accessor: 'instal_average_fuel_in_distance'
            },
        ], []
    );

    const financeColumns = React.useMemo(
        () => [
            {
                Header: 'Выдано',
                accessor: 'truck_recieved',
            },
            {
                Header: 'Сдано',
                accessor: 'truck_delivered'
            },
            {
                Header: 'Суточные',
                accessor: 'daily_money'
            },
            {
                Header: 'Расходы в рейсе',
                accessor: 'truck_expenses'
            },
            {
                Header: 'Остаток/Долг',
                accessor: 'truck_result'
            },
        ], []
    );

    const getTruckData = async () => {
        const wayListNubmer = props.number;
        const wayListYear = props.year;

    try {
      const token = await getTokenSilently();

      const response = await fetch("http://localhost:3001/api/getTruck?number=" + wayListNubmer + '&year=' + wayListYear, {
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
        getTruckData();
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
        
                const response = await fetch('http://localhost:3001/api/deleteTruck', {
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
              getTruckData();
            }
          }

    const updateMyData = (rowIndex, columnId, value) => {
        // We also turn on the flag to not reset the page
        setSkipPageReset(true);
        setApiMessage(async old => {
            const wayListNumber = props.number;
            const wayListYear = props.year;
            const newValue = value;
            const column = columnId;

            const updateBody = {
                "number": wayListNumber,
                "year": wayListYear,
                "value": newValue,
                "column": column
            }
            try {
                const token = await getTokenSilently();

                const response = await fetch('http://localhost:3001/api/updateTruck', {
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
                    old.msg[0].fuel_in_all = old.msg[0].fuel_in_all - old.msg[0].fuel_start + old.msg[0].fuel_end;
                    old.msg[0].instal_fuel_in_all = old.msg[0].instal_fuel_in_all - old.msg[0].instal_fuel_start + old.msg[0].instal_fuel_end;
                    old.msg[0][columnId] = Number(value);
                    updateCountableCells(old.msg[0]);
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
            "speedometerStart": unit.speedometer_start,
            "speedometerEnd": unit.speedometer_end,
            "fuelStart": unit.fuel_start,
            "fuelEnd": unit.fuel_end,
            "instalSpeedometerStart": unit.instal_speedometer_start,
            "instalSpeedometerEnd": unit.instal_speedometer_end,
            "instalFuelStart": unit.instal_fuel_start,
            "instalFuelEnd": unit.instal_fuel_end
        }

        try {
            const token = await getTokenSilently();

            const response = await fetch('http://localhost:3001/api/addTruck', {
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
            getTruckData();
        }
      };

    return(
        <div>
            {
                apiMessage.msg
                ? apiMessage.msg.length
                    ? (<div className='button-row-add-way-list'>
                            <DeleteDialog 
                                id={apiMessage.msg[0].id}
                                deleteUnitHandler={deleteUnitHandler} />
                        </div>)
                    :(<div className='button-row-add-way-list'>
                        <AddTruckUnitDialog addUnitHandler={addUnitHandler} />
                    </div>)
                : ('')
            }
            <Card className='detailed-card'>
                <div className='table-title'>
                    <h2>Тягач</h2>
                </div>
                {
                    apiMessage.msg
                    ? (<DetailedTable
                    columns={tractorColumns}
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
            <Card className='detailed-card'>
                <div className='table-title'>
                    <h2>Инсталяция</h2>
                </div>
                {
                    apiMessage.msg
                    ? <DetailedTable
                    columns={installationColumns}
                    data={apiMessage.msg}
                    updateMyData={updateMyData}
                    skipPageReset={skipPageReset} />
                    : (
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <CircularProgress />
                        </div>
                    )
                }
            </Card>
            <Card className='detailed-card'>
                <div className='table-title'>
                    <h2>Остаток/Долг</h2>
                </div>
                {
                    apiMessage.msg
                    ? <DetailedTable
                    columns={financeColumns}
                    data={apiMessage.msg}
                    updateMyData={updateMyData}
                    skipPageReset={skipPageReset} />
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

const updateCountableCells = old => {
    old.traveled_in_all = old.speedometer_end - old.speedometer_start;
    old.fuel_in_all = old.fuel_in_all - old.fuel_end + old.fuel_start;
    old.average_fuel_in_distance = (old.fuel_in_all / old.traveled_in_all * 100).toFixed(2);
    old.instal_traveled_in_all = old.instal_speedometer_end - old.instal_speedometer_start;
    old.instal_fuel_in_all = old.instal_fuel_in_all - old.instal_fuel_end + old.instal_fuel_start;
    old.instal_average_fuel_in_distance = (old.instal_fuel_in_all/old.instal_traveled_in_all).toFixed(2);
}

const getError = errno => {
    console.log(errno);
    switch(errno) {
      case 1265:
      case 1292:
        return 'В этой ячейке нельзя оставлять пустое поле';
      case 1366:
        return 'Неподходящее значение в ячейке';
      default:
          return 'Неизвестная ошибка';
    }
  }

export default Truck;