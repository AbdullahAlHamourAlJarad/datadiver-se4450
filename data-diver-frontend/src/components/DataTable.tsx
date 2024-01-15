import React, { useMemo } from 'react';
import { Paper, TableContainer } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import '../css/DataTable.css'


const DataTable = (props: {columns: GridColDef[], rows: GridRowsProp}) => {
    const columns = useMemo(() => {
        return props.columns.map(col => {return {...col,  headerClassName: 'table--header'}})
    }, [props.columns]);
    
    return (
        <TableContainer component={Paper} elevation={24}>
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