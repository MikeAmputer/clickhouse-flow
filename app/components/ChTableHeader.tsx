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
    hasOwnData?: boolean;
};

const TableHeadRow = styled(TableRow)<TableStyledHeaderProps>(({ hasOwnData }) => ({
    borderBottom: 'solid',
    borderBottomWidth: 2,
    borderColor: hasOwnData ? ownDataHeaderColor : viewHeaderColor,
    backgroundColor: hasOwnData ? ownDataHeaderColor : viewHeaderColor,
}));

const TableNameCell = styled(TableCell)<TableStyledHeaderProps>(({ hasOwnData }) => ({
    backgroundColor: hasOwnData ? ownDataHeaderColor : viewHeaderColor,
    color: '#fff',
    fontSize: 14,
    textAlign: 'left',
    padding: padding,
    borderRight: 'solid',
    borderRightWidth: 2,
    borderColor: hasOwnData ? ownDataHeaderColor : viewHeaderColor,
    paddingLeft: horizontalPadding,
}));

const ExpandCell = styled(TableCell)<TableStyledHeaderProps>(({ hasOwnData }) => ({
    backgroundColor: hasOwnData ? ownDataHeaderColor : viewHeaderColor,
    textAlign: 'right',
    padding: padding,
    borderLeft: 'solid',
    borderLeftWidth: 2,
    borderColor: hasOwnData ? ownDataHeaderColor : viewHeaderColor,
    paddingRight: horizontalPadding,
}));

const ExpandButton = styled(IconButton)<TableStyledHeaderProps>(({ hasOwnData }) => ({
    height: 25,
    width: 25,
    color: '#fff',
    '&:hover': {
        backgroundColor: hasOwnData ? viewHeaderColor : ownDataHeaderColor,
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
        <TableHeadRow hasOwnData={props.hasOwnData}>
            <TableNameCell hasOwnData={props.hasOwnData}>{props.name}</TableNameCell>
            <ExpandCell hasOwnData={props.hasOwnData}>
                <ExpandButton
                    hasOwnData={props.hasOwnData}
                    aria-label={'expand table'}
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