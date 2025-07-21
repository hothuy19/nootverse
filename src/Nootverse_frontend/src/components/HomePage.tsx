import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  useTheme,
} from '@mui/material';
import {
  Explore as ExploreIcon,
  Create as CreateIcon,
  Public as PublicIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Groups as CommunityIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface HomePageProps {
  onNavigate: (view: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();

  const features = [
    {
      icon: CreateIcon,
      title: 'Create Universes',
      description: 'Build and share your own creative universes with rich content and interactive elements.',
      color: '#6366f1',
    },
    {
      icon: ExploreIcon,
      title: 'Explore Worlds',
      description: 'Discover amazing universes created by the community and get inspired.',
      color: '#8b5cf6',
    },
    {
      icon: PublicIcon,
      title: 'Share & Collaborate',
      description: 'Make your universes public and collaborate with others in the community.',
      color: '#10b981',
    },
    {
      icon: SecurityIcon,
      title: 'Secure & Private',
      description: 'Your data is secured on the Internet Computer blockchain with Internet Identity.',
      color: '#ef4444',
    },
    {
      icon: SpeedIcon,
      title: 'Fast & Reliable',
      description: 'Built on the Internet Computer for lightning-fast performance and reliability.',
      color: '#f59e0b',
    },
    {
      icon: CommunityIcon,
      title: 'Community Driven',
      description: 'Join a thriving community of creators and explorers in the Nootverse.',
      color: '#3b82f6',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)' }}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box textAlign="center" mb={8}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 700,
                  mb: 2,
                  background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                🌌 Welcome to Nootverse
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  mb: 4,
                  color: 'text.secondary',
                  fontWeight: 400,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  maxWidth: 800,
                  mx: 'auto',
                }}
              >
                Create, explore, and share your own universes in a decentralized creative platform
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => onNavigate('explore')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
                    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #4f46e5 30%, #7c3aed 90%)',
                      boxShadow: '0 6px 24px rgba(99, 102, 241, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <ExploreIcon sx={{ mr: 1 }} />
                  Explore Universes
                </Button>
                
                {isAuthenticated ? (
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => onNavigate('create')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.main',
                        background: 'rgba(99, 102, 241, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <CreateIcon sx={{ mr: 1 }} />
                    Create Universe
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => onNavigate('dashboard')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.main',
                        background: 'rgba(99, 102, 241, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Get Started
                  </Button>
                )}
              </Stack>
            </motion.div>
          </Box>
        </motion.div>

        {/* Features Section */}
        <Box mb={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Typography
              variant="h3"
              component="h3"
              textAlign="center"
              sx={{
                mb: 6,
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              Why Choose Nootverse?
            </Typography>
          </motion.div>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                    whileHover={{ y: -8 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        background: `linear-gradient(135deg, ${feature.color}15 0%, ${feature.color}08 100%)`,
                        border: `1px solid ${feature.color}30`,
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: `0 8px 32px ${feature.color}20`,
                          border: `1px solid ${feature.color}50`,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            mb: 3,
                            background: `linear-gradient(45deg, ${feature.color}, ${feature.color}cc)`,
                          }}
                        >
                          <Icon sx={{ fontSize: 28 }} />
                        </Avatar>
                        
                        <Typography
                          variant="h6"
                          component="h4"
                          sx={{
                            mb: 2,
                            fontWeight: 600,
                            color: 'text.primary',
                          }}
                        >
                          {feature.title}
                        </Typography>
                        
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.6 }}
                        >
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

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          <Box
            textAlign="center"
            sx={{
              py: 8,
              px: 4,
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              borderRadius: 4,
              border: '1px solid rgba(99, 102, 241, 0.2)',
            }}
          >
            <Typography
              variant="h4"
              component="h3"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              Ready to Start Your Journey?
            </Typography>
            
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
            >
              Join thousands of creators who are already building amazing universes in Nootverse. 
              Start creating, exploring, and sharing today!
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              onClick={() => onNavigate('explore')}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4f46e5 30%, #7c3aed 90%)',
                  boxShadow: '0 6px 24px rgba(99, 102, 241, 0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Get Started Now
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HomePage;