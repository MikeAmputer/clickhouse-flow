import React from 'react';
import { TableCell, TableRow, Tooltip, } from '@mui/material';
import { styled } from '@mui/material/styles';

const OddNameTableCell = styled(TableCell)(({ theme }) => ({
    fontSize: 14,
    color: '#000',
    textAlign: 'left',
    padding: '5px',
    backgroundColor: '#fffbd4',
    borderRight: 'solid',
    borderRightWidth: 2,
    borderColor: '#fffbd4',
}));

const EvenNameTableCell = styled(TableCell)(({ theme }) => ({
    fontSize: 14,
    color: '#000',
    textAlign: 'left',
    padding: '5px',
    backgroundColor: '#ebebeb',
    borderRight: 'solid',
    borderRightWidth: 2,
    borderColor: '#ebebeb',
}));

const OddTypeTableCell = styled(TableCell)(({ theme }) => ({
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    padding: '5px',
    borderLeft: 'solid',
    borderLeftWidth: 2,
    borderColor: '#fffbd4',
    backgroundColor: '#fffbd4',
}));

const EvenTypeTableCell = styled(TableCell)(({ theme }) => ({
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    padding: '5px',
    borderLeft: 'solid',
    borderLeftWidth: 2,
    borderColor: '#ebebeb',
    backgroundColor: '#ebebeb',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: '#ebebeb',
        borderColor: '#ebebeb',
    },
    '&:nth-of-type(odd)': {
        backgroundColor: '#fffbd4',
        borderColor: '#fffbd4',
    },
    borderBottom: 'solid',
    borderBottomWidth: 2,
}));

export type ChColumnProps = {
    position: number;
    name: string;
    type: string;
    defaultKind: string;
    defaultExpression: string;
}

const ChColumn: React.FC<ChColumnProps> = (column) => {
    const isOdd = column.position % 2 === 1;
    const NameCell = isOdd ? OddNameTableCell : EvenNameTableCell;
    const TypeCell = isOdd ? OddTypeTableCell : EvenTypeTableCell;

    const hasDefault = column.defaultKind || column.defaultExpression;

    return (
        <StyledTableRow>
            <NameCell>{column.name}</NameCell>
            <TypeCell>
                {hasDefault ? (
                    <Tooltip title={`${column.defaultKind} ${column.defaultExpression}`}>
                        <span style={{ textDecoration: 'underline', cursor: 'help' }}>
                            {column.type}
                        </span>
                    </Tooltip>
                ) : (
                    <span>{column.type}</span>
                )}
            </TypeCell>
        </StyledTableRow>
    );
};

export default ChColumn;