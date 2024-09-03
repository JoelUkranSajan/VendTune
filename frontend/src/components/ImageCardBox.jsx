import React from 'react';
import { Box, Typography } from '@mui/material';

const ImageCardBox = ({ Image, Title, Count }) => {
  return (
    <Box sx={{ 
      backgroundColor: 'lightgrey', 
      borderRadius: 2, 
      textAlign: 'center', 
      display: 'flex', 
      flexDirection: 'row', 
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px',
      marginBottom: '10px'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {Image}
        <Typography variant="h6" sx={{ marginLeft: 1 }}>{Title}</Typography>
      </Box>
      <Typography variant="h4" sx={{ marginLeft: 2 }}>{Count}</Typography>
    </Box>
  );
};

export default ImageCardBox;
