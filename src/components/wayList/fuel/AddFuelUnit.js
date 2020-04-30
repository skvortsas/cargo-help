import React, { useState } from 'react';

import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const initialUnit = {
  by_cash: true,
  location: '',
  date: '',
  fuel_cost: 0,
  tractor_filled: 0,
  installation_filled: 0,
  filled_indeed: 0,
  subRows: undefined,
}

const AddFuelUnitDialog = props => {
    const [toast, setToast] = useState(false);
  const [unit, setUnit] = useState(initialUnit)
  const { addUnitHandler } = props
  const [open, setOpen] = useState(false)
  const [openSelect, setOpenSelect] = useState(false);
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

  const handleCloseSelect = () => {
    setOpenSelect(false);
  }

  const handleOpenSelect = () => {
    setOpenSelect(true);
  }

  const handleAdd = event => {
    if (unit.date) {
        unit.date = (new Date(unit.date).toLocaleDateString());
        addUnitHandler(unit)
        setUnit(initialUnit)
        switchState.addMultiple ? setOpen(true) : setOpen(false)
    } else {
        toastOpen();
    }
  }

  const handleChange = name => ({ target: { value } }) => {
    setUnit({ ...unit, [name]: value })
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

  const inputEnterPressed = event => {
    if (event.keyCode === 13) {
      handleAdd();
    }
    }

  return (
    <div>
      <Tooltip title="Добавить данные по топливу">
        <Button className='button-add' aria-label="add" onClick={handleClickOpen}>
          <AddIcon />
        </Button>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Добавить данные по топливу</DialogTitle>
        <DialogContent>
        <InputLabel id="select-label">Способ оплаты</InputLabel>
          <Select
          labelId='select-label'
          open={openSelect}
          onClose={handleCloseSelect}
          onOpen={handleOpenSelect}
          value={unit.by_cash}
          onChange={handleChange('by_cash')}>
            <MenuItem value={true}>За наличку</MenuItem>
            <MenuItem value={false}>По карте</MenuItem>
          </Select>
          <TextField
            autoFocus
            margin="dense"
            label="Местонахождение"
            type="text"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.location}
            onChange={handleChange('location')}
          />
          <TextField
            margin="dense"
            label="Дата"
            type="date"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.date}
            onChange={handleChange('date')}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Стоимость литра"
            type="number"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.fuel_cost}
            onChange={handleChange('fuel_cost')}
          />
          <TextField
            margin="dense"
            label="Залито(тягач)"
            type="number"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.tractor_filled}
            onChange={handleChange('tractor_filled')}
          />
          <TextField
            margin="dense"
            label="Залито(реф)"
            type="number"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.installation_filled}
            onChange={handleChange('installation_filled')}
          />
          <TextField
            margin="dense"
            label="Поступило"
            type="number"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.filled_indeed}
            onChange={handleChange('filled_indeed')}
          />
        </DialogContent>
        <DialogActions>
          <Tooltip title="Добавить несколько строк">
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

AddFuelUnitDialog.propTypes = {
  addUnitHandler: PropTypes.func.isRequired,
}

export default AddFuelUnitDialog
