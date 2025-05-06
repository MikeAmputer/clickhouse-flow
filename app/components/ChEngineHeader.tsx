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
    hasowndata?: boolean;
};

const EngineHeaderRow = styled(TableRow)<EngineStyledProps>(({ hasowndata }) => ({
    borderBottom: 'solid',
    borderBottomWidth: 2,
    borderTop: 'solid',
    borderTopWidth: 2,
    borderColor: hasowndata ? ownDataHeaderColor : viewHeaderColor,
    backgroundColor: hasowndata ? ownDataHeaderColor : viewHeaderColor,
}));

const EngineNameCell = styled(TableCell)<EngineStyledProps>(({ hasowndata }) => ({
    backgroundColor: hasowndata ? ownDataHeaderColor : viewHeaderColor,
    color: '#fff',
    fontSize: 14,
    fontStyle: 'oblique',
    textAlign: 'left',
    padding: padding,
    borderRight: 'solid',
    borderRightWidth: 2,
    borderTop: 'solid',
    borderTopWidth: 2,
    borderColor: hasowndata ? ownDataHeaderColor : viewHeaderColor,
    paddingLeft: horizontalPadding,
}));

const ExpandCell = styled(TableCell)<EngineStyledProps>(({ hasowndata }) => ({
    backgroundColor: hasowndata ? ownDataHeaderColor : viewHeaderColor,
    textAlign: 'right',
    padding: padding,
    borderLeft: 'solid',
    borderLeftWidth: 2,
    borderTop: 'solid',
    borderTopWidth: 2,
    borderColor: hasowndata ? ownDataHeaderColor : viewHeaderColor,
    paddingRight: horizontalPadding,
}));

const ExpandButton = styled(IconButton)<EngineStyledProps>(({ hasowndata }) => ({
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

export type ChEngineHeaderProps = {
    engineName: string;
    hasOwnData: boolean;
    hasEngineKeys: boolean;
    openState: [boolean, Dispatch<SetStateAction<boolean>>];
};

const ChEngineHeader: React.FC<ChEngineHeaderProps> = (props) => {
    const [open, setOpen] = props.openState;

    return (
        <EngineHeaderRow export-trim='true' hasowndata={props.hasOwnData}>
            <EngineNameCell export-trim='true' hasowndata={props.hasOwnData}>
                {props.engineName}
            </EngineNameCell>
            <ExpandCell export-trim='true' hasowndata={props.hasOwnData}>
                {props.hasEngineKeys ? (
                    <ExpandButton
                        export-hide='true'
                        hasowndata={props.hasOwnData}
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