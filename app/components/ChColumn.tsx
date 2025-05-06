import React from 'react';
import { TableCell, TableRow, Tooltip, } from '@mui/material';
import { styled } from '@mui/material/styles';

const padding = '4px';
const horizontalPadding = '8px';

const oddColor = '#fffbd4';
const evenColor = '#ebebeb';

const StyledTableRow = styled(TableRow)(() => ({
    '&:nth-of-type(even)': {
        backgroundColor: evenColor,
        borderColor: evenColor,
    },
    '&:nth-of-type(odd)': {
        backgroundColor: oddColor,
        borderColor: oddColor,
    },
    borderBottom: 'solid',
    borderBottomWidth: 2,
}));

const OddNameTableCell = styled(TableCell)(() => ({
    fontSize: 14,
    color: '#000',
    textAlign: 'left',
    padding: padding,
    backgroundColor: oddColor,
    borderRight: 'solid',
    borderRightWidth: 2,
    borderColor: oddColor,
    paddingLeft: horizontalPadding,
}));

const EvenNameTableCell = styled(TableCell)(() => ({
    fontSize: 14,
    color: '#000',
    textAlign: 'left',
    padding: padding,
    backgroundColor: evenColor,
    borderRight: 'solid',
    borderRightWidth: 2,
    borderColor: evenColor,
    paddingLeft: horizontalPadding,
}));

const OddTypeTableCell = styled(TableCell)(() => ({
    fontSize: 12,
    color: '#777',
    textAlign: 'right',
    padding: padding,
    borderLeft: 'solid',
    borderLeftWidth: 2,
    borderColor: oddColor,
    backgroundColor: oddColor,
    paddingRight: horizontalPadding,
}));

const EvenTypeTableCell = styled(TableCell)(() => ({
    fontSize: 12,
    color: '#777',
    textAlign: 'right',
    padding: padding,
    borderLeft: 'solid',
    borderLeftWidth: 2,
    borderColor: evenColor,
    backgroundColor: evenColor,
    paddingRight: horizontalPadding,
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
        <StyledTableRow export-trim='true'>
            <NameCell export-trim='true'>{column.name}</NameCell>
            <TypeCell export-trim='true'>
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