import React, { SetStateAction, Dispatch } from 'react';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { TableCell, TableRow, IconButton, } from '@mui/material';

interface TableStyledHeaderProps {
    hasOwnData?: boolean;
};

const TableNameCell = styled(TableCell)<TableStyledHeaderProps>(({ hasOwnData }) => ({
    backgroundColor: hasOwnData ? '#000' : '#383838',
    color: '#fff',
    fontSize: 14,
    textAlign: 'left',
    padding: '5px',
}));

const ExpandCell = styled(TableCell)<TableStyledHeaderProps>(({ hasOwnData }) => ({
    backgroundColor: hasOwnData ? '#000' : '#383838',
    textAlign: 'right',
    padding: '5px',
}));

const ExpandButton = styled(IconButton)<TableStyledHeaderProps>(({ hasOwnData }) => ({
    color: '#fff',
    '&:hover': {
        backgroundColor: hasOwnData ? '#383838' : '#000',
        color: '#fff',
    },
    '&:active': {
        transform: 'scale(0.95)',
    },
}));

const TableHeadRow = styled(TableRow)<TableStyledHeaderProps>(({ hasOwnData }) => ({
    borderBottom: 'solid',
    borderBottomWidth: 0,
    borderColor: '#000',
    backgroundColor: hasOwnData ? '#000' : '#383838',
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