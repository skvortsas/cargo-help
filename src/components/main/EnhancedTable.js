import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useAuth0 } from "../../react-auth0-spa";

import MaUTable from '@material-ui/core/Table';
import PropTypes from 'prop-types';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from './TablePaginationActions';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableToolbar from './TableToolbar';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import ErrorTwoToneIcon from '@material-ui/icons/ErrorTwoTone';
import Tooltip from '@material-ui/core/Tooltip';
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const tooltipRows = [
  'Расстояние',
  'Ср. расход тягача',
  'Ср. расход рефа',
  'Заработано',
  'Расходы',
  'Топливо'
]

const spanStyle = {
  padding: 0,
  margin: 0,
  border: 0,
  fontSize: 1+'rem',
  background: 'transparent',
  outline: 'none',
}

const editIconStyles = {
    height: 15+'px',
}

const inputRowStyle = {
    display: 'flex',
    alignItems: 'center'
}

const useTableStyles = makeStyles(theme => ({
    paper: {
        width: 100+'%',
    },
    container: {
        maxHeight: 65+'vh',
    },
  }))

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);
  const [editable, setEditable] = useState(false);

  const onChange = e => {
    setValue(e.target.value)
  }

  const onClick = e => {
      setEditable(true);
  }

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    setEditable(false);
    updateMyData(index, id, value);
  }

  const onBlurDistance = () => {
    setEditable(false);
    updateMyData(index, 'speedometer_end', value);
  }

  const onInputClick = e => {
      console.log('clicked on ', e.target);
  }

  const inputOnEnterPressed = e => {
    if (e.keyCode === 13) {
      e.target.blur();
    }
  }

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    
        editable
        ? id === 'distance'
          ? (
          <input
            value={value}
            onChange={onChange}
            onBlur={onBlurDistance}
            onKeyUp={inputOnEnterPressed}
          />)
          : (<input
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onKeyUp={inputOnEnterPressed}
          />)
        : id === 'compound'
          ? (<div>
              {
                value && value.success === true
                ? (
                  <CheckIcon className='success' />
                )
                : value && value.success === false
                  ? (
                    <Tooltip title={
                      <div>
                        <p style={{fontSize: 14+'px'}}>Информация в доп. таблицах:</p>
                        {
                          (Object.entries(value.mistakes)).map((item, index) => (
                          <p className='tooltip-description'>{tooltipRows[index]}{
                            typeof(item[1]) === 'string'
                            ? ''
                            : ': '+item[1]
                          }
                            <span>{
                                  typeof(item[1]) === 'string'
                                  ? <CheckIcon className='success' />
                                  : <ErrorTwoToneIcon className='error' />
                                }
                            </span>
                          </p>
                          ))
                        }
                      </div>
                    }>
                      <ErrorTwoToneIcon className='error' />
                    </Tooltip>
                  )
                  : (
                    <Tooltip title={
                      <p style={{fontSize: 14+'px'}}>Не заполнены дополнительные таблицы</p>
                    }>
                      <ErrorTwoToneIcon className='error' />
                    </Tooltip>
                  )
              }
            </div>)
          : (
            <div style={inputRowStyle}>
                {
                  id === 'car_parts' || id === 'wheels' || id === 'income'
                  || id === 'driver_salary' || id === 'compound'
                  ? ('')
                  : (<EditIcon 
                    style={editIconStyles}
                    onClick={onClick}/>)
                }
                {
                  id === 'distance' || id === 'average_fuel_tractor'
                  || id === 'average_fuel_installation'
                  ? (<Link to='way-list'>
                    <input
                style={spanStyle}
                value={value}
                onClick={onInputClick}
                disabled
                />
                  </Link>)
                  : <input
                  style={spanStyle}
                  value={value}
                  onClick={onInputClick}
                  disabled
                  />
                }
          </div>
          )
    
  )
}

EditableCell.propTypes = {
  cell: PropTypes.shape({
    value: PropTypes.any.isRequired,
  }),
  row: PropTypes.shape({
    index: PropTypes.number.isRequired,
  }),
  column: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  updateMyData: PropTypes.func.isRequired,
}

  // Set our editable cell renderer as the default Cell renderer
  const defaultColumn = {
    Cell: EditableCell,
  }



const EnhancedTable = ({
  columns,
  data,
  updateMyData,
  skipPageReset,
  searchQuery,
  setSearchQuery,
  selectValue,
  setSelectValue,
  getMainData,
  formatDate
}) => {
  const classes = useTableStyles();
  const [toast, setToast] = useState(false);
  const [addResponse, setAddResponse] = useState({});
  const { getTokenSilently } = useAuth0();

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
    if(addResponse.success) {
      toastOpen();
    }
  }, [addResponse]);

  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      autoResetPage: !skipPageReset,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  )

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setPageSize(Number(event.target.value))
  }
  const addUserHandler = async user => {
    const postBody = {
        "number": user.way_list_number,
        "year": user.way_list_year,
        "driver": user.driver,
        "number_of_tractor": user.number_of_tractor,
        "number_of_installation": user.number_of_installation,
        "date_start": formatDate(user.date_start),
        "date_end": formatDate(user.date_end),
        "speedometer_start": user.speedometer_start,
        "speedometer_end": user.speedometer_end,
        "average_tractor_expenses": user.average_tractor_expenses,
        "average_installation_expenses": user.average_installation_expenses,
        "earned": user.earned,
        "expenses": user.expenses,
        "fuel": user.fuel,
    }

    try {
        const token = await getTokenSilently();

        const response = await fetch('http://localhost:3001/api/addMain', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postBody)
            });

            const responseData = await response.json();

            setAddResponse(responseData);
    } catch (err) {
        console.log(err);
    } finally {
        getMainData();
    }
  };

  // Render the UI for your table
  return (
      <>
    <TableContainer className={classes.container}>
      <MaUTable stickyHeader aria-label="sticky table" {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell
                  {...(column.id === 'selection'
                    ? column.getHeaderProps()
                    : column.getHeaderProps(column.getSortByToggleProps()))}
                >
                  {column.render('Header')}
                  {column.id !== 'selection' ? (
                    <TableSortLabel
                      active={column.isSorted}
                      // react-table has a unsorted state which is not treated here
                      direction={column.isSortedDesc ? 'desc' : 'asc'}
                    />
                  ) : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <TableCell {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </MaUTable>
    </TableContainer>
        <TablePagination
        rowsPerPageOptions={[
        5,
        10,
        25,
        { label: 'Все', value: data.length },
        ]}
        colSpan={3}
        count={data.length}
        rowsPerPage={pageSize}
        page={pageIndex}
        SelectProps={{
        inputProps: { 'aria-label': 'rows per page' },
        native: false,
        }}
        labelRowsPerPage = 'Строк на странице'
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
    />
  <TableToolbar
        addUserHandler={addUserHandler}
        setGlobalFilter={setGlobalFilter}
        globalFilter={globalFilter}
        columns={columns}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectValue={selectValue}
        setSelectValue={setSelectValue}
      />
      <Snackbar
        open={toast}
        autoHideDuration={2000}
        onClose={handleToastClose}
      >
          <Alert onClose={handleToastClose} severity={addResponse.success ? "success" : "error"}>
          {
            addResponse.success ? "Успешно обновлено" : "Произошла ошибка"
          }
        </Alert>
      </Snackbar>
      </>
  )
}

EnhancedTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  updateMyData: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  skipPageReset: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  selectValue: PropTypes.string.isRequired,
  setSelectValue: PropTypes.func.isRequired,
}

export default EnhancedTable
