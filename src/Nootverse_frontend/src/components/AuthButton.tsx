import React from 'react';
import {
  Button,
  CircularProgress,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Login as LoginIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const AuthButton: React.FC = () => {
  const { isAuthenticated, login, logout, loading, principal } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <CircularProgress size={24} />
        <Typography variant="body2" color="text.secondary">
          Initializing...
        </Typography>
      </Box>
    );
  }

  if (isAuthenticated && principal) {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Chip
            icon={<PersonIcon />}
            label={`${principal.substring(0, 8)}...${principal.substring(principal.length - 4)}`}
            variant="outlined"
            sx={{
              background: 'rgba(99, 102, 241, 0.1)',
              borderColor: 'rgba(99, 102, 241, 0.3)',
              color: 'primary.main',
              '&:hover': {
                background: 'rgba(99, 102, 241, 0.2)',
              },
            }}
          />
        </motion.div>
        
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{ ml: 1 }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              <AccountIcon />
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Signed in as
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                maxWidth: 200,
              }}
            >
              {principal}
            </Typography>
          </Box>
          
          <Divider />
          
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} />
            Sign out
          </MenuItem>
        </Menu>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button
        onClick={login}
        variant="contained"
        startIcon={<LoginIcon />}
        sx={{
          background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
          borderRadius: 3,
          px: 3,
          py: 1,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #4f46e5 30%, #7c3aed 90%)',
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        Sign in with Internet Identity
      </Button>
    </motion.div>
  );
};

export default AuthButton;