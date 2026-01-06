import * as React from 'react';
import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
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
  summary?: string;
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

  const renderSummary = (summary: string) => {
    const lines = summary.split('\n');
    return (
      <Box>
        {lines.map((line, idx) => {
          const headingMatch = /^\s*(Who (?:is|you) you\s*(?:is)?|Why you'll never make it in the big city|Why you'll run this town some\s*day)\s*:\s*(.*)$/.exec(line);

          if (headingMatch) {
            const heading = headingMatch[1];
            const rest = headingMatch[2];
            return (
              <Box key={idx} sx={{ mt: idx === 0 ? 0 : 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  {heading}:
                </Typography>
                {rest ? (
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'text.primary', fontSize: { xs: '0.9rem', md: '1rem' } }}>
                    {rest.trimStart()}
                  </Typography>
                ) : null}
              </Box>
            );
          }

          return (
            <Typography
              key={idx}
              variant="body1"
              sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'text.primary', fontSize: { xs: '0.9rem', md: '1rem' } }}
            >
              {line}
            </Typography>
          );
        })}
      </Box>
    );
  };

  const renderKpiCard = (title: string, value: string | number) => {
    return (
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: { xs: 1.5, md: 2 }, textAlign: 'center', background: 'linear-gradient(135deg, #f4f7fa 70%, #e3ecf7 100%)', boxShadow: 3, borderRadius: 3, border: '1px solid #d6e0ef' }}>
          <Typography variant="h4" component="div" sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>{value}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>{title}</Typography>
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
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader 
        title="Individual Statistics"
        subtitle="Select an individual to analyze."
      >
        {users.length > 0 && (
          <Autocomplete
            size="medium"
            sx={{ width: '100%', maxWidth: { xs: '100%', md: 600 }, mt: { xs: 1, md: 2 } }}
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
                size="medium"
                sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
              />
            )}
            isOptionEqualToValue={(option, value) => option === value}
          />
        )}
      </PageHeader>

      {/* Only show stats if a user is selected */}
      {selectedUser && (
        <Box>
          {data ? (
            <Box>
              {/* Summary Section */}
              {(data as any).summary && (
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: { xs: 2, md: 3 }, 
                    mb: 4, 
                    border: '1px solid', 
                    borderColor: 'primary.main', 
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700, textAlign: 'center' }}>
                      Personality Analysis Presented by Toyotathon
                    </Typography>
                  </Box>
                  {renderSummary((data as any).summary)}
                </Paper>
              )}

              <Grid container spacing={3}>
                {renderKpiCard('Total Messages Sent', data.totalMessagesSent)}
                {renderKpiCard('Most Popular Day', data.mostPopularDay)}
                {renderKpiCard('Total Reactions Sent', data.totalReactionsSent)}

                {(data.reactedToMost || data.receivedMostReactionsFrom) && (
                  <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
                    {data.reactedToMost && (
                      <Grid item xs={12} md={6} lg={4} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #f4f7fa 70%, #e3ecf7 100%)', boxShadow: 3, borderRadius: 3, border: '1px solid #d6e0ef', width: '100%' }}>
                          <Typography variant="h6" color="text.secondary">Reacted To Most</Typography>
                          <Typography variant="h4">{data.reactedToMost.name}</Typography>
                          <Typography variant="body1" color="text.secondary">{data.reactedToMost.count} times</Typography>
                          <Typography variant="h5" sx={{ mt: 1 }}>{data.reactedToMost.emoji}</Typography>
                        </Paper>
                      </Grid>
                    )}
                    {data.receivedMostReactionsFrom && (
                      <Grid item xs={12} md={6} lg={4} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #f4f7fa 70%, #e3ecf7 100%)', boxShadow: 3, borderRadius: 3, border: '1px solid #d6e0ef', width: '100%' }}>
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
                      p: { xs: 2, md: 4 }, 
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
                      <Typography variant="body1" sx={{ fontStyle: 'italic', fontSize: { xs: '0.9rem', md: '1rem' } }}>
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
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No statistics available for the selected user.
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default IndividualStats;