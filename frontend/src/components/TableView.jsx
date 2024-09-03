import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(date, time, unit, vendor, address, EFT) {
  return { date, time, unit, vendor, address, EFT };
}

export default function TableView({rows}) {
  return (
    <TableContainer sx={{display:'flex', justifyContent:'center'}} component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Date</TableCell>
            <TableCell align="left">Time</TableCell>
            <TableCell align="left">Unit</TableCell>
            <TableCell align="left">Vendor</TableCell>
            <TableCell align="left">Address</TableCell>
            <TableCell align="left">EFT</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="left">{row.date}</TableCell>
              <TableCell align="left">{row.time}</TableCell>
              <TableCell align="left">{row.unit}</TableCell>
              <TableCell align="left">{row.vendor}</TableCell>
              <TableCell align="left">{row.address}</TableCell>
              <TableCell align="left">{row.EFT}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
