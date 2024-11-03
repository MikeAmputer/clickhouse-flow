import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import ChColumn, { ChColumnProps } from './ChColumn';
import ChTableHeader from './ChTableHeader';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Collapse,
    Box,
} from '@mui/material';

const StyledTable = styled(Table)(() => ({
    borderCollapse: 'collapse',
    borderSpacing: 0,
    background: '#000',
}));

export type ChTableProps = {
    fullName: string;
    presentationName: string;
    engine: string;
    hasOwnData: boolean;
    columns: ChColumnProps[];
}

const ChTable: React.FC<ChTableProps> = (table) => {
    const [open, setOpen] = useState(table.engine !== 'MaterializedView');

    return (
        <TableContainer component={Paper}>
            <StyledTable size={'small'} aria-label="ch-table">
                <TableHead>
                    <ChTableHeader
                        name={table.presentationName}
                        hasOwnData={table.hasOwnData}
                        openState={[open, setOpen]}
                    />
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0, padding: 0 }} colSpan={2}>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <Box>
                                    <StyledTable size="small" aria-label="columns">
                                        <TableBody>
                                            {table.columns.map((column) => (
                                                <ChColumn key={`${table.fullName}_${column.position}`} {...column} />
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