import React, { useMemo } from 'react';
import { Paper, TableContainer } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';


const DataTable = (props: {columns: GridColDef[], rows: GridRowsProp}) => {
    const columns = useMemo(() => {
        return props.columns.map(col => {return {...col,  headerClassName: 'table--header'}})
    }, [props.columns]);

    const tableSytle = {
        alignSelf: 'flex-start',
        '& .table--row': {
          backgroundColor: '#DCDCDF',
          '&:hover': {
            backgroundColor: '#DCDCDF',
          }
        },
        '& .table--header': {
            color: '#DCDCDF',
            backgroundColor: '#262A38',
        },
        "& .MuiDataGrid-sortIcon": {
            opacity: 1,
            color: "white",
        },
        "& .MuiDataGrid-menuIconButton": {
            opacity: 1,
            color: "white"
        },
        "& .MuiDataGrid-filterIcon": {
            opacity: 1,
            color: "white"
        },
    };
    
    return (
        <TableContainer component={Paper} elevation={24} sx={tableSytle}>
            <DataGrid
                rows={props.rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
            />
        </TableContainer>
    );
}

export default DataTable;