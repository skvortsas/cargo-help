import React, { useState } from 'react'

import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import PropTypes from 'prop-types'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const initialUser = {
  driver: '',
  way_list_number: 0,
  way_list_year: 2000,
  number_of_tractor: 0,
  number_of_installation: 0,
  speedometer_start: 0,
  speedometer_end: 1,
  date_start: '',
  date_end: '',
  earned: 0,
  expenses: 0,
  fuel: 0,
  average_tractor_expenses: 0.1,
  average_installation_expenses: 0.1,
  subRows: undefined,
}

const AddUserDialog = props => {
    const [toast, setToast] = useState(false);
  const [user, setUser] = useState(initialUser)
  const { addUserHandler } = props
  const [open, setOpen] = useState(false)

  const [switchState, setSwitchState] = useState({
    addMultiple: false,
  });

  const handleSwitchChange = name => event => {
    setSwitchState({ ...switchState, [name]: event.target.checked })
  }

  const resetSwitch = () => {
    setSwitchState({ addMultiple: false })
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    resetSwitch()
  }

  const handleAdd = event => {
    if (user.date_start && user.date_end) {
        user.date_start = (new Date(user.date_start).toLocaleDateString());
        user.date_end = (new Date(user.date_end).toLocaleDateString());
        addUserHandler(user)
        setUser(initialUser)
        switchState.addMultiple ? setOpen(true) : setOpen(false)
    } else {
        toastOpen();
    }
  }

  const handleChange = name => ({ target: { value } }) => {
    setUser({ ...user, [name]: value })
  }

  const toastOpen = () => {
    setToast(true);
  };

  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') {
        return;
      }

    setToast(false);
  };

  return (
    <div>
      <Tooltip title="Add">
        <IconButton aria-label="add" onClick={handleClickOpen}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Новый путевой лист</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Номер путевого листа"
            type="number"
            fullWidth
            value={user.way_list_number}
            onChange={handleChange('way_list_number')}
          />
          <TextField
            margin="dense"
            label="Год путевого листа"
            type="number"
            fullWidth
            value={user.way_list_year}
            onChange={handleChange('way_list_year')}
          />
          <TextField
            margin="dense"
            label="Водитель"
            type="text"
            fullWidth
            value={user.driver}
            onChange={handleChange('driver')}
          />
          <TextField
            margin="dense"
            label="Номер тягача"
            type="number"
            fullWidth
            value={user.number_of_tractor}
            onChange={handleChange('number_of_tractor')}
          />
          <TextField
            margin="dense"
            label="Номер инсталяции"
            type="number"
            fullWidth
            value={user.number_of_installation}
            onChange={handleChange('number_of_installation')}
          />
          <TextField
            margin="dense"
            label="Дата выезда"
            type="date"
            fullWidth
            value={user.date_of_away}
            onChange={handleChange('date_start')}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Дата приезда"
            type="date"
            fullWidth
            value={user.date_of_come}
            onChange={handleChange('date_end')}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Спидометр выезд"
            type="number"
            fullWidth
            value={user.speedometer_start}
            onChange={handleChange('speedometer_start')}
          />
          <TextField
            margin="dense"
            label="Спидометр приезд"
            type="number"
            fullWidth
            value={user.speedometer_end}
            onChange={handleChange('speedometer_end')}
          />
          <TextField
            margin="dense"
            label="Заработано"
            type="number"
            fullWidth
            value={user.earned}
            onChange={handleChange('earned')}
          />
          <TextField
            margin="dense"
            label="Расходы в рейсе"
            type="number"
            fullWidth
            value={user.expenses}
            onChange={handleChange('expenses')}
          />
          <TextField
            margin="dense"
            label="Топливо"
            type="number"
            fullWidth
            value={user.fuel}
            onChange={handleChange('fuel')}
          />
          <TextField
            margin="dense"
            label="Средний расход тягача"
            type="number"
            fullWidth
            value={user.average_tractor_expenses}
            onChange={handleChange('average_tractor_expenses')}
          />
          <TextField
            margin="dense"
            label="Средний расход инсталяции"
            type="number"
            fullWidth
            value={user.average_installation_expenses}
            onChange={handleChange('average_installation_expenses')}
          />
        </DialogContent>
        <DialogActions>
          <Tooltip title="Добавить несколько">
            <Switch
              checked={switchState.addMultiple}
              onChange={handleSwitchChange('addMultiple')}
              value="addMultiple"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </Tooltip>
          <Button onClick={handleClose} color="primary">
            Отменить
          </Button>
          <Button onClick={handleAdd} color="primary">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={toast}
        autoHideDuration={6000}
        onClose={handleToastClose}
      >
          <Alert onClose={handleToastClose} severity="error">
          Заполните все поля
        </Alert>
      </Snackbar>
    </div>
  )
}

AddUserDialog.propTypes = {
  addUserHandler: PropTypes.func.isRequired,
}

export default AddUserDialog
