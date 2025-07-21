import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Chip,
  Stack,
  Button,
  Avatar,
  Divider,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Public as PublicIcon,
  Lock as PrivateIcon,
  Share as ShareIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { UniverseUI } from '../types';
import { format } from 'date-fns';

interface UniverseDetailProps {
  universe: UniverseUI;
  onBack: () => void;
}

const UniverseDetail: React.FC<UniverseDetailProps> = ({ universe, onBack }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: universe.title,
        text: universe.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  const getUniverseColor = () => {
    // Generate a color based on the universe ID
    const colors = [
      { primary: '#6366f1', secondary: '#8b5cf6' },
      { primary: '#059669', secondary: '#10b981' },
      { primary: '#dc2626', secondary: '#ef4444' },
      { primary: '#d97706', secondary: '#f59e0b' },
      { primary: '#7c3aed', secondary: '#8b5cf6' },
      { primary: '#2563eb', secondary: '#3b82f6' },
    ];
    const hash = universe.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const universeColor = getUniverseColor();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Universe Details
          </Typography>
          <Button
            startIcon={<ShareIcon />}
            onClick={handleShare}
            variant="outlined"
          >
            Share
          </Button>
        </Box>

        {/* Universe Card */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            background: `linear-gradient(135deg, ${universeColor.primary}15 0%, ${universeColor.secondary}15 100%)`,
            border: `1px solid ${universeColor.primary}30`,
          }}
        >
          {/* Title and Status */}
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                mr: 2,
                background: `linear-gradient(45deg, ${universeColor.primary}, ${universeColor.secondary})`,
                fontSize: '1.5rem',
              }}
            >
              🌌
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                {universe.title}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                {universe.isPublic ? (
                  <Chip
                    icon={<PublicIcon />}
                    label="Public"
                    color="success"
                    size="small"
                  />
                ) : (
                  <Chip
                    icon={<PrivateIcon />}
                    label="Private"
                    color="warning"
                    size="small"
                  />
                )}
                <Chip
                  icon={<ScheduleIcon />}
                  label={`Updated ${format(universe.updatedAt, 'MMM d, yyyy')}`}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
          </Box>

          {/* Description */}
          <Typography variant="body1" color="text.secondary" mb={3}>
            {universe.description}
          </Typography>

          {/* Tags */}
          {universe.tags.length > 0 && (
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Tags
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {universe.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    sx={{
                      background: `${universeColor.primary}20`,
                      color: universeColor.primary,
                      fontWeight: 500,
                      mb: 1,
                      '&:hover': {
                        background: `${universeColor.primary}30`,
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Content */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Content
            </Typography>
            <Paper
              sx={{
                p: 3,
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {universe.content ? (
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <Typography variant="h4" component="h1" gutterBottom>
                        {children}
                      </Typography>
                    ),
                    h2: ({ children }) => (
                      <Typography variant="h5" component="h2" gutterBottom>
                        {children}
                      </Typography>
                    ),
                    h3: ({ children }) => (
                      <Typography variant="h6" component="h3" gutterBottom>
                        {children}
                      </Typography>
                    ),
                    p: ({ children }) => (
                      <Typography variant="body1" paragraph>
                        {children}
                      </Typography>
                    ),
                    ul: ({ children }) => (
                      <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                        {children}
                      </Box>
                    ),
                    ol: ({ children }) => (
                      <Box component="ol" sx={{ pl: 3, mb: 2 }}>
                        {children}
                      </Box>
                    ),
                    li: ({ children }) => (
                      <Typography component="li" variant="body1">
                        {children}
                      </Typography>
                    ),
                    blockquote: ({ children }) => (
                      <Paper
                        sx={{
                          p: 2,
                          my: 2,
                          bgcolor: 'action.hover',
                          borderLeft: '4px solid',
                          borderLeftColor: 'primary.main',
                        }}
                      >
                        {children}
                      </Paper>
                    ),
                    code: ({ children }) => (
                      <Typography
                        component="code"
                        sx={{
                          bgcolor: 'action.hover',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                        }}
                      >
                        {children}
                      </Typography>
                    ),
                    pre: ({ children }) => (
                      <Paper
                        sx={{
                          p: 2,
                          my: 2,
                          bgcolor: 'action.hover',
                          overflow: 'auto',
                        }}
                      >
                        <Typography
                          component="pre"
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            m: 0,
                          }}
                        >
                          {children}
                        </Typography>
                      </Paper>
                    ),
                  }}
                >
                  {universe.content}
                </ReactMarkdown>
              ) : (
                <Typography variant="body2" color="text.secondary" style={{ fontStyle: 'italic' }}>
                  No content available for this universe.
                </Typography>
              )}
            </Paper>
          </Box>
        </Paper>

        {/* Metadata */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Universe Information
          </Typography>
          <Stack spacing={2}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Universe ID:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  bgcolor: 'action.hover',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                }}
              >
                {universe.id}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Created:
              </Typography>
              <Typography variant="body2">
                {format(universe.createdAt, 'MMM d, yyyy \'at\' h:mm a')}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Last Updated:
              </Typography>
              <Typography variant="body2">
                {format(universe.updatedAt, 'MMM d, yyyy \'at\' h:mm a')}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Visibility:
              </Typography>
              <Chip
                label={universe.isPublic ? 'Public' : 'Private'}
                color={universe.isPublic ? 'success' : 'warning'}
                size="small"
              />
            </Box>
          </Stack>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default UniverseDetail;