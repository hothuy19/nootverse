import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Fab,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Paper,
  Tooltip,
  Zoom,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  StickyNote2 as NoteIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../contexts/AuthContext';
import { Nootverse_backend } from '../../../declarations/Nootverse_backend';
import { Note } from '../types';
import NoteDialog from '../components/NoteDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import NoteViewDialog from '../components/NoteViewDialog';

const Notes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteViewOpen, setNoteViewOpen] = useState(false);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [viewingIndex, setViewingIndex] = useState<number | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    noteId: string;
    noteIndex: number;
    noteTitle: string;
  }>({
    open: false,
    noteId: '',
    noteIndex: -1,
    noteTitle: '',
  });

  // Generate unique ID for new notes
  const generateId = () => crypto.randomUUID();

  // Filter notes based on search query
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    
    return notes.filter((note) => {
      const query = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    });
  }, [notes, searchQuery]);

  const loadNotes = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const userNotes = await Nootverse_backend.getAllOwnedNotes();
      setNotes(userNotes);
    } catch (err) {
      console.error('Error loading notes:', err);
      setError('Failed to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [isAuthenticated]);

  const handleCreateNote = () => {
    setEditingNote(null);
    setEditingIndex(null);
    setNoteDialogOpen(true);
  };

  const handleViewNote = (note: Note, index: number) => {
    setViewingNote(note);
    setViewingIndex(index);
    setNoteViewOpen(true);
  };

  const handleEditNote = (note: Note, index: number) => {
    setEditingNote(note);
    setEditingIndex(index);
    setNoteDialogOpen(true);
    // Close view dialog if it's open
    setNoteViewOpen(false);
  };

  const handleEditFromView = () => {
    if (viewingNote && viewingIndex !== null) {
      handleEditNote(viewingNote, viewingIndex);
    }
  };

  const handleDeleteFromView = () => {
    if (viewingNote && viewingIndex !== null) {
      handleDeleteNote(viewingNote.id, viewingIndex, viewingNote.title);
      setNoteViewOpen(false);
    }
  };

  const handleSaveNote = async (noteData: Omit<Note, 'id'> & { id?: string }) => {
    try {
      setError(null);

      if (editingNote && editingIndex !== null) {
        // Update existing note
        await Nootverse_backend.updateNote(
          BigInt(editingIndex),
          editingNote.id,
          noteData.title,
          noteData.content,
          noteData.tags
        );
        
        // Update local state
        setNotes(prevNotes =>
          prevNotes.map((note, index) =>
            index === editingIndex 
              ? { 
                  ...note, 
                  title: noteData.title,
                  content: noteData.content,
                  tags: noteData.tags 
                } 
              : note
          )
        );
      } else {
        // Create new note
        const newId = generateId();
        await Nootverse_backend.addNote(
          newId,
          noteData.title,
          noteData.content,
          noteData.tags
        );
        
        // Add to local state
        const newNote: Note = { 
          id: newId, 
          title: noteData.title,
          content: noteData.content,
          tags: noteData.tags 
        };
        setNotes(prevNotes => [...prevNotes, newNote]);
      }
    } catch (err) {
      console.error('Error saving note:', err);
      setError('Failed to save note. Please try again.');
      throw err; // Re-throw to let the dialog handle it
    }
  };

  const handleDeleteNote = (noteId: string, noteIndex: number, noteTitle: string) => {
    setConfirmDialog({
      open: true,
      noteId,
      noteIndex,
      noteTitle,
    });
  };

  const confirmDeleteNote = async () => {
    try {
      setError(null);
      
      await Nootverse_backend.deleteNote(BigInt(confirmDialog.noteIndex));
      
      // Remove from local state
      setNotes(prevNotes => prevNotes.filter((_, i) => i !== confirmDialog.noteIndex));
      
      setConfirmDialog({ open: false, noteId: '', noteIndex: -1, noteTitle: '' });
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Failed to delete note. Please try again.');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    const plainText = content.replace(/[#*`_~]/g, ''); // Remove basic markdown symbols
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  const renderMarkdownPreview = (content: string, maxLines: number = 4) => {
    // Truncate content to avoid performance issues with very long notes
    const truncatedContent = content.length > 500 ? content.substring(0, 500) + '...' : content;
    
    return (
      <Box
        sx={{
          display: '-webkit-box',
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.4,
          '& p': {
            margin: 0,
            marginBottom: 0.5,
          },
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            margin: 0,
            marginBottom: 0.5,
            fontSize: 'inherit',
            fontWeight: 600,
          },
          '& ul, & ol': {
            margin: 0,
            paddingLeft: 2,
          },
          '& li': {
            margin: 0,
          },
          '& code': {
            backgroundColor: 'action.hover',
            padding: '1px 4px',
            borderRadius: 0.5,
            fontSize: '0.8em',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          },
          '& blockquote': {
            margin: 0,
            paddingLeft: 1,
            borderLeft: 2,
            borderLeftColor: 'primary.main',
            fontStyle: 'italic',
          },
          '& strong': {
            fontWeight: 600,
          },
          '& em': {
            fontStyle: 'italic',
          },
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Simplify headers for preview
            h1: ({ children }) => <span style={{ fontWeight: 600 }}>{children}</span>,
            h2: ({ children }) => <span style={{ fontWeight: 600 }}>{children}</span>,
            h3: ({ children }) => <span style={{ fontWeight: 600 }}>{children}</span>,
            h4: ({ children }) => <span style={{ fontWeight: 600 }}>{children}</span>,
            h5: ({ children }) => <span style={{ fontWeight: 600 }}>{children}</span>,
            h6: ({ children }) => <span style={{ fontWeight: 600 }}>{children}</span>,
          }}
        >
          {truncatedContent}
        </ReactMarkdown>
      </Box>
    );
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box textAlign="center">
          <NoteIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Welcome to Nootverse
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please log in with Internet Identity to start taking notes
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
          }}
        >
          📝 My Notes
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          textAlign="center"
          gutterBottom
        >
          Your notes, your control
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box mb={4}>
        <Paper
          elevation={0}
          sx={{
            maxWidth: 600,
            mx: 'auto',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <TextField
            fullWidth
            placeholder="Search notes by title, content, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={clearSearch} edge="end" size="small">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
              },
            }}
          />
        </Paper>
      </Box>

      {/* Search Results Info */}
      {searchQuery && (
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {filteredNotes.length === 0 
              ? 'No notes found' 
              : `Found ${filteredNotes.length} note${filteredNotes.length === 1 ? '' : 's'}`
            } for "{searchQuery}"
          </Typography>
        </Box>
      )}

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, maxWidth: 600, mx: 'auto' }} 
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && notes.length === 0 ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress size={48} />
        </Box>
      ) : (
        <>
          {/* Notes Grid */}
          <Grid container spacing={3}>
            <AnimatePresence>
              {filteredNotes.map((note, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={note.id}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card
                      sx={{
                        height: '280px',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: (theme) => theme.shadows[8],
                          '& .note-actions': {
                            opacity: 1,
                          },
                        },
                      }}
                      onClick={() => handleViewNote(note, index)}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 2.5, pb: 1 }}>
                        <Typography
                          variant="h6"
                          component="h3"
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.3,
                            mb: 1.5,
                          }}
                        >
                          {note.title}
                        </Typography>

                        {note.tags.length > 0 && (
                          <Stack 
                            direction="row" 
                            spacing={0.5} 
                            flexWrap="wrap" 
                            useFlexGap
                            sx={{ mb: 1.5 }}
                          >
                            {note.tags.slice(0, 3).map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                variant="outlined"
                                color="primary"
                                sx={{ 
                                  fontSize: '0.75rem',
                                  height: 22,
                                }}
                              />
                            ))}
                            {note.tags.length > 3 && (
                              <Chip
                                label={`+${note.tags.length - 3}`}
                                size="small"
                                variant="outlined"
                                color="default"
                                sx={{ 
                                  fontSize: '0.75rem',
                                  height: 22,
                                }}
                              />
                            )}
                          </Stack>
                        )}

                        <Box
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.875rem',
                          }}
                        >
                          {note.content ? renderMarkdownPreview(note.content) : (
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              fontStyle="italic"
                            >
                              No content
                            </Typography>
                          )}
                        </Box>
                      </CardContent>

                      <CardActions
                        className="note-actions"
                        sx={{
                          p: 1.5,
                          pt: 0,
                          opacity: 0.7,
                          transition: 'opacity 0.2s',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Tooltip title="Edit Note" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditNote(note, index);
                            }}
                            sx={{
                              color: 'primary.main',
                              '&:hover': {
                                backgroundColor: 'primary.light',
                                color: 'primary.contrastText',
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Note" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNote(note.id, index, note.title);
                            }}
                            sx={{
                              color: 'error.main',
                              '&:hover': {
                                backgroundColor: 'error.light',
                                color: 'error.contrastText',
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>

          {/* Empty State */}
          {filteredNotes.length === 0 && !loading && (
            <Box textAlign="center" py={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <NoteIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {searchQuery ? 'No notes found' : 'No notes yet'}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  {searchQuery 
                    ? 'Try a different search term or create a new note'
                    : 'Click the + button to create your first note'
                  }
                </Typography>
              </motion.div>
            </Box>
          )}
        </>
      )}

      {/* Add Note FAB */}
      <Zoom in={isAuthenticated}>
        <Fab
          color="primary"
          aria-label="add note"
          onClick={handleCreateNote}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #5855eb 30%, #7c3aed 90%)',
            },
          }}
        >
          <AddIcon />
        </Fab>
      </Zoom>

      {/* Note View Dialog */}
      <NoteViewDialog
        open={noteViewOpen}
        onClose={() => setNoteViewOpen(false)}
        onEdit={handleEditFromView}
        onDelete={handleDeleteFromView}
        note={viewingNote}
      />

      {/* Note Edit Dialog */}
      <NoteDialog
        open={noteDialogOpen}
        onClose={() => setNoteDialogOpen(false)}
        onSave={handleSaveNote}
        note={editingNote}
        loading={loading}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, noteId: '', noteIndex: -1, noteTitle: '' })}
        onConfirm={confirmDeleteNote}
        title="Delete Note"
        message={`Are you sure you want to delete "${confirmDialog.noteTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </Container>
  );
};

export default Notes;