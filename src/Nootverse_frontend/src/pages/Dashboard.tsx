import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Chip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { UniverseUI, UniverseInput } from '../types';
import { createAuthenticatedService } from '../utils/backend';
import UniverseCard from '../components/UniverseCard';

interface DashboardProps {
  onUniverseView: (universe: UniverseUI) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onUniverseView }) => {
  const { isAuthenticated, identity } = useAuth();
  const [universes, setUniverses] = useState<UniverseUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUniverse, setSelectedUniverse] = useState<UniverseUI | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<UniverseInput>({
    title: '',
    description: '',
    content: '',
    isPublic: false,
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadUniverses = async () => {
    if (!identity) return;
    
    try {
      setLoading(true);
      const service = createAuthenticatedService(identity);
      const userUniverses = await service.getMyUniverses();
      setUniverses(userUniverses);
      setError(null);
    } catch (err) {
      console.error('Error loading universes:', err);
      setError('Failed to load universes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && identity) {
      loadUniverses();
    }
  }, [isAuthenticated, identity]);

  const handleCreateUniverse = async () => {
    if (!identity) return;
    
    try {
      setSubmitting(true);
      const service = createAuthenticatedService(identity);
      await service.createUniverse(formData);
      setCreateDialogOpen(false);
      resetForm();
      loadUniverses();
    } catch (err) {
      console.error('Error creating universe:', err);
      setError('Failed to create universe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditUniverse = async () => {
    if (!identity || editIndex === null) return;
    
    try {
      setSubmitting(true);
      const service = createAuthenticatedService(identity);
      await service.updateUniverse(editIndex, formData);
      setEditDialogOpen(false);
      resetForm();
      loadUniverses();
    } catch (err) {
      console.error('Error updating universe:', err);
      setError('Failed to update universe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUniverse = async (index: number) => {
    if (!identity) return;
    
    if (window.confirm('Are you sure you want to delete this universe?')) {
      try {
        const service = createAuthenticatedService(identity);
        await service.deleteUniverse(index);
        loadUniverses();
      } catch (err) {
        console.error('Error deleting universe:', err);
        setError('Failed to delete universe. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      isPublic: false,
      tags: [],
    });
    setTagInput('');
    setSelectedUniverse(null);
    setEditIndex(null);
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

  const openEditDialog = (universe: UniverseUI, index: number) => {
    setFormData({
      title: universe.title,
      description: universe.description,
      content: universe.content,
      isPublic: universe.isPublic,
      tags: universe.tags,
    });
    setEditIndex(index);
    setEditDialogOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="info">
          Please sign in with Internet Identity to access your dashboard.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            My Universes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage your personal universes
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            {universes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  minHeight="400px"
                  textAlign="center"
                >
                  <Typography variant="h5" color="text.secondary" gutterBottom>
                    No universes yet
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mb={3}>
                    Create your first universe to get started
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    Create Universe
                  </Button>
                </Box>
              </motion.div>
            ) : (
              <Grid container spacing={3}>
                {universes.map((universe, index) => (
                  <Grid item xs={12} md={6} lg={4} key={universe.id}>
                    <UniverseCard
                      universe={universe}
                      index={index}
                      onView={onUniverseView}
                      onEdit={(universe) => openEditDialog(universe, index)}
                      onDelete={() => handleDeleteUniverse(index)}
                      showActions={true}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={() => setCreateDialogOpen(true)}
        >
          <AddIcon />
        </Fab>
      </motion.div>

      {/* Create Universe Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Universe</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={5}
            variant="outlined"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Add Tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              fullWidth
              variant="outlined"
              placeholder="Press Enter to add tag"
            />
            <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
              {formData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  size="small"
                />
              ))}
            </Stack>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              />
            }
            label="Make this universe public"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateUniverse} 
            variant="contained"
            disabled={submitting || !formData.title.trim()}
          >
            {submitting ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Universe Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Universe</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={5}
            variant="outlined"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Add Tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              fullWidth
              variant="outlined"
              placeholder="Press Enter to add tag"
            />
            <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
              {formData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  size="small"
                />
              ))}
            </Stack>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              />
            }
            label="Make this universe public"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleEditUniverse} 
            variant="contained"
            disabled={submitting || !formData.title.trim()}
          >
            {submitting ? <CircularProgress size={24} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;