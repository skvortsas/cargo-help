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
  date: '',
  part_name: 'Название запчасти',
  amount: 0,
  cost: 0,
  to_tractor: true,
  is_wheel: false,
  comments: '',
  subRows: undefined,
}

const AddWheelsUnitDialog = props => {
    const [toast, setToast] = useState(false);
  const [unit, setUnit] = useState(initialUnit);
  const { addUnitHandler } = props;
  const [open, setOpen] = useState(false);
  const [openTractorSelect, setOpenTractorSelect] = useState(false);
  const [openWheelsSelect, setOpenWheelsSelect] = useState(false);

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

  const handleOpenTractorSelect = () => {
    setOpenTractorSelect(true);
  }

  const handleOpenWheelsSelect = () => {
    setOpenWheelsSelect(true);
  }

  const handleCloseTractorSelect = () => {
    setOpenTractorSelect(false);
  }

  const handleCloseWheelsSelect = () => {
    setOpenWheelsSelect(false);
  }

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
      <Tooltip title="Добавить данные по колёсам">
        <Button className='button-add' aria-label="add" onClick={handleClickOpen}>
          <AddIcon />
        </Button>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Добавить данные по колёсам</DialogTitle>
        <DialogContent>
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
            label="Название запчасти"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.part_name}
            onChange={handleChange('part_name')}
          />
          <TextField
            margin="dense"
            label="Количество"
            type="number"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.amount}
            onChange={handleChange('amount')}
          />
          <TextField
            margin="dense"
            label="Стоимость"
            type="number"
            onKeyUp={inputEnterPressed}
            fullWidth
            value={unit.cost}
            onChange={handleChange('cost')}
          />
          <InputLabel id="select-tractor-label">Тягач или Реф</InputLabel>
          <Select
            labelId='select-tractor-label'
            open={openTractorSelect}
            onClose={handleCloseTractorSelect}
            onOpen={handleOpenTractorSelect}
            value={unit.to_tractor}
            onChange={handleChange('to_tractor')}>
                <MenuItem value={true}>Тягач</MenuItem>
                <MenuItem value={false}>Реф</MenuItem>
          </Select>
          <InputLabel id="select-wheels-label">Тип запчасти</InputLabel>
          <Select
            labelId='select-wheels-label'
            open={openWheelsSelect}
            onClose={handleCloseWheelsSelect}
            onOpen={handleOpenWheelsSelect}
            value={unit.is_wheel}
            onChange={handleChange('is_wheel')}>
                <MenuItem value={false}>Не колёса</MenuItem>
                <MenuItem value={true}>Колёса</MenuItem>
          </Select>
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

AddWheelsUnitDialog.propTypes = {
  addUnitHandler: PropTypes.func.isRequired,
}

export default AddWheelsUnitDialog
