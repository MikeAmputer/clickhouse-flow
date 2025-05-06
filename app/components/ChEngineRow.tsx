import React from 'react';
import { TableCell, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';

const padding = '4px';
const horizontalPadding = '8px';

const oddColor = '#dbdbdb';
const evenColor = '#ebebeb';

const EngineRow = styled(TableRow)(() => ({
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

const OddEngineRowLeftCell = styled(TableCell)(() => ({
    fontSize: 12,
    color: '#555',
    textAlign: 'left',
    padding: padding,
    backgroundColor: oddColor,
    borderRight: 'solid',
    borderRightWidth: 2,
    borderColor: oddColor,
    paddingLeft: horizontalPadding,
}));

const OddEngineRowRightCell = styled(TableCell)(() => ({
    fontSize: 14,
    color: '#000',
    textAlign: 'right',
    padding: padding,
    borderLeft: 'solid',
    borderLeftWidth: 2,
    borderColor: oddColor,
    backgroundColor: oddColor,
    paddingRight: horizontalPadding,
}));

const EvenEngineRowLeftCell = styled(TableCell)(() => ({
    fontSize: 12,
    color: '#555',
    textAlign: 'left',
    padding: padding,
    backgroundColor: evenColor,
    borderRight: 'solid',
    borderRightWidth: 2,
    borderColor: evenColor,
    paddingLeft: horizontalPadding,
}));

const EvenEngineRowRightCell = styled(TableCell)(() => ({
    fontSize: 14,
    color: '#000',
    textAlign: 'right',
    padding: padding,
    borderLeft: 'solid',
    borderLeftWidth: 2,
    borderColor: evenColor,
    backgroundColor: evenColor,
    paddingRight: horizontalPadding,
}));

export type ChEngineRowProps = {
    position: number;
    name: string;
    value: string;
};

const ChEngineRow: React.FC<ChEngineRowProps> = (props) => {
    const isOdd = props.position % 2 === 1;
    const EngineRowLeftCell = isOdd ? OddEngineRowLeftCell : EvenEngineRowLeftCell;
    const EngineRowRightCell = isOdd ? OddEngineRowRightCell : EvenEngineRowRightCell;

    return (
        <EngineRow>
            <EngineRowLeftCell export-trim='true'>{props.name}</EngineRowLeftCell>
            <EngineRowRightCell export-trim='true'>{props.value}</EngineRowRightCell>
        </EngineRow>
    );
};

export default ChEngineRow;