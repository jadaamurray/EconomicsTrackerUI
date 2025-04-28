import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, List } from '@mui/material';
import { useApp } from '../context/AppContext';

const IndicatorsPage = () => {
    const { indicators, loading, error, fetchIndicatorData } = useApp();
    
    useEffect(() => {
        if (!indicators && !loading) {
          fetchIndicatorData();
        }
      }, [indicators, loading, fetchIndicatorData]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, color: 'error.main' }}>
                <Typography>Error loading data: {error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Indicators Data Test
            </Typography>

            <List sx={{ maxWidth: 600 }}>
                {indicators?.map((indicators, index) => (
                    <ListItem key={index} divider>
                        <ListItemText
                            primary={indicators.name}
                            secondary={`Value: ${indicators.value} | Date: ${indicators.date}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default IndicatorsPage;