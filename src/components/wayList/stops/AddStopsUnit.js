import React, { useState, createRef } from 'react';

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

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const initialUnit = {
  location: '',
  date_start: '',
  date_end: '',
  cost: 0,
  inn: '',
  comments: '',
  subRows: undefined,
}

const AddStopsUnitDialog = props => {
    const [toast, setToast] = useState(false);
  const [unit, setUnit] = useState(initialUnit)
  const { addUnitHandler } = props
  const [open, setOpen] = useState(false)
  const [switchState, setSwitchState] = useState({
    addMultiple: false,
  });
  const firstInput = createRef();

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
    if (unit.date_start && unit.date_end) {
        firstInput.current.children[1].children[0].focus(); // input of textField using materialUi
        unit.date_start = (new Date(unit.date_start).toLocaleDateString());
        unit.date_end = (new Date(unit.date_end).toLocaleDateString());
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
      <Tooltip title="Добавить данные по остановкам">
        <Button className='button-add' aria-label="add" onClick={handleClickOpen}>
          <AddIcon />
        </Button>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Добавить данные по остановкам</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            ref={  firstInput }
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
            label="Дата заезда"
            type="date"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.date_start}
            onChange={handleChange('date_start')}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Дата выезда"
            type="date"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.date_end}
            onChange={handleChange('date_end')}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Цена"
            type="number"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.cost}
            onChange={handleChange('cost')}
          />
          <TextField
            margin="dense"
            label="ИНН"
            type="number"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.inn}
            onChange={handleChange('inn')}
          />
          <TextField
            margin="dense"
            label="Комментарии"
            type="text"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.comments}
            onChange={handleChange('comments')}
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

AddStopsUnitDialog.propTypes = {
  addUnitHandler: PropTypes.func.isRequired,
}

export default AddStopsUnitDialog
