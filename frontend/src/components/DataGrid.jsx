import React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const DataGridDemo = ({ rows, columns, handleCellEditCommit }) => {
  const rowsWithIndex = rows.map((row, index) => ({ ...row, id: index + 1 }));

  const columnsWithIndex = [
    {
      field: 'id',
      headerName: 'Sl No',
      width: 60,
      renderCell: (params) => (
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          {params.value}
        </Box>
      ),
    },
    ...columns,
  ];

  return (
    <Box sx={{ height: 'auto', width: 'auto' }}>
      <DataGrid
        rows={rowsWithIndex}
        columns={columnsWithIndex}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 2,
            },
          },
        }}
        pageSizeOptions={[2]}
        autoHeight
        disableSelectionOnClick
        onCellEditCommit={(params) => {
          console.log("Cell Edit Commit in DataGridDemo: ", params);
          handleCellEditCommit(params);
        }} 
      />
    </Box>
  );
};

export default DataGridDemo;
