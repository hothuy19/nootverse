import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Avatar,
  Chip,
  Stack,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Rocket as RocketIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Public as PublicIcon,
  Create as CreateIcon,
  Groups as CommunityIcon,
  GitHub as GitHubIcon,
  Link as LinkIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  const features = [
    {
      icon: CreateIcon,
      title: 'Simple Note Taking',
      description: 'Create, edit, and organize your personal notes with a clean, intuitive interface.',
    },
    {
      icon: SecurityIcon,
      title: 'Secure & Private',
      description: 'Your notes are secured on the Internet Computer blockchain with Internet Identity authentication.',
    },
    {
      icon: SpeedIcon,
      title: 'Lightning Fast',
      description: 'Built on the Internet Computer for instant loading and real-time note synchronization.',
    },
    {
      icon: PublicIcon,
      title: 'True Ownership',
      description: 'Your notes belong to you forever, stored permanently on the decentralized web.',
    },
  ];

  const techStack = [
    'Internet Computer Protocol (ICP)',
    'Motoko Programming Language',
    'Internet Identity Authentication',
    'React 18 & TypeScript',
    'Material-UI (MUI) v5',
    'Framer Motion Animations',
    'Vite Build System',
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <Box textAlign="center" mb={6}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              mx: 'auto',
              mb: 3,
              background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
              fontSize: '3rem',
            }}
          >
            📝
          </Avatar>
          
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            About Nootverse
          </Typography>
          
          <Typography variant="h5" color="text.secondary" mb={4} sx={{ maxWidth: 800, mx: 'auto' }}>
            Your notes, your control. Take control of your notes in the decentralized web.
          </Typography>
          
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
            <Chip
              icon={<RocketIcon />}
              label="Built on Internet Computer"
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<SecurityIcon />}
              label="Secure & Decentralized"
              color="success"
              variant="outlined"
            />
            <Chip
              icon={<PublicIcon />}
              label="Privacy First"
              color="info"
              variant="outlined"
            />
          </Stack>
        </Box>

        {/* Mission Statement */}
        <Paper sx={{ p: 4, mb: 6, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Our Mission
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.2rem', lineHeight: 1.6, maxWidth: 800, mx: 'auto' }}>
            Nootverse is a decentralized note-taking application that puts you in complete control of your data. 
            We believe in true ownership and privacy, ensuring your notes are stored securely on the blockchain 
            while providing a seamless, intuitive experience.
          </Typography>
        </Paper>

        {/* Features */}
        <Box mb={6}>
          <Typography variant="h4" textAlign="center" gutterBottom mb={4}>
            Why Choose Nootverse?
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Grid item xs={12} md={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card sx={{ height: '100%' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            mb: 2,
                            background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
                          }}
                        >
                          <Icon sx={{ fontSize: 28 }} />
                        </Avatar>
                        <Typography variant="h6" gutterBottom>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Technology Stack */}
        <Grid container spacing={4} mb={6}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Technology Stack
              </Typography>
              <List>
                {techStack.map((tech, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemIcon>
                      <CheckIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={tech} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Key Benefits
              </Typography>
              <List>
                <ListItem disablePadding>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="True Ownership" 
                    secondary="Your content, your rules - stored on blockchain"
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="No Central Authority" 
                    secondary="Decentralized platform with no single point of failure"
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Global Accessibility" 
                    secondary="Access your universes from anywhere in the world"
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Privacy First" 
                    secondary="Internet Identity ensures your privacy is protected"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* How It Works */}
        <Paper sx={{ p: 4, mb: 6 }}>
          <Typography variant="h4" textAlign="center" gutterBottom>
            How Nootverse Works
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 2,
                    background: 'linear-gradient(45deg, #059669 30%, #10b981 90%)',
                    fontSize: '2rem',
                  }}
                >
                  1️⃣
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Sign In Securely
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Use Internet Identity for secure, passwordless authentication
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 2,
                    background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
                    fontSize: '2rem',
                  }}
                >
                  2️⃣
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Create Universes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Build rich content with our intuitive editor and markdown support
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 2,
                    background: 'linear-gradient(45deg, #dc2626 30%, #ef4444 90%)',
                    fontSize: '2rem',
                  }}
                >
                  3️⃣
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Share & Explore
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Publish your universes and discover amazing content from others
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Footer */}
        <Box textAlign="center">
          <Typography variant="h5" gutterBottom>
            Ready to Start Creating?
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Join our community of creators and start building your first universe today!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Built with ❤️ on the Internet Computer • Powered by Motoko • Made for Creators
          </Typography>
        </Box>
      </motion.div>
    </Container>
  );
};

export default About;