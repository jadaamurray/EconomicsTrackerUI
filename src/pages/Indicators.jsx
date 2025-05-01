import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, List, ListItem, ListItemText, Alert } from '@mui/material';
import { useApp } from '../context/AppContext';

const IndicatorsPage = () => {
    const { indicatorData, loading, error, fetchIndicatorData } = useApp();
    const [initialised, setInitialised] = useState(false);

    useEffect(() => {
        // only fetch if there are no indicators and not already loading 
        if (!loading && !initialised) {
            setInitialised(true);
            fetchIndicatorData();
        }
    }, [indicatorData, loading]);

    console.log('Indicator data: ', indicatorData);

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

            {Array.isArray(indicatorData) ? (
                <List sx={{ maxWidth: 600 }}>
                    {indicatorData?.map(indicatorData => (
                        <ListItem key={indicatorData.id} divider>
                            <ListItemText
                                primary={indicatorData.name}
                                secondary={`${indicatorData.unit} | ${indicatorData.category}`}
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography>No indicator data available</Typography>
            )}
        </Box>
    );
};

export default IndicatorsPage;