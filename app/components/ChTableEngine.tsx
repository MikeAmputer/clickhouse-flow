import React, { SetStateAction, Dispatch } from 'react';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { TableCell, TableRow, IconButton, } from '@mui/material';

const padding = '3px';
const horizontalPadding = '4px';

interface EngineStyledProps {
    hasOwnData?: boolean;
};

const EngineHeadRow = styled(TableRow)<EngineStyledProps>(({ hasOwnData }) => ({
    borderBottom: 'solid',
    borderBottomWidth: 2,
    borderTop: 'solid',
    borderTopWidth: 2,
    borderColor: hasOwnData ? '#000' : '#383838',
    backgroundColor: hasOwnData ? '#000' : '#383838',
}));

const EngineNameCell = styled(TableCell)<EngineStyledProps>(({ hasOwnData }) => ({
    backgroundColor: hasOwnData ? '#000' : '#383838',
    color: '#fff',
    fontSize: 14,
    fontStyle: 'oblique',
    textAlign: 'left',
    padding: padding,
    borderRight: 'solid',
    borderRightWidth: 2,
    borderTop: 'solid',
    borderTopWidth: 2,
    borderColor: hasOwnData ? '#000' : '#383838',
    paddingLeft: horizontalPadding,
}));

const ExpandCell = styled(TableCell)<EngineStyledProps>(({ hasOwnData }) => ({
    backgroundColor: hasOwnData ? '#000' : '#383838',
    textAlign: 'right',
    padding: padding,
    borderLeft: 'solid',
    borderLeftWidth: 2,
    borderTop: 'solid',
    borderTopWidth: 2,
    borderColor: hasOwnData ? '#000' : '#383838',
    paddingRight: horizontalPadding,
}));

const ExpandButton = styled(IconButton)<EngineStyledProps>(({ hasOwnData }) => ({
    height: 25,
    width: 25,
    color: '#fff',
    '&:hover': {
        backgroundColor: hasOwnData ? '#383838' : '#000',
        color: '#fff',
    },
    '&:active': {
        transform: 'scale(0.9)',
    },
}));

export type ChTableEngineProps = {
    engineName: string;
    hasOwnData: boolean;
    hasEngineKeys: boolean;
    openState: [boolean, Dispatch<SetStateAction<boolean>>];
};

const ChTableEngine: React.FC<ChTableEngineProps> = (props) => {
    const [open, setOpen] = props.openState;

    return (
        <EngineHeadRow hasOwnData={props.hasOwnData}>
            <EngineNameCell hasOwnData={props.hasOwnData}>
                {props.engineName}
            </EngineNameCell>
            <ExpandCell hasOwnData={props.hasOwnData}>
                {props.hasEngineKeys ? (
                    <ExpandButton
                        hasOwnData={props.hasOwnData}
                        aria-label={'expand table'}
                        size={'small'}
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </ExpandButton>
                ) : (
                    <></>
                )}
            </ExpandCell>
        </EngineHeadRow>
    );
};

export default ChTableEngine;