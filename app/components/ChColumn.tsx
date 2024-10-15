import React from 'react';
import {
    TableCell,
    TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const NameTableCell = styled(TableCell)(({ theme }) => ({
    fontSize: 14,
    color: '#000',
    textAlign: 'left',
    padding: '5px',
}));

const TypeTableCell = styled(TableCell)(({ theme }) => ({
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    padding: '5px',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: '#ebebeb',
    },
    '&:nth-of-type(odd)': {
        backgroundColor: '#fffbd4',
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
            <NameTableCell>{column.name}</NameTableCell>
            <TypeTableCell>{column.type}</TypeTableCell>
        </StyledTableRow>
    );
};

export default ChColumn;