import React from 'react';
import { TableCell, TableRow, } from '@mui/material';
import { styled } from '@mui/material/styles';

const backgroundColor = '#ebebeb';

const StyledTableRow = styled(TableRow)(() => ({
    backgroundColor: backgroundColor,
    borderColor: backgroundColor,
    borderBottom: 'solid',
    borderBottomWidth: 2,
}));

const StyledTableCell = styled(TableCell)(() => ({
    whiteSpace: 'pre-wrap',
    fontFamily: 'var(--font-jb-mono-regular)',
    fontSize: '13px',
    lineHeight: '1.3',
}));

export type SqlTableInfoProps = {
    sqlText: string;
};

const SqlTableInfo: React.FC<SqlTableInfoProps> = (props) => {
    return (
        <StyledTableRow export-trim='true'>
            <StyledTableCell export-trim='true' sql-text='true'>
                {props.sqlText}
            </StyledTableCell>
        </StyledTableRow>
    );
};

export default SqlTableInfo;