import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Box,
  LinearProgress,
  Typography
} from '@mui/material';

interface ProgressDialogProps {
  open: boolean;
  progress: number;
  message: string;
  title?: string;
}

export const ProgressDialog: React.FC<ProgressDialogProps> = ({
  open,
  progress,
  message,
  title = 'Processing Database'
}) => {
  return (
    <Dialog
      open={open}
      aria-labelledby="progress-dialog-title"
      aria-describedby="progress-dialog-description"
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      disablePortal
      onClose={(e: React.SyntheticEvent, reason: 'backdropClick' | 'escapeKeyDown') => {
        // Prevent closing by clicking outside or pressing escape
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          e.preventDefault();
        }
      }}
    >
      <DialogTitle id="progress-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="progress-dialog-description" gutterBottom>
          {message}
        </DialogContentText>
        <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
          <LinearProgress
            variant={progress >= 0 ? 'determinate' : 'indeterminate'}
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              mb: 1,
              transition: 'none' // Remove smooth transitions to prevent visual glitches
            }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 1 }}
          >
            {progress >= 0 ? `${Math.round(progress)}%` : 'Processing...'}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressDialog;
