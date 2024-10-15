import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import ChColumn, { ChColumnProps } from './ChColumn';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
}));

export type ChTableProps = {
    name: string;
    columns: ChColumnProps[];
}

const ChTable: React.FC<ChTableProps> = (table) => {
    return (
        <TableContainer component={Paper}>
            <Table size={'small'}>
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell>Type</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {table.columns.map((column) => (
                        <ChColumn {...column} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ChTable;