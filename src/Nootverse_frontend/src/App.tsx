import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  CircularProgress,
  Typography,
  Container,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { theme } from './theme/theme';
import { useTheme } from '@mui/material/styles';
import Navigation from './components/Navigation';
import Notes from './pages/Notes';
import About from './pages/About';

const AppContent: React.FC = () => {
  const { loading } = useAuth();
  const muiTheme = useTheme();
  const [currentView, setCurrentView] = useState('notes');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'notes':
        return <Notes />;
      case 'about':
        return <About />;
      default:
        return <Notes />;
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Initializing Nootverse...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView}
        drawerOpen={drawerOpen}
        onDrawerToggle={() => setDrawerOpen(!drawerOpen)}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: drawerOpen ? 'calc(100% - 280px)' : '100%',
          minHeight: '100vh',
          ml: drawerOpen ? '280px' : 0,
          mt: 8, // Account for AppBar height
          transition: muiTheme.transitions.create(['width', 'margin'], {
            easing: muiTheme.transitions.easing.sharp,
            duration: muiTheme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
