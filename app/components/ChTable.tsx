import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import ChColumn, { ChColumnProps } from './ChColumn';
import ChEngineRow from './ChEngineRow';
import ChTableHeader from './ChTableHeader';
import ChEngineHeader from './ChEngineHeader';

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

const ownDataHeaderColor = '#000';
const viewHeaderColor = '#383838';

interface TableStyledProps {
    hasowndata?: boolean;
    borderwidth?: number;
};

const StyledTable = styled(Table)<TableStyledProps>(({ hasowndata, borderwidth }) => ({
    borderCollapse: 'collapse',
    borderSpacing: 0,
    background: hasowndata ? ownDataHeaderColor : viewHeaderColor,
    minWidth: 250,
    borderStyle: 'solid',
    borderWidth: borderwidth ?? 0,
    borderColor: hasowndata ? ownDataHeaderColor : viewHeaderColor,
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
    refreshable: string | null;
}

const ChTable: React.FC<ChTableProps> = (table) => {
    const isMatView = table.engine === 'MaterializedView'

    const [columnsOpen, setColumnsOpen] = useState(!isMatView);
    const [engineOpen, setEngineOpen] = useState(false);

    const engineKeys: [name: string, value: string][] = [
        ['ORDER BY', table.sortingKey],
        ['PARTITION BY', table.partitionKey],
        ['PRIMARY KEY', table.primaryKey],
        ['SAMPLE BY', table.samplingKey],
    ];

    const nonEmptyEngineKeys = engineKeys.filter((key) => key[1] != null && key[1].trim() !== '');

    return (
        <TableContainer component={Paper} elevation={5} aria-label='ch-table-container'>
            <StyledTable size={'small'} aria-label='ch-table' hasowndata={table.hasOwnData}>
                <TableBody>
                    <ChTableHeader
                        name={table.presentationName}
                        hasOwnData={table.hasOwnData}
                        openState={[columnsOpen, setColumnsOpen]}
                    />

                    <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0, padding: 0, borderWidth: 0 }} colSpan={2}>
                            <Collapse in={columnsOpen} timeout='auto' unmountOnExit>
                                <Box>
                                    <Table
                                        size='small'
                                        aria-label='table-info'
                                        style={{ borderCollapse: 'collapse', borderSpacing: 0, }}
                                    >
                                        <TableBody>
                                            {table.columns.map((column) => (
                                                <ChColumn key={`${table.fullName}_${column.position}`} {...column} />
                                            ))}
                                        </TableBody>
                                    </Table>
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

                    <ChEngineHeader
                        engineName={table.engine}
                        hasOwnData={table.hasOwnData}
                        hasEngineKeys={nonEmptyEngineKeys.length > 0}
                        openState={[engineOpen, setEngineOpen]}
                        refreshable={table.refreshable}
                    />

                    <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0, padding: 0, borderWidth: 0 }} colSpan={2}>
                            <Collapse in={engineOpen} timeout='auto' unmountOnExit>
                                <Box>
                                    <Table
                                        size='small'
                                        aria-label='engine-info'
                                        style={{ borderCollapse: 'collapse', borderSpacing: 0, }}
                                    >
                                        <TableBody>
                                            {nonEmptyEngineKeys.map((row, index) => (
                                                <ChEngineRow
                                                    key={`${table.fullName}_${row[0]}`}
                                                    position={index + 1}
                                                    name={row[0]}
                                                    value={row[1]}
                                                />
                                            ))}
                                        </TableBody>
                                    </Table>
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