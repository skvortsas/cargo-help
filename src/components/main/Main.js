import React, { useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

import CssBaseline from '@material-ui/core/CssBaseline';
import EnhancedTable from './EnhancedTable';
import { useAuth0 } from "../../react-auth0-spa";
import '../styles/main.scss';
import { dateCheck } from '../../inputChecks';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const App = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: '',
        accessor: 'compound',
      },
      {
        Header: '',
        accessor: 'delete'
      },
      {
        Header: '№ путевого',
        accessor: 'way_list_number',
      },
      {
        Header: 'Водитель',
        accessor: 'driver',
      },
      {
        Header: '№ тягача',
        accessor: 'number_of_tractor',
      },
      {
        Header: '№ инсталяции',
        accessor: 'number_of_installation',
      },
      {
        Header: 'Дата отбытия',
        accessor: 'date_start',
      },
      {
        Header: 'Дата прибытия',
        accessor: 'date_end',
      },
      {
        Header: 'Пройдено КМ',
        accessor: 'distance'
      },
      {
        Header: 'Ср. расход тягача',
        accessor: 'average_tractor_expenses',
      },
      {
        Header: 'Ср. расход инсталяции',
        accessor: 'average_installation_expenses',
      },
      {
        Header: 'Заработано',
        accessor: 'earned'
      },
      {
        Header: 'Расходы',
        accessor: 'expenses'
      },
      {
        Header: 'Топливо',
        accessor: 'fuel'
      },
      {
          Header: 'Запчасти',
          accessor: 'car_parts'
      },
      {
          Header: 'Колеса',
          accessor: 'wheels'
      },
      {
          Header: 'Зп водителя',
          accessor: 'driver_salary'
      },
      {
          Header: 'Доход',
          accessor: 'income'
      }
    ],
    []
  );

  const { getTokenSilently } = useAuth0();
  const [toast, setToast] = useState(false);
  const [apiMessage, setApiMessage] = useState({});
  const [ updateResponse, setUpdateResponse ] = useState({});
  const [skipPageReset, setSkipPageReset] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectValue, setSelectValue] = useState('');

  const getMainData = async () => {
try {
  const token = await getTokenSilently();

  const response = await fetch("http://localhost:3001/api/getMain", {
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

useEffect(() => {
  getMainData();
  // eslint-disable-next-line
}, []);

const toastOpen = () => {
  setToast(true);
};

const handleToastClose = (event, reason) => {
  if (reason === 'clickaway') {
      return;
    }

  setToast(false);
};

useEffect(() => {
  if (typeof(updateResponse.success) === "boolean") {
    toastOpen();
  }
}, [updateResponse]);

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
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
                || columnId === 'date_end'){
                  newValue = dateCheck(newValue) ? newValue = formatDate(newValue) : null;
                }
        }
        return row;
    })

      const updateBody = {
          "id": id,
          "value": newValue,
          "column": column
      }
      try {
          const token = await getTokenSilently();

          const response = await fetch('http://localhost:3001/api/updateMain', {
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
          return getMainData();
      }
  }
  );
  }

  return (
    <div style={{paddingTop: 100+'px'}}>
      <CssBaseline />
      {
        apiMessage.msg
        ? (<EnhancedTable
          columns={columns}
          data={searchQuery 
                  ? selectValue === 'driver'
                      ? (apiMessage.msg).filter(x => ((x[selectValue]).toLowerCase()).includes(searchQuery.toLowerCase()))
                      : selectValue === 'way_list_number'
                      || selectValue === 'number_of_tractor'
                      || selectValue === 'number_of_installation'
                      ? (apiMessage.msg).filter(x => String(x[selectValue]).includes(searchQuery))
                        : selectValue === 'date_start' || selectValue === 'date_end'
                            ? (apiMessage.msg).filter(x => new Date(formatDate(x[selectValue])) >= new Date(searchQuery.from) && new Date(formatDate(x[selectValue])) <= new Date(searchQuery.to))
                            : (apiMessage.msg).filter(x => Number(x[selectValue]) > searchQuery.from && Number(x[selectValue]) < searchQuery.to)
                  : apiMessage.msg}
          setData={setApiMessage}
          updateMyData={updateMyData}
          skipPageReset={skipPageReset}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectValue={selectValue}
          setSelectValue={setSelectValue}
          formatDate={formatDate}
          getMainData={getMainData}
        />)
          : (<div className='load-row'>
            <CircularProgress className='load-circle' />
          </div>)
      }
      <Snackbar
        open={toast}
        autoHideDuration={2000}
        onClose={handleToastClose}
      >
          {
            updateResponse.success === true
            ? (<Alert onClose={handleToastClose} severity="success">
                {updateResponse.msg}
              </Alert>)
            : updateResponse.success === false 
            ? (<Alert onClose={handleToastClose} severity="error">
                {
                  getError(updateResponse.msg)
                }
              </Alert>)
            : false
          }
      </Snackbar>
    </div>
  )
}

function formatDate(dateString) {
  let dates = dateString.split('.');
  return([dates[2], dates[1], dates[0]].join('-'));
}

const getError = errno => {
  console.log(errno);
  switch(errno) {
    case 1265:
    case 1292:
      return 'Неправильный ввод';
    case 1366:
      return 'Неподходящее значение в ячейке';
    default:
      return 'Неизвестная ошибка'
  }
}

export default App