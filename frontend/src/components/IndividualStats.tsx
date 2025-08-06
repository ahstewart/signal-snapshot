import * as React from 'react';
import {
  Box,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Typography,
  useTheme,
  Autocomplete,
  TextField,
} from '@mui/material';
import { User as DbUser } from '../utils/database';
import { PageHeader } from './PageHeader';

interface User {
  id: string;
  name: string;
}

interface Reaction {
  emoji: string;
  sender: string;
}

interface MostPopularMessage {
  text: string | null;
  reactionCount: number;
  reactions: Reaction[];
}

interface IndividualStatsData {
  totalMessagesSent: number;
  mostPopularDay: string;
  totalReactionsSent: number;
  reactedToMost: {
    name: string;
    count: number;
    emoji: string;
  } | null;
  receivedMostReactionsFrom: {
    name: string;
    count: number;
    emoji: string;
  } | null;
  mostPopularMessage: MostPopularMessage | null;
}

interface IndividualStatsProps {
  users: DbUser[];
  selectedUser: string;
  onUserSelect: (userId: string) => void;
  data: IndividualStatsData | null;
  loading: boolean;
  error: string | null;
}

const IndividualStats: React.FC<IndividualStatsProps> = ({
  users,
  selectedUser,
  onUserSelect,
  data,
  loading,
  error
}) => {
  const handleUserChange = (_event: React.SyntheticEvent, value: string | null) => {
    onUserSelect(value || '');
  };

  const theme = useTheme();

  const renderKpiCard = (title: string, value: string | number) => {
    return (
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #f4f7fa 70%, #e3ecf7 100%)', boxShadow: 3, borderRadius: 3, border: '1px solid #d6e0ef' }}>
          <Typography variant="h4" component="div">{value}</Typography>
          <Typography variant="body1" color="text.secondary">{title}</Typography>
        </Paper>
      </Grid>
    );
  };

  if (loading) {
    return <Box sx={{ p: 4 }}>Loading...</Box>;
  }

  if (error) {
    return <Box sx={{ p: 4, color: 'error.main' }}>Error: {error}</Box>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <PageHeader 
        title="Individual Statistics"
        subtitle="Select a user to view their chat metrics and engagement statistics."
      >
        {users.length > 0 && (
          <Autocomplete
            size="small"
            sx={{ minWidth: 300, mt: { xs: 2, sm: 0 } }}
            options={users.map(user => user.id)}
            getOptionLabel={(id) => {
              const user = users.find(u => u.id === id);
              return user?.name || id;
            }}
            value={selectedUser || null}
            onChange={handleUserChange}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Select User" 
                variant="outlined"
                size="small"
              />
            )}
            isOptionEqualToValue={(option, value) => option === value}
          />
        )}
      </PageHeader>

      {/* Only show stats if a user is selected and data is available */}
      {selectedUser && data && (
        <Box>
          <Grid container spacing={3}>
            {renderKpiCard('Total Messages Sent', data.totalMessagesSent)}
            {renderKpiCard('Most Popular Day', data.mostPopularDay)}
            {renderKpiCard('Total Reactions Sent', data.totalReactionsSent)}

            {(data.reactedToMost || data.receivedMostReactionsFrom) && (
              <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
                {data.reactedToMost && (
                  <Grid item xs={12} md={6} lg={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #f4f7fa 70%, #e3ecf7 100%)', boxShadow: 3, borderRadius: 3, border: '1px solid #d6e0ef' }}>
                      <Typography variant="h6" color="text.secondary">Reacted To Most</Typography>
                      <Typography variant="h4">{data.reactedToMost.name}</Typography>
                      <Typography variant="body1" color="text.secondary">{data.reactedToMost.count} times</Typography>
                      <Typography variant="h5" sx={{ mt: 1 }}>{data.reactedToMost.emoji}</Typography>
                    </Paper>
                  </Grid>
                )}
                {data.receivedMostReactionsFrom && (
                  <Grid item xs={12} md={6} lg={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #f4f7fa 70%, #e3ecf7 100%)', boxShadow: 3, borderRadius: 3, border: '1px solid #d6e0ef' }}>
                      <Typography variant="h6" color="text.secondary">Received Most Reactions From</Typography>
                      <Typography variant="h4">{data.receivedMostReactionsFrom.name}</Typography>
                      <Typography variant="body1" color="text.secondary">{data.receivedMostReactionsFrom.count} times</Typography>
                      <Typography variant="h5" sx={{ mt: 1 }}>{data.receivedMostReactionsFrom.emoji}</Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            )}
          </Grid>

          {data.mostPopularMessage && (
            <Grid item sx={{ display: 'flex', justifyContent: 'center', mt: 4, width: '100%' }}>
              <Paper 
                sx={{ 
                  p: 4, 
                  width: '100%',
                  maxWidth: '800px',
                  background: theme.palette.background.paper,
                  boxShadow: theme.shadows[2],
                  '&:hover': {
                    boxShadow: theme.shadows[4]
                  },
                  transition: 'box-shadow 0.3s ease-in-out'
                }}
              >
                <Typography variant="h5" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
                  Most Popular Message
                </Typography>
                <Box 
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    borderRadius: 1, 
                    bgcolor: 'background.default',
                    borderLeft: `4px solid ${theme.palette.primary.main}`
                  }}
                >
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    "{data.mostPopularMessage.text || 'Media message'}"
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                    {data.mostPopularMessage.reactionCount} reaction{data.mostPopularMessage.reactionCount !== 1 ? 's' : ''}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ maxHeight: 200, overflow: 'auto', pr: 1 }}>
                  <List dense disablePadding>
                    {data.mostPopularMessage.reactions.map((reaction: Reaction, index: number) => (
                      <ListItem 
                        key={index} 
                        disableGutters 
                        sx={{ 
                          py: 1,
                          '&:not(:last-child)': {
                            borderBottom: `1px solid ${theme.palette.divider}`
                          }
                        }}
                      >
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography component="span" sx={{ fontSize: '1.25rem', mr: 1 }}>
                                {reaction.emoji}
                              </Typography>
                              <Typography component="span" variant="body2">
                                from {reaction.sender}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Paper>
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
};

export default IndividualStats;
