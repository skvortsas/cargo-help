import React, { useState, useEffect } from 'react';
import { useAuth0 } from "../../react-auth0-spa";

import DeleteIcon from '@material-ui/icons/DeleteForever';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const DeleteDialog = props => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

const handleDelete = async () => {
    const unit = {
        id: props.id,
    }
    props.deleteUnitHandler(unit);
    setOpen(false);
}

  return (
    <div>
      <Tooltip title="Удалить строку">
        <IconButton aria-label="Удалить строку" onClick={handleClickOpen}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Вы уверены, что хотите удалить эту строку?</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Отменить
          </Button>
          <Button onClick={handleDelete} color="primary">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default DeleteDialog
