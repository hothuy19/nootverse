import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Explore as ExploreIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import AuthButton from './AuthButton';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  drawerOpen: boolean;
  onDrawerToggle: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, drawerOpen, onDrawerToggle }) => {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navigationItems = [
    { id: 'notes', label: 'My Notes', icon: DashboardIcon, public: false },
    { id: 'about', label: 'About', icon: InfoIcon, public: true },
  ];

  const handleNavigation = (view: string) => {
    onViewChange(view);
    if (isMobile) {
      onDrawerToggle();
    }
  };

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
          }}
        >
          📝 Nootverse
        </Typography>
      </Box>
      
      <Divider />
      
      <List sx={{ px: 2, py: 1 }}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isAccessible = item.public || isAuthenticated;
          const isActive = currentView === item.id;
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: navigationItems.indexOf(item) * 0.1 }}
            >
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.id)}
                  disabled={!isAccessible}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    transition: 'all 0.3s ease',
                    ...(isActive && {
                      background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.1) 30%, rgba(139, 92, 246, 0.1) 90%)',
                      borderLeft: '4px solid',
                      borderLeftColor: 'primary.main',
                      '&:hover': {
                        background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.15) 30%, rgba(139, 92, 246, 0.15) 90%)',
                      },
                    }),
                    '&:hover': {
                      background: 'rgba(99, 102, 241, 0.05)',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Icon
                      sx={{
                        color: isActive ? 'primary.main' : 'text.secondary',
                        transition: 'color 0.3s ease',
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'primary.main' : 'text.primary',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </motion.div>
          );
        })}
      </List>
      
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: 'rgba(15, 15, 35, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              display: { xs: 'none', md: 'block' },
              background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            📝 Nootverse
          </Typography>
          
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              📝 Nootverse
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <AuthButton />
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{
          width: drawerOpen ? 280 : 0,
          flexShrink: 0,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={onDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 280,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          <Toolbar />
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Navigation;