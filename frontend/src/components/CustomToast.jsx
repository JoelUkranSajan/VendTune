import React from "react";
import { Box, Button, Typography } from "@mui/material";

const CustomToast = ({ closeToast, header, text }) => (
  <Box
    sx={{
      backgroundColor: "white",
      color: "black",
      padding: "5px",
      borderRadius: "15px",
      textAlign: "start",
      position: "relative",
      zIndex: 1000,
    }}
  >
    <Typography variant="h6" sx={{ mb: 1 }}>
      {header || "Error"}
    </Typography>
    <Typography variant="body1" sx={{ display:'flex', flexWrap:'wrap', mb: 0, textWrap:'wrap', textAlign:'start' }}>
      {text || "Something went wrong. Please try again."}
    </Typography>
    <Box sx={{ display:'flex', justifyContent:'end' }}>
    <Button onClick={closeToast} sx={{ color: '#ff7043' }}>
      Close
    </Button>
    </Box>
  </Box>
);

export default CustomToast;
