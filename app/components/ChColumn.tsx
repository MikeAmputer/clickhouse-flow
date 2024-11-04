import React from 'react';
import { TableCell, TableRow, Tooltip, } from '@mui/material';
import { styled } from '@mui/material/styles';

const padding = '4px';
const horizontalPadding = '8px';

const OddNameTableCell = styled(TableCell)(() => ({
    fontSize: 14,
    color: '#000',
    textAlign: 'left',
    padding: padding,
    backgroundColor: '#fffbd4',
    borderRight: 'solid',
    borderRightWidth: 2,
    borderColor: '#fffbd4',
    paddingLeft: horizontalPadding,
}));

const EvenNameTableCell = styled(TableCell)(() => ({
    fontSize: 14,
    color: '#000',
    textAlign: 'left',
    padding: padding,
    backgroundColor: '#ebebeb',
    borderRight: 'solid',
    borderRightWidth: 2,
    borderColor: '#ebebeb',
    paddingLeft: horizontalPadding,
}));

const OddTypeTableCell = styled(TableCell)(() => ({
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    padding: padding,
    borderLeft: 'solid',
    borderLeftWidth: 2,
    borderColor: '#fffbd4',
    backgroundColor: '#fffbd4',
    paddingRight: horizontalPadding,
}));

const EvenTypeTableCell = styled(TableCell)(() => ({
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    padding: padding,
    borderLeft: 'solid',
    borderLeftWidth: 2,
    borderColor: '#ebebeb',
    backgroundColor: '#ebebeb',
    paddingRight: horizontalPadding,
}));

const StyledTableRow = styled(TableRow)(() => ({
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
};

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