import React from "react";
import { Box, Typography, Grid, CardMedia } from "@mui/material";
import { styled } from "@mui/system";

const StyledBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px'
});

const StyledTypography = styled(Typography)({
  marginLeft: '8px',
  color: '#f56c42',
  fontSize: '16px',
  fontWeight: 'bold'
});

const StyledCount = styled(Typography)({
  marginLeft: 'auto',
  color: '#000',
  fontSize: '16px',
  fontWeight: 'bold'
});

const CardBox = ({ Image, Title, Count }) => {
  return (
    <StyledBox>
      <Box>{Image}</Box>
      <StyledTypography>{Title}</StyledTypography>
      <StyledCount>{Count}</StyledCount>
    </StyledBox>
  );
};

export default function ImageCardBox(props) {
  return (
    <Box>
      <CardBox 
        Image={props.Image}
        Title={props.Title}
        Count={props.Count}
      />
    </Box>
  );
}
