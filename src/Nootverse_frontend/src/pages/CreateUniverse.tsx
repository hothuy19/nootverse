import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Save as SaveIcon,
  Preview as PreviewIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';
import { UniverseInput } from '../types';
import { createAuthenticatedService } from '../utils/backend';

interface CreateUniverseProps {
  onUniverseCreated: () => void;
}

const CreateUniverse: React.FC<CreateUniverseProps> = ({ onUniverseCreated }) => {
  const { isAuthenticated, identity } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<UniverseInput>({
    title: '',
    description: '',
    content: '',
    isPublic: false,
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const steps = ['Basic Info', 'Content', 'Settings & Tags'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    if (!identity) {
      setError('Please sign in to create a universe');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please provide a title for your universe');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const service = createAuthenticatedService(identity);
      await service.createUniverse(formData);
      
      setSuccess(true);
      setTimeout(() => {
        onUniverseCreated();
      }, 2000);
    } catch (err) {
      console.error('Error creating universe:', err);
      setError('Failed to create universe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="info">
          Please sign in with Internet Identity to create a universe.
        </Alert>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box textAlign="center">
            <Typography variant="h3" component="h1" gutterBottom color="success.main">
              🎉 Universe Created Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Your universe has been created and is now available.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Redirecting to your dashboard...
            </Typography>
          </Box>
        </motion.div>
      </Container>
    );
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <TextField
              fullWidth
              label="Universe Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter a compelling title for your universe"
              sx={{ mb: 3 }}
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide a brief description of your universe"
              multiline
              rows={4}
              sx={{ mb: 3 }}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Universe Content
            </Typography>
            <TextField
              fullWidth
              label="Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your universe content here. You can use Markdown formatting."
              multiline
              rows={10}
              sx={{ mb: 3 }}
            />
            {formData.content && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Preview
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                  <ReactMarkdown>{formData.content}</ReactMarkdown>
                </Paper>
              </Box>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Settings & Tags
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                />
              }
              label="Make this universe public"
              sx={{ mb: 3 }}
            />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Tags
              </Typography>
              <TextField
                fullWidth
                label="Add Tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Press Enter to add tag"
                InputProps={{
                  endAdornment: (
                    <Button
                      onClick={handleAddTag}
                      disabled={!tagInput.trim()}
                      startIcon={<AddIcon />}
                    >
                      Add
                    </Button>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom textAlign="center">
          Create New Universe
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
          Bring your creative vision to life in the Nootverse
        </Typography>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={submitting || !formData.title.trim()}
                  startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                  {submitting ? 'Creating...' : 'Create Universe'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={activeStep === 0 && !formData.title.trim()}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default CreateUniverse;