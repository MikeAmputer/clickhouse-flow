import React from 'react';
import {
    TableCell,
    TableRow,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: '#ebebeb',
    },
    '&:nth-of-type(odd)': {
        backgroundColor: '#fffbd4',
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export type ChColumnProps = {
    position: number;
    name: string;
    type: string;
    defaultKind: string;
    defaultExpression: string;
}

const ChColumn: React.FC<ChColumnProps> = (column) => {
    return (
        <StyledTableRow key={column.position}>
            <StyledTableCell size={'small'}>{column.name}</StyledTableCell>
            <StyledTableCell size={'small'}>{column.type}</StyledTableCell>
        </StyledTableRow>
    );
};

export default ChColumn;