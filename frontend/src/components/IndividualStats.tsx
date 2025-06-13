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
} from '@mui/material';
import { User, IndividualStatsData, loadUsers, loadIndividualStats } from '../utils/database';

interface IndividualStatsProps {
  users: any[];
  selectedUser: string;
  setSelectedUser: React.Dispatch<React.SetStateAction<string>>;
  statsData: any;
  loading: boolean;
  error: string | null;
}

const IndividualStats: React.FC<IndividualStatsProps> = ({ users, selectedUser, setSelectedUser, statsData, loading, error }) => {
  const handleUserChange = (event: SelectChangeEvent<string>) => {
    setSelectedUser(event.target.value);
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
        Individual Stats
      </Typography>
      {selectedUser && (
        <Typography variant="h6" gutterBottom>
          {users.find(u => u.id === selectedUser)?.name || selectedUser}
        </Typography>
      )}

      {/* Upload controls removed; now in header */}

      {users.length > 0 && (
        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel id="user-select-label">Select User</InputLabel>
          <Select
            labelId="user-select-label"
            value={selectedUser}
            label="Select User"
            onChange={handleUserChange}
          >
            {users.map(user => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {statsData && (
        <Grid container spacing={3}>
          {renderKpiCard('Total Messages Sent', statsData.totalMessagesSent)}
          {renderKpiCard('Most Popular Day', statsData.mostPopularDay)}
          {renderKpiCard('Total Reactions Sent', statsData.totalReactionsSent)}

          {statsData.reactedToMost && (
            <Grid item xs={12} md={6} lg={4}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">Reacted To Most</Typography>
                <Typography variant="h4">{statsData.reactedToMost.name}</Typography>
                <Typography variant="body1" color="text.secondary">{statsData.reactedToMost.count} times</Typography>
                <Typography variant="h5" sx={{ mt: 1 }}>{statsData.reactedToMost.emoji}</Typography>
              </Paper>
            </Grid>
          )}

          {statsData.receivedMostReactionsFrom && (
            <Grid item xs={12} md={6} lg={4}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">Received Most Reactions From</Typography>
                <Typography variant="h4">{statsData.receivedMostReactionsFrom.name}</Typography>
                <Typography variant="body1" color="text.secondary">{statsData.receivedMostReactionsFrom.count} times</Typography>
                <Typography variant="h5" sx={{ mt: 1 }}>{statsData.receivedMostReactionsFrom.emoji}</Typography>
              </Paper>
            </Grid>
          )}

          {statsData.mostPopularMessage && (
            <Grid item xs={12} md={12} lg={4}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>Most Popular Message</Typography>
                <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 1 }}>
                  "{statsData.mostPopularMessage.text}"
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {statsData.mostPopularMessage.reactionCount} reactions
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                  <List dense>
                    {statsData.mostPopularMessage.reactions.map((reaction: any, index: number) => (
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
