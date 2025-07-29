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
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from '@mui/material';
import { User as DbUser } from '../utils/database';

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
  const handleUserChange = (event: SelectChangeEvent<string>) => {
    onUserSelect(event.target.value);
  };

  const muiTheme = useTheme();

  const renderKpiCard = (title: string, value: string | number) => {
    return (
      <Grid item xs={12} sm={4}>
        <Paper 
          sx={{
            background: muiTheme.palette.background.paper,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '140px',
            borderRadius: 2,
            boxShadow: muiTheme.shadows[2],
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: muiTheme.shadows[6]
            },
            transition: 'all 0.3s ease-in-out'
          }}
        >
          <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1 }}>
            {value}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {title}
          </Typography>
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

  if (!data) {
    return <Box sx={{ p: 4 }}>No data available</Box>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Individuals
      </Typography>

      {users.length > 0 && (
        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel id="user-select-label">Select User</InputLabel>
          <Select
            labelId="user-select-label"
            value={selectedUser}
            label="Select User"
            onChange={handleUserChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {data && (
        <>
          <Grid container spacing={3}>
            {renderKpiCard('Total Messages Sent', data.totalMessagesSent)}
            {renderKpiCard('Most Popular Day', data.mostPopularDay)}
            {renderKpiCard('Total Reactions Sent', data.totalReactionsSent)}

            

            {(data.reactedToMost || data.receivedMostReactionsFrom) && (
              <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
                {data.reactedToMost && (
                  <Grid item xs={12} md={6} lg={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Paper 
                      sx={{
                        background: muiTheme.palette.background.paper,
                        p: 3,
                        borderRadius: 2,
                        boxShadow: muiTheme.shadows[2],
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: muiTheme.shadows[6]
                        },
                        transition: 'all 0.3s ease-in-out'
                      }}
                    >
                      <Typography variant="h6" color="text.secondary">Reacted To Most</Typography>
                      <Typography variant="h4">{data.reactedToMost.name}</Typography>
                      <Typography variant="body1" color="text.secondary">{data.reactedToMost.count} times</Typography>
                      <Typography variant="h5" sx={{ mt: 1 }}>{data.reactedToMost.emoji}</Typography>
                    </Paper>
                  </Grid>
                )}
                {data.receivedMostReactionsFrom && (
                  <Grid item xs={12} md={6} lg={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Paper 
                      sx={{
                        background: muiTheme.palette.background.paper,
                        p: 3,
                        borderRadius: 2,
                        boxShadow: muiTheme.shadows[2],
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: muiTheme.shadows[6]
                        },
                        transition: 'all 0.3s ease-in-out'
                      }}
                    >
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
                  background: muiTheme.palette.background.paper,
                  boxShadow: muiTheme.shadows[2],
                  '&:hover': {
                    boxShadow: muiTheme.shadows[4]
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
                    borderLeft: `4px solid ${muiTheme.palette.primary.main}`
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
                            borderBottom: `1px solid ${muiTheme.palette.divider}`
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
        </>
      )}
    </Box>
  );
};

export default IndividualStats;
