import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
  Autocomplete,
  TextField,
} from '@mui/material';
import { User, IndividualStatsData, loadUsers, loadIndividualStats } from '../utils/database';

interface IndividualStatsProps {
  users: any[];
  selectedUser: string;
  onUserSelect: (userId: string) => void;
  data: any;
  loading: boolean;
  error: string | null;
}

const IndividualStats: React.FC<IndividualStatsProps> = ({ users, selectedUser, onUserSelect, data, loading, error }) => {
  const handleUserChange = (event: any, value: string | null) => {
    onUserSelect(value || '');
  };
  const renderKpiCard = (title: string, value: string | number) => (
    <Grid item xs={12} sm={4}>
      <Paper sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h4" component="div">{value}</Typography>
        <Typography variant="body1" color="text.secondary">{title}</Typography>
      </Paper>
    </Grid>
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Individuals
      </Typography>
      {selectedUser && (
        <Typography variant="h6" gutterBottom>
          {users.find(u => u.id === selectedUser)?.name || selectedUser}
        </Typography>
      )}

      {/* Upload controls removed; now in header */}

      {users.length > 0 && (
        <Autocomplete
          options={users.map(user => user.id)}
          getOptionLabel={(id) => {
            const user = users.find(u => u.id === id);
            return user?.name || id;
          }}
          value={selectedUser || null}
          onChange={handleUserChange}
          renderInput={(params) => <TextField {...params} label="Select a person" />}
          isOptionEqualToValue={(option, value) => option === value}
          sx={{ mb: 4 }}
        />
      )}

      {data && (
        <Grid container spacing={3}>
          {renderKpiCard('Total Messages Sent', data.totalMessagesSent)}
          {renderKpiCard('Most Popular Day', data.mostPopularDay)}
          {renderKpiCard('Total Reactions Sent', data.totalReactionsSent)}

          {data.reactedToMost && (
            <Grid item xs={12} md={6} lg={4}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">Reacted To Most</Typography>
                <Typography variant="h4">{data.reactedToMost.name}</Typography>
                <Typography variant="body1" color="text.secondary">{data.reactedToMost.count} times</Typography>
                <Typography variant="h5" sx={{ mt: 1 }}>{data.reactedToMost.emoji}</Typography>
              </Paper>
            </Grid>
          )}

          {data.receivedMostReactionsFrom && (
            <Grid item xs={12} md={6} lg={4}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">Received Most Reactions From</Typography>
                <Typography variant="h4">{data.receivedMostReactionsFrom.name}</Typography>
                <Typography variant="body1" color="text.secondary">{data.receivedMostReactionsFrom.count} times</Typography>
                <Typography variant="h5" sx={{ mt: 1 }}>{data.receivedMostReactionsFrom.emoji}</Typography>
              </Paper>
            </Grid>
          )}

          {data.mostPopularMessage && (
            <Grid item xs={12} md={12} lg={4}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" color="text.secondary">Most Popular Message</Typography>
                <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>"{data.mostPopularMessage.text || 'Media message'}"</Typography>
                <Typography variant="body2" color="text.secondary">{data.mostPopularMessage.reactionCount} reactions</Typography>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                  <List dense>
                    {data.mostPopularMessage.reactions.map((reaction: any, index: number) => (
                      <ListItem key={index} disableGutters sx={{ py: 0 }}>
                        <ListItemText primary={`${reaction.emoji} from ${reaction.sender}`} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default IndividualStats;
