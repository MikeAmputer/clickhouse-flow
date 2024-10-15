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
import { styled } from '@mui/material/styles';
import ChColumn, { ChColumnProps } from './ChColumn';

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: '#000',
    color: '#fff',
    fontSize: 14,
    textAlign: 'left',
    padding: '5px',
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
                        <StyledTableHeadCell align="center" colSpan={2}>
                            {table.name}
                        </StyledTableHeadCell>
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