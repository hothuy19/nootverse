import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'warning' | 'danger' | 'info' | 'success';
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  loading = false,
}) => {
  const getVariantConfig = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <DeleteIcon sx={{ fontSize: 32 }} />,
          color: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          confirmButtonColor: 'error' as const,
        };
      case 'warning':
        return {
          icon: <WarningIcon sx={{ fontSize: 32 }} />,
          color: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          confirmButtonColor: 'warning' as const,
        };
      case 'info':
        return {
          icon: <InfoIcon sx={{ fontSize: 32 }} />,
          color: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          confirmButtonColor: 'primary' as const,
        };
      case 'success':
        return {
          icon: <SuccessIcon sx={{ fontSize: 32 }} />,
          color: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          confirmButtonColor: 'success' as const,
        };
      default:
        return {
          icon: <WarningIcon sx={{ fontSize: 32 }} />,
          color: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          confirmButtonColor: 'warning' as const,
        };
    }
  };

  const config = getVariantConfig();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxWidth: 480,
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            pb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                backgroundColor: config.backgroundColor,
                color: config.color,
                width: 56,
                height: 56,
              }}
            >
              {config.icon}
            </Avatar>
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
          </Box>
          <IconButton onClick={onClose} disabled={loading} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 0, pb: 3 }}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              lineHeight: 1.6,
              ml: 9, // Align with the title text
            }}
          >
            {message}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
          <Button
            onClick={onClose}
            disabled={loading}
            color="inherit"
            sx={{ minWidth: 80 }}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            variant="contained"
            color={config.confirmButtonColor}
            sx={{
              minWidth: 100,
              ...(variant === 'danger' && {
                '&:hover': {
                  backgroundColor: '#dc2626',
                },
              }),
            }}
          >
            {loading ? 'Please wait...' : confirmText}
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  );
};

export default ConfirmDialog;