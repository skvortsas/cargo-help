import React from 'react';
import { Card } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';

import DetailedTable from '../DetailedTable';
import { useAuth0 } from "../../../react-auth0-spa";
import AddExpensesUnit from './AddExpensesUnit';

const Expenses = (props) => {
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
                Header: 'Местонахождение',
                accessor: 'location',
            },
            {
                Header: 'Дата',
                accessor: 'date'
            },
            {
                Header: 'Сумма',
                accessor: 'cost'
            },
            {
                Header: 'Нарушение/Расходы',
                accessor: 'expenses'
            },
            {
                Header: 'Комментарий',
                accessor: 'comments'
            },
        ], []
    );

    const getExpensesData = async () => {
        const wayListNubmer = props.number;
        const wayListYear = props.year;

    try {
      const token = await getTokenSilently();

      const response = await fetch("http://localhost:3001/api/getExpenses?number=" + wayListNubmer + '&year=' + wayListYear, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const responseData = await response.json();

      for (let i = 0; i < responseData.msg.length; i++) {
        if (!responseData.msg[i].cost) {
            responseData.msg[i].cost = 0;
        }
      }

      setApiMessage(responseData);
    } catch (error) {
      console.error(error);
    }
    }

    React.useEffect(() => {
        getExpensesData();
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

              const response = await fetch('http://localhost:3001/api/updateExpenses', {
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
            "location": unit.location,
            "date": formatDate(unit.date),
            "cost": unit.cost,
            "expenses": unit.expenses,
            "comments": unit.comments
        }

        try {
            const token = await getTokenSilently();

            const response = await fetch('http://localhost:3001/api/addExpense', {
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
            getExpensesData();
        }
      };

    return(
        <div>
            {
                apiMessage.msg
                ? (<div className='button-row-add-way-list'>
                    <AddExpensesUnit addUnitHandler={addUnitHandler}/>
                  </div>)
                : ('')
            }
            <Card className='detailed-card'>
                <div className='table-title'>
                    <h2>Расходы</h2>
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

export default Expenses;