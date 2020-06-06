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
  date: '',
  cost: 0,
  expenses: '',
  comments: '',
  subRows: undefined,
}

const AddExpensesUnitDialog = props => {
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

  const inputEnterPressed = event => {
    if (event.keyCode === 13) {
      handleAdd();
    }
    }

  const handleAdd = event => {
    if (unit.date) {
        firstInput.current.children[1].children[0].focus(); // input of textField using materialUi
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

  return (
    <div>
      <Tooltip title="Добавить данные по затратам">
        <Button className='button-add' aria-label="add" onClick={handleClickOpen}>
          <AddIcon />
        </Button>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Добавить данные по затратам</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            ref={ firstInput }
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
            label="Сумма"
            type="number"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.cost}
            onChange={handleChange('cost')}
          />
          <TextField
            margin="dense"
            label="Нарушение/Расходы"
            type="text"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.expenses}
            onChange={handleChange('expenses')}
          />
          <TextField
            margin="dense"
            label="Комментарий"
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

AddExpensesUnitDialog.propTypes = {
  addUnitHandler: PropTypes.func.isRequired,
}

export default AddExpensesUnitDialog
