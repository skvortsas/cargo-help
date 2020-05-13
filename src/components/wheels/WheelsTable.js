import React from 'react';
import { Card } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';

import DetailedTable from '../wayList/DetailedTable';
import { useAuth0 } from "../../react-auth0-spa";
import AddWheelsUnit from './AddWheelsUnit';
import { dateCheck } from '../../inputChecks';
import { VpnLock } from '@material-ui/icons';

const WheelsTable = (props) => {
    const { enqueueSnackbar } = useSnackbar();
    const { getTokenSilently } = useAuth0();
    const [ apiMessage, setApiMessage ] = React.useState({});
    const [ updateResponse, setUpdateResponse ] = React.useState({});
    const [skipPageReset, setSkipPageReset] = React.useState(false);
    const [ deleteResponse, setDeleteResponse ] = React.useState({});

    const handleClickVariant = (message ,variant) => {
        enqueueSnackbar(message, { variant });
    };

    const columns = React.useMemo(
        () => [
            {
                Header: '',
                accessor: 'delete'
            },
            {
                Header: 'Дата',
                accessor: 'date',
            },
            {
                Header: 'Наз. запчасти',
                accessor: 'part_name'
            },
            {
                Header: 'Количество',
                accessor: 'amount'
            },
            {
                Header: 'Стоимость',
                accessor: 'cost'
            },
            {
                Header: 'Тягач/Реф',
                accessor: 'to_tractor'
            },
            {
                Header: 'Колеса',
                accessor: 'is_wheel'
            },
            {
                Header: 'Комментарии',
                accessor: 'comments'
            },
        ], []
    );

    const getWheelsData = async () => {
        const wayListNubmer = props.number;
        const wayListYear = props.year;

    try {
      const token = await getTokenSilently();

      const response = await fetch("http://localhost:3001/api/getWheels?number=" + wayListNubmer + '&year=' + wayListYear, {
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
        getWheelsData();
    }, []);

    React.useEffect(() => {
      if (updateResponse.success === true) {
          handleClickVariant(updateResponse.msg ,'success');
      } else if(updateResponse.success === false) {
          handleClickVariant(getError(updateResponse.msg), 'error');
      }
  }, [updateResponse]);


  React.useEffect(() => {
    if (typeof(deleteResponse.success) === 'boolean') {
        deleteResponse.success
        ? handleClickVariant(deleteResponse.msg ,'success')
        : handleClickVariant(deleteResponse.msg ,'error')
    }
  }, [deleteResponse]);

    const deleteUnitHandler = async unit => {
        const deleteBody = {
          "id": unit.id
      }
    
        try {
            const token = await getTokenSilently();
    
            const response = await fetch('http://localhost:3001/api/deleteWheel', {
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
          getWheelsData();
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
          })

          const updateBody = {
              "id": id,
              "value": newValue,
              "column": column
          }
          try {
              const token = await getTokenSilently();

              const response = await fetch('http://localhost:3001/api/updateWheels', {
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
            old.msg[rowIndex][columnId] = 
                columnId === 'to_tractor' || columnId === 'is_wheel'
                ? columnId === 'to_tractor'
                    ? value > 0
                        ? 'Тягач'
                        : 'Реф'
                    : value > 0
                        ? 'Колёса'
                        : 'Не колёса'
                : value //just tried this way of assignment; usually I would make a function
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
          "date": formatDate(unit.date),
          "part_name": unit.part_name,
          "amount": unit.amount,
          "cost": unit.cost,
          "to_tractor": unit.to_tractor,
          "is_wheel": unit.is_wheel,
          "comments": unit.comments
      }

      try {
          const token = await getTokenSilently();

          const response = await fetch('http://localhost:3001/api/addWheels', {
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
          getWheelsData();
      }
    };

    return(
        <div>
          {
                apiMessage.msg
                ? (<div className='button-row-add-wheels'>
                    <AddWheelsUnit addUnitHandler={addUnitHandler}/>
                  </div>)
                : ('')
            }
            <Card className='wheels-detailed-card'>
                <div className='table-title'>
                    <h2>Запчасти</h2>
                </div>
                {
                    apiMessage.msg
                    ? (<DetailedTable
                    columns={columns}
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

const getError = errno => {
  console.log(errno);
  switch(errno) {
    case 1265:
    case 1292:
      return 'Неправильный ввод';
    case 1366:
      return 'Неподходящее значение в ячейке';
  }
}

export default WheelsTable;