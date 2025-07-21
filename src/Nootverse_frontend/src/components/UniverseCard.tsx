import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Public as PublicIcon,
  Lock as PrivateIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Share as ShareIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { UniverseUI } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface UniverseCardProps {
  universe: UniverseUI;
  onView: (universe: UniverseUI) => void;
  onEdit?: (universe: UniverseUI) => void;
  onDelete?: (universe: UniverseUI) => void;
  onShare?: (universe: UniverseUI) => void;
  showActions?: boolean;
  index?: number;
}

const UniverseCard: React.FC<UniverseCardProps> = ({
  universe,
  onView,
  onEdit,
  onDelete,
  onShare,
  showActions = true,
  index = 0,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleMenuClose();
    onEdit?.(universe);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleMenuClose();
    onDelete?.(universe);
  };

  const handleShare = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleMenuClose();
    onShare?.(universe);
  };

  const handleView = () => {
    onView(universe);
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const getUniverseColor = (index: number) => {
    const colors = [
      { primary: '#6366f1', secondary: '#8b5cf6' },
      { primary: '#059669', secondary: '#10b981' },
      { primary: '#dc2626', secondary: '#ef4444' },
      { primary: '#d97706', secondary: '#f59e0b' },
      { primary: '#7c3aed', secondary: '#8b5cf6' },
      { primary: '#2563eb', secondary: '#3b82f6' },
    ];
    return colors[index % colors.length];
  };

  const universeColor = getUniverseColor(index);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          background: `linear-gradient(135deg, ${universeColor.primary}15 0%, ${universeColor.secondary}15 100%)`,
          border: `1px solid ${universeColor.primary}30`,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 32px ${universeColor.primary}30`,
            border: `1px solid ${universeColor.primary}50`,
          },
        }}
        onClick={handleView}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: `linear-gradient(45deg, ${universeColor.primary}, ${universeColor.secondary})`,
                  fontSize: '1.2rem',
                }}
              >
                🌌
              </Avatar>
              <Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h6" component="h2" fontWeight={600}>
                    {universe.title}
                  </Typography>
                  {universe.isPublic ? (
                    <PublicIcon sx={{ fontSize: 16, color: 'success.main' }} />
                  ) : (
                    <PrivateIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                  )}
                </Box>
              </Box>
            </Box>
            
            {showActions && (
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { 
                    color: 'primary.main',
                    background: 'rgba(99, 102, 241, 0.1)',
                  },
                }}
              >
                <MoreVertIcon />
              </IconButton>
            )}
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.6,
            }}
          >
            {universe.description}
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
            {universe.tags.slice(0, 3).map((tag, tagIndex) => (
              <Chip
                key={tagIndex}
                label={tag}
                size="small"
                sx={{
                  background: `${universeColor.primary}20`,
                  color: universeColor.primary,
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  '&:hover': {
                    background: `${universeColor.primary}30`,
                  },
                }}
              />
            ))}
            {universe.tags.length > 3 && (
              <Chip
                label={`+${universe.tags.length - 3}`}
                size="small"
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                }}
              />
            )}
          </Box>

          <Box display="flex" alignItems="center" gap={1} color="text.secondary">
            <ScheduleIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">
              Updated {formatDate(universe.updatedAt)}
            </Typography>
          </Box>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ViewIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleView();
            }}
            sx={{
              borderColor: universeColor.primary,
              color: universeColor.primary,
              '&:hover': {
                borderColor: universeColor.primary,
                background: `${universeColor.primary}10`,
              },
            }}
          >
            View Universe
          </Button>
        </CardActions>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleView}>
            <ViewIcon sx={{ mr: 1 }} />
            View
          </MenuItem>
          
          {onEdit && (
            <MenuItem onClick={handleEdit}>
              <EditIcon sx={{ mr: 1 }} />
              Edit
            </MenuItem>
          )}
          
          {onShare && (
            <MenuItem onClick={handleShare}>
              <ShareIcon sx={{ mr: 1 }} />
              Share
            </MenuItem>
          )}
          
          {onDelete && (
            <>
              <Divider />
              <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                <DeleteIcon sx={{ mr: 1 }} />
                Delete
              </MenuItem>
            </>
          )}
        </Menu>
      </Card>
    </motion.div>
  );
};

export default UniverseCard;