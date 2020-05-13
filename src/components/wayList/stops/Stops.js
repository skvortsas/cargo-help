import React from 'react';
import { Card } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';

import DetailedTable from '../DetailedTable';
import { useAuth0 } from "../../../react-auth0-spa";
import AddStopsUnit from './AddStopsUnit';
import { dateCheck } from '../../../inputChecks';

const Stops = (props) => {
    const { enqueueSnackbar } = useSnackbar();
    const { getTokenSilently } = useAuth0();
    const [ apiMessage, setApiMessage ] = React.useState({});
    const [ updateResponse, setUpdateResponse ] = React.useState({});
    const [ deleteResponse, setDeleteResponse ] = React.useState({});
    const [skipPageReset, setSkipPageReset] = React.useState(false);

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
                Header: 'Местонахождение',
                accessor: 'location',
            },
            {
                Header: 'Дата заезда',
                accessor: 'date_start'
            },
            {
                Header: 'Дата выезда',
                accessor: 'date_end'
            },
            {
                Header: 'Количество суток',
                accessor: 'day_amount'
            },
            {
                Header: 'Цена',
                accessor: 'cost'
            },
            {
                Header: 'ИНН',
                accessor: 'inn'
            },
            {
                Header: 'Комментарии',
                accessor: 'comments'
            },
        ], []
    );

    const getStopsData = async () => {
        const wayListNubmer = props.number;
        const wayListYear = props.year;

    try {
      const token = await getTokenSilently();

      const response = await fetch("http://localhost:3001/api/getStops?number=" + wayListNubmer + '&year=' + wayListYear, {
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
        getStopsData();
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
    
            const response = await fetch('http://localhost:3001/api/deleteStop', {
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
          getStopsData();
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
                  if (columnId === 'date_start'
                    || columnId === 'date_end') {
                      newValue = dateCheck(newValue) ? formatDate(newValue) : null;
                    }
              }
          })

          const updateBody = {
              "id": id,
              "value": newValue,
              "column": column
          }
          console.log(updateBody);
          try {
              const token = await getTokenSilently();

              const response = await fetch('http://localhost:3001/api/updateStops', {
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
          "location": unit.location,
          "date_start": formatDate(unit.date_start),
          "date_end": formatDate(unit.date_end),
          "cost": unit.cost,
          "inn": unit.inn,
          "comments": unit.comments
      }

      try {
          const token = await getTokenSilently();

          const response = await fetch('http://localhost:3001/api/addStop', {
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
          getStopsData();
      }
    };

    return(
        <div>
          {
                apiMessage.msg
                ? (<div className='button-row-add-way-list'>
                    <AddStopsUnit addUnitHandler={addUnitHandler}/>
                  </div>)
                : ('')
            }
            <Card className='detailed-card'>
                <div className='table-title'>
                    <h2>Остановки</h2>
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

const updateCountableCells = async old => {
  for (let i = 0; i < old.length; i++) {
    let date_start = new Date(formatDate(old[i].date_start));
    let date_end = new Date(formatDate(old[i].date_end));
    let difference = date_end - date_start;
    let differenceDays = Math.ceil(difference/(1000 * 60 * 60 * 24));
    old[i].day_amount = differenceDays;
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
  }
}

export default Stops;