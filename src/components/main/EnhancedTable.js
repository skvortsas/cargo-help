import React, { useState } from 'react'

import MaUTable from '@material-ui/core/Table'
import PropTypes from 'prop-types'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TablePaginationActions from './TablePaginationActions'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import TableToolbar from './TableToolbar'
import { makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'

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
                <EditIcon 
                style={editIconStyles}
                onClick={onClick}/>
                <input
                style={spanStyle}
                value={value}
                onClick={onInputClick}
                disabled
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



const EnhancedTable = ({
  columns,
  data,
  setData,
  updateMyData,
  skipPageReset,
  searchQuery,
  setSearchQuery,
  selectValue,
  setSelectValue,
}) => {
  const classes = useTableStyles();

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

  const addUserHandler = user => {
      user.distance = user.speedometer_come - user.speedometer_away;
    const newData = [user].concat(data);
    setData(newData);
  }

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
