import React, { useState } from 'react';

import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

const initialUnit = {
  speedometer_start: 0,
  speedometer_end: 1,
  fuel_start: 0,
  fuel_end: 1,
  instal_speedometer_start: 0,
  instal_speedometer_end: 1,
  instal_fuel_start: 0,
  instal_fuel_end: 1,
  subRows: undefined,
}

const AddTruckUnitDialog = props => {
  const [unit, setUnit] = useState(initialUnit);
  const { addUnitHandler } = props;
  const [open, setOpen] = useState(false);

  const [switchState, setSwitchState] = useState({
    addMultiple: false,
  });

  const resetSwitch = () => {
    setSwitchState({ addMultiple: false });
  }

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    resetSwitch();
  }

  const handleAdd = event => {
    addUnitHandler(unit);
    setUnit(initialUnit);
    switchState.addMultiple ? setOpen(true) : setOpen(false);
  }

  const handleChange = name => ({ target: { value } }) => {
    setUnit({ ...unit, [name]: value })
  }

  const inputEnterPressed = event => {
    if (event.keyCode === 13) {
      handleAdd();
    }
    }

  return (
    <div>
      <Tooltip title="Добавить данные для грузовика">
        <Button className='button-add' aria-label="add" onClick={handleClickOpen}>
          <AddIcon />
        </Button>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Добавить данные для грузовика</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Спидометер при выезде"
            type="number"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.speedometer_start}
            onChange={handleChange('speedometer_start')}
          />
          <TextField
            margin="dense"
            label="Спидометер при возвращении"
            type="number"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.speedometer_end}
            onChange={handleChange('speedometer_end')}
          />
          <TextField
            margin="dense"
            label="Топливо при выезде"
            type="number"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.fuel_start}
            onChange={handleChange('fuel_start')}
          />
          <TextField
            margin="dense"
            label="Топливо при возвращении"
            type="number"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.fuel_end}
            onChange={handleChange('fuel_end')}
          />
          <TextField
            margin="dense"
            label="Моточасы при выезде"
            type="number"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.instal_speedometer_start}
            onChange={handleChange('instal_speedometer_start')}
          />
          <TextField
            margin="dense"
            label="Моточасы при возвращении"
            type="number"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.instal_speedometer_end}
            onChange={handleChange('instal_speedometer_end')}
          />
          <TextField
            margin="dense"
            label="Топливо при выезде"
            type="number"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.instal_fuel_start}
            onChange={handleChange('instal_fuel_start')}
          />
          <TextField
            margin="dense"
            label="Топливо при возвращении"
            type="number"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.instal_fuel_end}
            onChange={handleChange('instal_fuel_end')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Отменить
          </Button>
          <Button onClick={handleAdd} color="primary">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AddTruckUnitDialog