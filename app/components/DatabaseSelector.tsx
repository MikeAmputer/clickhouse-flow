import { Select, MenuItem } from '@mui/material';
import React from 'react';

export type DatabaseSelectorProps = {
    databases: string[],
    callback: (dbConfigName: string) => void,
};

const DatabaseSelector: React.FC<DatabaseSelectorProps> = (props) => {
    const [selectedOption, setSelectedOption] = React.useState('');

    const handleSelectChange = (event: any) => {
        setSelectedOption(event.target.value);
        props.callback(event.target.value);
    };

    return (
        <Select
            // id='database-selector'
            name='database-selector'
            value={selectedOption}
            onChange={handleSelectChange}
            displayEmpty
            style={{
                position: 'absolute',
                top: 10,
                left: 10,
                zIndex: 10,
                backgroundColor: '#fff',
                height: 30,
                minWidth: 120,
            }}
            renderValue={(selected) => {
                if (!selected) {
                    return <span style={{ color: 'gray', fontStyle: 'italic' }}>Database</span>;
                }
                return selected;
            }}
            sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: '#000',
                    borderWidth: 0,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: '#000',
                    borderWidth: 0,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: '#000',
                    borderWidth: 0,
                }
            }}
        >
            <MenuItem value='' style={{ display: 'none' }}>Database</MenuItem>

            {props.databases.map((db) =>
                (<MenuItem key={`dropdown-menu-item-${db}`} value={db}>{db}</MenuItem>)
            )}
        </Select>
    );
};

export default DatabaseSelector;