import namor from 'namor'

const range = len => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = () => {
  return {
    driver: namor.generate({ words: 1, numbers: 0 }),
    way_list_number: Math.floor(Math.random() * 1000).toString(),
    date_of_away: new Date().toLocaleDateString(),
    date_of_come: new Date().toLocaleDateString(),
    date_of_way_list: new Date().toLocaleDateString(),
    number_of_tractor: Math.floor(Math.random() * 999).toString(),
    number_of_installation: Math.floor(Math.random() * 9999).toString(),
    medium_tractor_expenses: (Math.random() * 99.9).toFixed(2),
    medium_installation_expenses: (Math.random() * 99.9).toFixed(2),
    distance: Math.floor(Math.random() * 99999).toString(),
    earned: Math.floor(Math.random() * 999999).toString(),
    expenses: Math.floor(Math.random() * 500000).toString(),
    fuel: Math.floor(Math.random() * 9999).toString(),
    car_parts: Math.floor(Math.random() * 9999).toString(),
    wheels: Math.floor(Math.random() * 9999).toString(),
    driver_salary: Math.floor(Math.random() * 99999).toString(),
    income: Math.floor(Math.random() * 999999).toString(),
  }
}

export default function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth]
    return range(len).map(d => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}