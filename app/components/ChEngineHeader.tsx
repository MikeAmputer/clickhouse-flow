import React, { SetStateAction, Dispatch } from 'react';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { TableCell, TableRow, IconButton, } from '@mui/material';

const padding = '3px';
const horizontalPadding = '4px';

const ownDataHeaderColor = '#000';
const viewHeaderColor = '#383838';


interface EngineStyledProps {
    hasOwnData?: boolean;
};

const EngineHeaderRow = styled(TableRow)<EngineStyledProps>(({ hasOwnData }) => ({
    borderBottom: 'solid',
    borderBottomWidth: 2,
    borderTop: 'solid',
    borderTopWidth: 2,
    borderColor: hasOwnData ? ownDataHeaderColor : viewHeaderColor,
    backgroundColor: hasOwnData ? ownDataHeaderColor : viewHeaderColor,
}));

const EngineNameCell = styled(TableCell)<EngineStyledProps>(({ hasOwnData }) => ({
    backgroundColor: hasOwnData ? ownDataHeaderColor : viewHeaderColor,
    color: '#fff',
    fontSize: 14,
    fontStyle: 'oblique',
    textAlign: 'left',
    padding: padding,
    borderRight: 'solid',
    borderRightWidth: 2,
    borderTop: 'solid',
    borderTopWidth: 2,
    borderColor: hasOwnData ? ownDataHeaderColor : viewHeaderColor,
    paddingLeft: horizontalPadding,
}));

const ExpandCell = styled(TableCell)<EngineStyledProps>(({ hasOwnData }) => ({
    backgroundColor: hasOwnData ? ownDataHeaderColor : viewHeaderColor,
    textAlign: 'right',
    padding: padding,
    borderLeft: 'solid',
    borderLeftWidth: 2,
    borderTop: 'solid',
    borderTopWidth: 2,
    borderColor: hasOwnData ? ownDataHeaderColor : viewHeaderColor,
    paddingRight: horizontalPadding,
}));

const ExpandButton = styled(IconButton)<EngineStyledProps>(({ hasOwnData }) => ({
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

export type ChEngineHeaderProps = {
    engineName: string;
    hasOwnData: boolean;
    hasEngineKeys: boolean;
    openState: [boolean, Dispatch<SetStateAction<boolean>>];
};

const ChEngineHeader: React.FC<ChEngineHeaderProps> = (props) => {
    const [open, setOpen] = props.openState;

    return (
        <EngineHeaderRow hasOwnData={props.hasOwnData}>
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
        </EngineHeaderRow>
    );
};

export default ChEngineHeader;