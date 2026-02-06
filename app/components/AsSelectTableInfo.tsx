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

export type AsSelectTableInfoProps = {
    asSelect: string;
};

const AsSelectTableInfo: React.FC<AsSelectTableInfoProps> = (props) => {
    return (
        <StyledTableRow export-trim='true'>
            <TableCell export-trim='true'>{props.asSelect}</TableCell>
        </StyledTableRow>
    );
};

export default AsSelectTableInfo;