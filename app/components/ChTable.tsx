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
    Collapse,
    Box,
} from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { styled } from '@mui/material/styles';

import ChColumn, { ChColumnProps } from './ChColumn';

const StyledTable = styled(Table)(() => ({
    borderCollapse: 'collapse',
    borderSpacing: 0,
    background: '#000',
}));

interface TableHeaderProps {
    hasOwnData?: boolean;
}

const TableNameCell = styled(TableCell)<TableHeaderProps>(({ hasOwnData }) => ({
    backgroundColor: hasOwnData ? '#000' : '#383838',
    color: '#fff',
    fontSize: 14,
    textAlign: 'left',
    padding: '5px',
}));

const ExpandCell = styled(TableCell)<TableHeaderProps>(({ hasOwnData }) => ({
    backgroundColor: hasOwnData ? '#000' : '#383838',
    textAlign: 'right',
    padding: '5px',
}));

const ExpandButton = styled(IconButton)<TableHeaderProps>(({ hasOwnData }) => ({
    color: '#fff',
    '&:hover': {
        backgroundColor: hasOwnData ? '#383838' : '#000',
        color: '#fff',
    },
    '&:active': {
        transform: 'scale(0.95)',
    },
}));

const TableHeadRow = styled(TableRow)<TableHeaderProps>(({ hasOwnData }) => ({
    borderBottom: 'solid',
    borderBottomWidth: 0,
    borderColor: '#000',
    backgroundColor: hasOwnData ? '#000' : '#383838',
}));

export type ChTableProps = {
    name: string;
    engine: string;
    hasOwnData: boolean;
    columns: ChColumnProps[];
}

const ChTable: React.FC<ChTableProps> = (table) => {
    const [open, setOpen] = useState(table.engine != 'MaterializedView');

    return (
        <TableContainer component={Paper}>
            <StyledTable size={'small'} aria-label="ch-table">
                <TableHead>
                    <TableHeadRow hasOwnData={table.hasOwnData}>
                        <TableNameCell hasOwnData={table.hasOwnData}>{table.name}</TableNameCell>
                        <ExpandCell hasOwnData={table.hasOwnData}>
                            <ExpandButton
                                hasOwnData={table.hasOwnData}
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
                    <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0, padding: 0 }} colSpan={2}>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <Box>
                                    <StyledTable size="small" aria-label="columns">
                                        <TableBody>
                                            {table.columns.map((column) => (
                                                <ChColumn key={`${table.name}_${column.position}`} {...column} />
                                            ))}
                                        </TableBody>
                                    </StyledTable>
                                </Box>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </StyledTable>
        </TableContainer>
    );
};

export default ChTable;