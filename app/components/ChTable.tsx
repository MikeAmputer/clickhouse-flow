import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import ChColumn, { ChColumnProps } from './ChColumn';
import ChTableHeader from './ChTableHeader';
import ChTableEngine from './ChTableEngine';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    Collapse,
    Box,
} from '@mui/material';

interface TableStyledProps {
    hasOwnData?: boolean;
};

const StyledTable = styled(Table)<TableStyledProps>(({ hasOwnData }) => ({
    borderCollapse: 'collapse',
    borderSpacing: 0,
    background: hasOwnData ? '#000' : '#383838',
    minWidth: 250,
}));

export type ChTableProps = {
    fullName: string;
    presentationName: string;
    engine: string;
    hasOwnData: boolean;
    columns: ChColumnProps[];
    partitionKey: string;
    sortingKey: string;
    primaryKey: string;
    samplingKey: string;
}

const ChTable: React.FC<ChTableProps> = (table) => {
    const [columnsOpen, setColumnsOpen] = useState(table.engine !== 'MaterializedView');
    const [engineOpen, setEngineOpen] = useState(false);

    const hasEngineKeys = [table.primaryKey, table.sortingKey, table.partitionKey, table.samplingKey]
        .some(key => key != null && key.trim() !== '');

    return (
        <TableContainer component={Paper}>
            <StyledTable size={'small'} aria-label="ch-table">
                <TableBody>
                    <ChTableHeader
                        name={table.presentationName}
                        hasOwnData={table.hasOwnData}
                        openState={[columnsOpen, setColumnsOpen]}
                    />
                    <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0, padding: 0 }} colSpan={2}>
                            <Collapse in={columnsOpen} timeout="auto" unmountOnExit>
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
                    {!columnsOpen ? (
                        <TableRow>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0, padding: 0 }} colSpan={2}>
                                <Box sx={{ height: 2, borderRadius: 0, bgcolor: '#fff', }} />
                            </TableCell>
                        </TableRow>
                    ) : (
                        <></>
                    )}
                    <ChTableEngine
                        engineName={table.engine}
                        hasOwnData={table.hasOwnData}
                        hasEngineKeys={hasEngineKeys}
                        openState={[engineOpen, setEngineOpen]}
                    />
                </TableBody>
            </StyledTable>
        </TableContainer >
    );
};

export default ChTable;