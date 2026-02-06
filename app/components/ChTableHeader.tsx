import React, { SetStateAction, Dispatch } from 'react';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { TableCell, TableRow, IconButton, } from '@mui/material';

const padding = '3px';
const horizontalPadding = '4px';

const ownDataHeaderColor = '#000';
const viewHeaderColor = '#383838';

interface TableStyledHeaderProps {
    hasowndata?: boolean;
};

const TableHeadRow = styled(TableRow)<TableStyledHeaderProps>(({ hasowndata }) => ({
    borderBottom: 'solid',
    borderBottomWidth: 2,
    borderColor: hasowndata ? ownDataHeaderColor : viewHeaderColor,
    backgroundColor: hasowndata ? ownDataHeaderColor : viewHeaderColor,
}));

const TableNameCell = styled(TableCell)<TableStyledHeaderProps>(({ hasowndata }) => ({
    backgroundColor: hasowndata ? ownDataHeaderColor : viewHeaderColor,
    color: '#fff',
    fontSize: 14,
    textAlign: 'left',
    padding: padding,
    borderRight: 'solid',
    borderRightWidth: 2,
    borderColor: hasowndata ? ownDataHeaderColor : viewHeaderColor,
    paddingLeft: horizontalPadding,
}));

const ExpandCell = styled(TableCell)<TableStyledHeaderProps>(({ hasowndata }) => ({
    backgroundColor: hasowndata ? ownDataHeaderColor : viewHeaderColor,
    textAlign: 'right',
    padding: padding,
    borderLeft: 'solid',
    borderLeftWidth: 2,
    borderColor: hasowndata ? ownDataHeaderColor : viewHeaderColor,
    paddingRight: horizontalPadding,
}));

const ExpandButton = styled(IconButton)<TableStyledHeaderProps>(({ hasowndata }) => ({
    height: 25,
    width: 25,
    color: '#fff',
    '&:hover': {
        backgroundColor: hasowndata ? viewHeaderColor : ownDataHeaderColor,
    },
    '&:active': {
        transform: 'scale(0.9)',
    },
}));

export type ChTableHeaderProps = {
    name: string;
    hasOwnData: boolean;
    openState: [boolean, Dispatch<SetStateAction<boolean>>];
};

const ChTableHeader: React.FC<ChTableHeaderProps> = (props) => {
    const [open, setOpen] = props.openState;

    return (
        <TableHeadRow export-trim='true' hasowndata={props.hasOwnData}>
            <TableNameCell export-trim='true' hasowndata={props.hasOwnData}>{props.name}</TableNameCell>
            <ExpandCell export-trim='true' hasowndata={props.hasOwnData}>
                <ExpandButton
                    export-hide='true'
                    hasowndata={props.hasOwnData}
                    aria-label={'expand-table'}
                    size={'small'}
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </ExpandButton>
            </ExpandCell>
        </TableHeadRow>
    );
};

export default ChTableHeader;