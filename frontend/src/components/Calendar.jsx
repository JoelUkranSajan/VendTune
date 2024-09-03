import React from 'react';
import dayjs from 'dayjs';
import { Box } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/en';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

export default function BasicDatePicker({ label, value, onDateChange, minDate, maxDate }) {
  const handleDateChange = (newValue) => {
    onDateChange(newValue);
  };

  return (
    <Box sx={{ mb: 2, position: 'relative' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
          <DatePicker
            className="DatePicker"
            label={label}
            value={value}
            onChange={handleDateChange}
            minDate={minDate || dayjs()}
            maxDate={maxDate}
          />
        </DemoContainer>
      </LocalizationProvider>
    </Box>
  );
}
