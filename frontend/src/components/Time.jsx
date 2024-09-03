import React from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { TextField, Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "../styles/Common.scss";

const Time = ({ name, onTimeChange }) => {
  const [selectedTime, setSelectedTime] = React.useState(null);

  const handleTimeAccept = (newValue) => {
    setSelectedTime(newValue);
    onTimeChange(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ mb: 2, position: "relative" }}>
        <TimePicker
          label={name}
          value={selectedTime}
          onAccept={handleTimeAccept}
          className="DatePicker"
          renderInput={(params) => (
            <TextField {...params} fullWidth sx={{ mb: 2 }} />
          )}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default Time;
