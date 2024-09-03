import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import BasicDatePicker from './Calendar';
import dayjs from 'dayjs';

const AddDialog = ({ open, handleClose, handleAdd, type }) => {
  const initialFormState = type === 'business'
    ? { unit_name: '', permit_id: '', permit_expiry_date: '', unit_type: '' }
    : { vendor_name: '', licence_id: '', licence_expiry_date: '', vendor_email: '', vendor_phone_number: '' };

  const [formState, setFormState] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setFormState(initialFormState);
      setErrors({});
    }
  }, [open, type]);

  const validate = () => {
    let tempErrors = {};
    if (type === 'business') {
      if (!/^AA\d{5}$/.test(formState.permit_id)) {
        tempErrors.permit_id = 'Permit ID should be in the format AA followed by 5 digits (e.g., AA00001)';
      }
    } else {
      if (!/^C\d{4}$/.test(formState.licence_id)) {
        tempErrors.licence_id = 'Licence ID should be in the format C followed by 4 digits (e.g., C0001)';
      }
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });

    if (name === 'permit_id' || name === 'licence_id') {
      validate();
    }
  };

  const handleDateChange = (name, newValue) => {
    setFormState({
      ...formState,
      [name]: newValue ? dayjs(newValue).format('YYYY-MM-DD') : ''
    });
  };

  const handleSubmit = () => {
    if (validate()) {
      handleAdd(formState);
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{`Add New ${type === 'business' ? 'Business Unit' : 'Vendor'}`}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {Object.keys(initialFormState).map((key) => (
            <Grid item xs={12} key={key}>
              {key.includes('expiry_date') ? (
                <BasicDatePicker
                  label={key.replace('_', ' ')}
                  value={formState[key] ? dayjs(formState[key], 'YYYY-MM-DD') : null}
                  onDateChange={(date) => handleDateChange(key, date)}
                />
              ) : key === 'unit_type' ? (
                <FormControl fullWidth>
                  <InputLabel>Unit Type</InputLabel>
                  <Select
                    name="unit_type"
                    value={formState.unit_type}
                    onChange={handleChange}
                    label="Unit Type"
                  >
                    <MenuItem value="Food Truck">Food Truck</MenuItem>
                    <MenuItem value="Food Cart">Food Cart</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  label={key.replace('_', ' ')}
                  name={key}
                  value={formState[key] || ''} 
                  onChange={handleChange}
                  required
                  error={!!errors[key]}
                  helperText={errors[key]}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDialog;
