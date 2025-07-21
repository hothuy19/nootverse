import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  Stack,
  Divider,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Note } from '../types';

interface NoteViewDialogProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  note: Note | null;
}

const NoteViewDialog: React.FC<NoteViewDialogProps> = ({
  open,
  onClose,
  onEdit,
  onDelete,
  note,
}) => {
  if (!note) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '500px',
          maxHeight: '90vh',
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            pb: 2,
          }}
        >
          <Box sx={{ flexGrow: 1, pr: 2 }}>
            <Typography
              variant="h5"
              component="h2"
              fontWeight="bold"
              sx={{
                wordBreak: 'break-word',
                lineHeight: 1.3,
              }}
            >
              {note.title}
            </Typography>
            
            {note.tags.length > 0 && (
              <Stack 
                direction="row" 
                spacing={1} 
                flexWrap="wrap" 
                useFlexGap
                sx={{ mt: 2 }}
              >
                {note.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    color="primary"
                    variant="filled"
                    sx={{
                      fontSize: '0.8rem',
                    }}
                  />
                ))}
              </Stack>
            )}
          </Box>
          
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent 
          sx={{ 
            px: 0, 
            py: 0, 
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.1)',
              borderRadius: 4,
            },
          }}
        >
          {note.content ? (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                backgroundColor: 'transparent',
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                  marginTop: 2,
                  marginBottom: 1,
                },
                '& p': {
                  marginBottom: 2,
                  lineHeight: 1.7,
                },
                '& ul, & ol': {
                  marginBottom: 2,
                  paddingLeft: 3,
                },
                '& li': {
                  marginBottom: 0.5,
                },
                '& blockquote': {
                  borderLeft: 4,
                  borderLeftColor: 'primary.main',
                  backgroundColor: 'action.hover',
                  margin: 2,
                  padding: 2,
                  fontStyle: 'italic',
                },
                '& pre': {
                  backgroundColor: 'action.hover',
                  padding: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  marginBottom: 2,
                },
                '& code': {
                  backgroundColor: 'action.hover',
                  padding: '2px 6px',
                  borderRadius: 1,
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  fontSize: '0.875rem',
                },
                '& pre code': {
                  backgroundColor: 'transparent',
                  padding: 0,
                },
                '& table': {
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginBottom: 2,
                },
                '& th, & td': {
                  border: 1,
                  borderColor: 'divider',
                  padding: 1,
                  textAlign: 'left',
                },
                '& th': {
                  backgroundColor: 'action.hover',
                  fontWeight: 'bold',
                },
                '& hr': {
                  border: 'none',
                  borderTop: 1,
                  borderColor: 'divider',
                  margin: 3,
                },
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                      {children}
                    </Typography>
                  ),
                  h2: ({ children }) => (
                    <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
                      {children}
                    </Typography>
                  ),
                  h3: ({ children }) => (
                    <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                      {children}
                    </Typography>
                  ),
                  h4: ({ children }) => (
                    <Typography variant="h6" component="h4" gutterBottom fontWeight="bold">
                      {children}
                    </Typography>
                  ),
                  h5: ({ children }) => (
                    <Typography variant="subtitle1" component="h5" gutterBottom fontWeight="bold">
                      {children}
                    </Typography>
                  ),
                  h6: ({ children }) => (
                    <Typography variant="subtitle2" component="h6" gutterBottom fontWeight="bold">
                      {children}
                    </Typography>
                  ),
                  p: ({ children }) => (
                    <Typography variant="body1" paragraph>
                      {children}
                    </Typography>
                  ),
                  strong: ({ children }) => (
                    <Typography component="strong" fontWeight="bold">
                      {children}
                    </Typography>
                  ),
                  em: ({ children }) => (
                    <Typography component="em" fontStyle="italic">
                      {children}
                    </Typography>
                  ),
                }}
              >
                {note.content}
              </ReactMarkdown>
            </Paper>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 200,
                color: 'text.secondary',
                fontStyle: 'italic',
                p: 4,
              }}
            >
              <Typography>This note is empty.</Typography>
            </Box>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={onClose} color="inherit">
            Close
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            onClick={onEdit}
            variant="outlined"
            startIcon={<EditIcon />}
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
              },
            }}
          >
            Edit
          </Button>
          <Button
            onClick={onDelete}
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{
              '&:hover': {
                backgroundColor: 'error.main',
                color: 'error.contrastText',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  );
};

export default NoteViewDialog;