import React, { useState, useEffect } from 'react';

import Table from '@material-ui/core/Table';
import PropTypes from 'prop-types';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow'
import { useTable, useSortBy } from 'react-table';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const forbiddenToEditInputs = ['traveled_in_all', 'fuel_in_all', 'average_fuel_in_distance',
                                'instal_traveled_in_all', 'instal_fuel_in_all', 'instal_average_fuel_in_distance',
                                'truck_recieved', 'truck_delivered', 'daily_money', 'truck_expenses', 'truck_result',
                                'cost_in_all', 'result', 'day_amount'];

const useTableStyles = makeStyles(theme => ({
    container: {
        maxHeight: 58+'vh',
    },
  }))

const spanStyle = {
    padding: 0,
    margin: 0,
    border: 0,
    fontSize: 1+'rem',
    background: 'transparent',
    outline: 'none',
    color: 'unset',
  }

const editIconStyles = {
    height: 15+'px',
}

const inputRowStyle = {
    display: 'flex',
    alignItems: 'center'
}

const cashedFuel = {
    color: 'red',
}

// Create an editable cell renderer
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
  
    const onInputClick = e => {
        console.log('clicked on ', e.target.value);
    }
  
    // If the initialValue is changed externall, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue)
    }, [initialValue])
  
    return (
      
          editable
          ? (<input
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            />)
            : (
              <div style={inputRowStyle}>
                  {
                      !forbiddenToEditInputs.includes(id)
                      ? <EditIcon 
                      style={editIconStyles}
                      onClick={onClick}/>
                      : false
                  }
                  <input
                  style={spanStyle}
                  value={value}
                  onClick={onInputClick}
                  />
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

  const DetailedTable = ({
        columns,
        data,
        updateMyData,
        skipPageReset,
  }) => {
    const classes = useTableStyles();

    const {
        getTableProps,
        headerGroups,
        prepareRow,
        rows
      } = useTable({
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
      }, useSortBy);

      return(
          <div className='detailed-table'>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table" {...getTableProps()}>
                    <TableHead>
                        {headerGroups.map(headerGroup => (
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <TableCell
                                    {...(column.id === 'selection'
                                    ? column.getHeaderProps()
                                    : column.getHeaderProps(column.getSortByToggleProps()))}>
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
                        {
                            rows.map((row, i) => {
                                prepareRow(row);
                                return(
                                    <TableRow {...row.getRowProps()}>
                                        {
                                            row.cells.map(cell => (
                                                <TableCell {...cell.getCellProps()}
                                                style={cell.row.original.by_cash === 'Наличка' ? cashedFuel : {}}>
                                                    { cell.render('Cell') }
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
          </div>
      )
  }

  DetailedTable.PropsTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    updateMyData: PropTypes.func.isRequired,
    skipPageReset: PropTypes.bool.isRequired,
  }

  export default DetailedTable;