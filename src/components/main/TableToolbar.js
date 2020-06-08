import React, { useState, useEffect, Suspense } from 'react'

import AddUserDialog from './AddUserDialog'
import clsx from 'clsx'
import GlobalFilter from './GlobalFilter'
import { lighten, makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import SelectField from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { TextField } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import GetAppIcon from '@material-ui/icons/GetApp';

import { CSVLink } from 'react-csv'
import { useAsyncDebounce } from 'react-table'

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    position: 'absolute',
    display: 'flex',
    justifyContent: 'space-between',
    width: 100+'%',
    height: 50,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  centeredItems: {
      display: 'flex',
      alignItems: 'center',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  downloadLink: {
    color: 'black',
  }
}))

const TableToolbar = props => {
    const [selectOpened, setSelectOpened] = useState(false);
    const [downloadData, setDownloadData] = useState([]);

    const openSelect = () => {
        setSelectOpened(true);
    }
    
    const closeSelect = () => {
        setSelectOpened(false);
    }


  const classes = useToolbarStyles()
  const {
    numSelected,
    addUserHandler,
    setGlobalFilter,
    globalFilter,
    columns,
    searchQuery,
    setSearchQuery,
    selectValue,
    setSelectValue,
    data,
  } = props;

  useEffect(() => {
    if(data.length) {
      let tmpData = [];
      data.map(item => {
        tmpData.push({
          '№ путевого': item['way_list_number'],
          'Год путевого': item['way_list_year'],
          'Водитель': item['driver'],
          '№ тягача': item['number_of_tractor'],
          '№ рефа': item['number_of_installation'],
          'Дата отбытия': item['date_start'],
          'Дата прибытия': item['date_end'],
          'Пройдено': item['distance'],
          'Ср. расход тягача': item['average_tractor_expenses'],
          'Ср. расход рефа': item['average_installation_expenses'],
          'Расходы в рейсе': item['expenses'],
          'Расходы на топливо': item['fuel'],
          'Расходы на запчасти': item['car_parts'],
          'Расходы на колеса': item['wheels'],
          'Зп водителя': item['driver_salary'],
          'Из них удержано': item['hold'],
          'Заработано с рейса': item['earned'],
          'Заработано на самом деле': item['earned_indeed'],
          'Доход': item['income'],
        });
      });
      setDownloadData(tmpData);
      }
  }, [data]);

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
        <div className={classes.centeredItems}>
      <AddUserDialog addUserHandler={addUserHandler} />
        <Typography variant="h6" id="tableTitle">
          Добавить лист
        </Typography>
        {
          downloadData.length
          && (<Tooltip title='Скачать в Excel'>
              <CSVLink className={ classes.downloadLink } data={downloadData} filename={'Распечатка_из_приложения.xls'}><GetAppIcon /></CSVLink>
            </Tooltip>)
        }
        </div>

        <div className={classes.centeredItems}>
        <FormControl className={classes.formControl}>
        <InputLabel id="select-label">Выберите колонку</InputLabel>
        <SelectField
            labelId="select-label"
            value={selectValue}
            onChange={ (event) => {
                setSelectValue(event.target.value);
                setSearchQuery('');
            } }
            open={selectOpened}
            onOpen={openSelect}
            onClose={closeSelect}
            >
            <MenuItem value="">
                <em>Пусто</em>
            </MenuItem>
            {columns.map(column => (
                column.accessor !== 'compound' && column.accessor !== 'delete'
                && (<MenuItem key={column.accessor} value={column.accessor}>
                      {column.Header}
                    </MenuItem>)
            ))}
        </SelectField>
        </FormControl>
        {
            selectValue === 'driver'
            ? (<TextField
            label='Поиск'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)} />)
            : selectValue === 'way_list_number'
                || selectValue === 'number_of_tractor'
                || selectValue === 'number_of_installation'
            ? (<TextField
                type='number'
                label='Поиск'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)} />)
            : selectValue === 'date_start'
                || selectValue === 'date_end'
            ? (
                <div>
                <TextField
                label='От'
                value={searchQuery.from}
                InputLabelProps={{ shrink: true }}
                type='date'
                onChange={e => {
                    searchQuery.to 
                    ? setSearchQuery({...searchQuery, from: e.target.value})
                    : setSearchQuery({from: e.target.value, to: "2021-01-02"})}
                    } />
                <TextField
                label='До'
                value={searchQuery.to}
                type='date'
                InputLabelProps={{ shrink: true }}
                onChange={e => searchQuery.from
                    ? setSearchQuery({...searchQuery, to: e.target.value})
                    : setSearchQuery({from: new Date('02.01.1900').toLocaleDateString(), to: e.target.value})} />
                </div>
            )
            : selectValue !== ''
            ? (
                <div>
                <TextField
                type='number'
                label='От'
                value={searchQuery.from}
                InputLabelProps={{ shrink: true }}
                onChange={e => {
                    searchQuery.to 
                    ? setSearchQuery({...searchQuery, from: e.target.value})
                    : setSearchQuery({from: e.target.value, to: 9999999})
                }} />
                <TextField
                type='number'
                label='До'
                value={searchQuery.to}
                InputLabelProps={{ shrink: true }}
                onChange={e => {
                    searchQuery.from
                    ? setSearchQuery({...searchQuery, to: e.target.value})
                    : setSearchQuery({from: 0, to: e.target.value})
                }} />
                </div>
            ) : false
        }
        </div>

        <GlobalFilter
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          className={classes.globalFilter}
        />
    </Toolbar>
  )
}

TableToolbar.propTypes = {
  addUserHandler: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  selectValue: PropTypes.string.isRequired,
  setSelectValue: PropTypes.func.isRequired,
}

export default TableToolbar
