import React, { useState } from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'
import EnhancedTable from './EnhancedTable'
import makeData from './makeData'
import '../styles/main.scss'

const App = () => {
  const columns = React.useMemo(
    () => [
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
        accessor: 'date_of_away',
      },
      {
        Header: 'Дата прибытия',
        accessor: 'date_of_come',
      },
      {
        Header: 'Пройдено КМ',
        accessor: 'distance'
      },
      {
        Header: 'Ср. расход тягача',
        accessor: 'medium_tractor_expenses',
      },
      {
        Header: 'Ср. расход инсталяции',
        accessor: 'medium_installation_expenses',
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
  )

  const [data, setData] = React.useState(React.useMemo(() => makeData(20), []))
  const [skipPageReset, setSkipPageReset] = React.useState(false)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectValue, setSelectValue] = useState('');

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true)
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      })
    )
  }

  function formatDate(dateString) {
    let dates = dateString.split('.');
    return([dates[2], dates[1], dates[0]].join('-'));
}

  return (
    <div style={{paddingTop: 120+'px'}}>
      <CssBaseline />
      <EnhancedTable
        columns={columns}
        data={searchQuery 
                ? selectValue === 'driver'
                    || selectValue === 'way_list_number'
                    || selectValue === 'number_of_tractor'
                    || selectValue === 'number_of_installation'
                    ? data.filter(x => x[selectValue].includes(searchQuery))
                    : selectValue === 'date_of_away' || selectValue === 'date_of_come'
                        ? data.filter(x => new Date(formatDate(x[selectValue])) >= new Date(searchQuery.from) && new Date(formatDate(x[selectValue])) <= new Date(searchQuery.to))
                        : data.filter(x => Number(x[selectValue]) > searchQuery.from && Number(x[selectValue]) < searchQuery.to)
                : data}
        setData={setData}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectValue={selectValue}
        setSelectValue={setSelectValue}
      />
    </div>
  )
}

export default App