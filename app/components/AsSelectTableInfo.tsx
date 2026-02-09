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

export type AsSelectTableInfoProps = {
    asSelect: string;
};

const AsSelectTableInfo: React.FC<AsSelectTableInfoProps> = (props) => {
    return (
        <StyledTableRow export-trim='true'>
            <StyledTableCell export-trim='true' sql-text='true'>
                {props.asSelect}
            </StyledTableCell>
        </StyledTableRow>
    );
};

export default AsSelectTableInfo;