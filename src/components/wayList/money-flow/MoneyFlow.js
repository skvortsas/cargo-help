import React from 'react';
import { Card } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';

import DetailedTable from '../DetailedTable';
import { useAuth0 } from "../../../react-auth0-spa";
import AddMoneyFlowUnit from './AddMoneyFlowUnit';

const MoneyFlow = (props) => {
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
                Header: 'Дата',
                accessor: 'date'
            },
            {
                Header: 'Получено',
                accessor: 'recieved'
            },
            {
                Header: 'Сдано',
                accessor: 'delivered'
            },
            {
                Header: 'Комментарий',
                accessor: 'comments'
            },
        ], []
    );

    const getMoneyFlowData = async () => {
        const wayListNubmer = props.number;
        const wayListYear = props.year;

    try {
      const token = await getTokenSilently();

      const response = await fetch("http://localhost:3001/api/getMoneyFlow?number=" + wayListNubmer + '&year=' + wayListYear, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const responseData = await response.json();

      for (let i = 0; i < responseData.msg.length; i++) {
        if (!responseData.msg[i].delivered) {
            responseData.msg[i].delivered = 0;
        }
        if(!responseData.msg[i].recieved) {
            responseData.msg[i].recieved = 0;
        }
      }

      setApiMessage(responseData);
    } catch (error) {
      console.error(error);
    }
    }

    React.useEffect(() => {
        getMoneyFlowData();
    }, []);

    React.useEffect(() => {
      if (updateResponse.success === true) {
          handleClickVariant(updateResponse.msg ,'success');
      } else if(updateResponse.success === false) {
          handleClickVariant(getError(updateResponse.msg), 'error');
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
          console.log(updateBody);
          try {
              const token = await getTokenSilently();

              const response = await fetch('http://localhost:3001/api/updateMoneyFlow', {
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
          "date": formatDate(unit.date),
          "recieved": unit.recieved,
          "delivered": unit.delivered,
          "comments": unit.comments
      }

      try {
          const token = await getTokenSilently();

          const response = await fetch('http://localhost:3001/api/addMoneyFlow', {
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
          getMoneyFlowData();
      }
    };

    return(
        <div>
          {
                apiMessage.msg
                ? (<div className='button-row-add-way-list'>
                    <AddMoneyFlowUnit addUnitHandler={addUnitHandler}/>
                  </div>)
                : ('')
            }
            <Card className='detailed-card'>
                <div className='table-title'>
                    <h2>Полученные/Сданные деньги</h2>
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

const getError = errno => {
  console.log(errno);
  switch(errno) {
    case 1265:
    case 1292:
      return 'В этой ячейке нельзя оставлять пустое поле';
    case 1366:
      return 'Неподходящее значение в ячейке';
  }
}

export default MoneyFlow;