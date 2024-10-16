import React, { useState } from 'react';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { styled } from '@mui/material/styles';

import ChColumn, { ChColumnProps } from './ChColumn';

const StyledTable = styled(Table)(({ theme }) => ({
    borderCollapse: "collapse",
    borderSpacing: 0,
    background: "#000",
}));

const TableNameCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: '#000',
    color: '#fff',
    fontSize: 14,
    textAlign: 'left',
    padding: '5px',
}));

const ExpandCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: '#000',
    textAlign: 'right',
    padding: '5px',
}));

const ExpandButton = styled(IconButton)(({ theme }) => ({
    color: '#fff',
    '&:hover': {
        backgroundColor: '#383838',
        color: '#fff',
    },
}));

const TableHeadRow = styled(TableRow)(({ theme }) => ({
    borderBottom: 'solid',
    borderBottomWidth: 0,
    borderColor: '#000',
}));

export type ChTableProps = {
    name: string;
    columns: ChColumnProps[];
}

const ChTable: React.FC<ChTableProps> = (table) => {
    const [open, setOpen] = useState(true);

    return (
        <TableContainer component={Paper}>
            <StyledTable size={'small'}>
                <TableHead>
                    <TableHeadRow>
                        <TableNameCell>{table.name}</TableNameCell>
                        <ExpandCell>
                            <ExpandButton
                                aria-label={'expand table'}
                                size={'small'}
                                onClick={() => setOpen(!open)}
                            >
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </ExpandButton>
                        </ExpandCell>
                    </TableHeadRow>
                </TableHead>
                <TableBody>
                    {table.columns.map((column) => (
                        <ChColumn key={`${table.name}_${column.position}`} {...column} />
                    ))}
                </TableBody>
            </StyledTable>
        </TableContainer>
    );
};

export default ChTable;