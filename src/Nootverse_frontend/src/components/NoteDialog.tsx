import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Chip,
  Stack,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Preview as PreviewIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Note } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`note-tabpanel-${index}`}
      aria-labelledby={`note-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface NoteDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (note: Omit<Note, 'id'> & { id?: string }) => Promise<void>;
  note?: Note | null;
  loading?: boolean;
}

const NoteDialog: React.FC<NoteDialogProps> = ({
  open,
  onClose,
  onSave,
  note,
  loading = false,
}) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(note);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
    } else {
      setTitle('');
      setContent('');
      setTags([]);
    }
    setTagInput('');
    setCurrentTab(0);
  }, [note, open]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    try {
      setSaving(true);
      await onSave({
        id: note?.id,
        title: title.trim(),
        content: content.trim(),
        tags: tags,
      });
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '600px',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {isEditing ? 'Edit Note' : 'Create New Note'}
        </Typography>
        <IconButton onClick={handleClose} disabled={saving} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="note editing tabs"
          sx={{ px: 3 }}
        >
          <Tab
            icon={<EditIcon />}
            label="Edit"
            iconPosition="start"
            id="note-tab-0"
            aria-controls="note-tabpanel-0"
          />
          <Tab
            icon={<PreviewIcon />}
            label="Preview"
            iconPosition="start"
            id="note-tab-1"
            aria-controls="note-tabpanel-1"
            disabled={!content.trim()}
          />
        </Tabs>
      </Box>

      <DialogContent sx={{ px: 3, py: 0, minHeight: '400px' }}>
        <TabPanel value={currentTab} index={0}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your note..."
                variant="outlined"
                required
                sx={{ mb: 3 }}
                InputProps={{
                  sx: {
                    fontSize: '1.1rem',
                    fontWeight: 500,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Note Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note here... Markdown is supported!"
                multiline
                rows={12}
                variant="outlined"
                sx={{
                  '& .MuiInputBase-root': {
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    fontSize: '0.95rem',
                  },
                }}
              />

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                💡 Tip: You can use Markdown formatting (e.g., **bold**, *italic*, `code`, etc.)
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
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
                variant="outlined"
                size="small"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={handleAddTag}
                      disabled={!tagInput.trim() || tags.includes(tagInput.trim())}
                      size="small"
                    >
                      <AddIcon />
                    </IconButton>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              
              <AnimatePresence>
                {tags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {tags.map((tag, index) => (
                        <motion.div
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <Chip
                            label={tag}
                            onDelete={() => handleRemoveTag(tag)}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{
                              mb: 1,
                              '& .MuiChip-deleteIcon': {
                                fontSize: '1rem',
                              },
                            }}
                          />
                        </motion.div>
                      ))}
                    </Stack>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </motion.div>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: 'background.default',
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                minHeight: '300px',
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {title || 'Untitled Note'}
              </Typography>
              
              {tags.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                  {tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      color="primary"
                      variant="filled"
                    />
                  ))}
                </Stack>
              )}

              <Divider sx={{ my: 2 }} />

              {content ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
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
                    code: ({ children }) => (
                      <Box
                        component="code"
                        sx={{
                          backgroundColor: 'action.hover',
                          padding: '2px 6px',
                          borderRadius: 1,
                          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                          fontSize: '0.875rem',
                        }}
                      >
                        {children}
                      </Box>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              ) : (
                <Typography color="text.secondary" fontStyle="italic">
                  Nothing to preview yet. Start writing your note!
                </Typography>
              )}
            </Paper>
          </motion.div>
        </TabPanel>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={handleClose} color="inherit" disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!title.trim() || saving}
          startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
          sx={{
            background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
            minWidth: 120,
          }}
        >
          {saving ? 'Saving...' : isEditing ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoteDialog;