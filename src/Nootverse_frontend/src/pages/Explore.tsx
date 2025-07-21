import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  TrendingUp as TrendingIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { UniverseUI, StatsUI } from '../types';
import { nootverseService } from '../utils/backend';
import UniverseCard from '../components/UniverseCard';

interface ExploreProps {
  onUniverseView: (universe: UniverseUI) => void;
}

const Explore: React.FC<ExploreProps> = ({ onUniverseView }) => {
  const [universes, setUniverses] = useState<UniverseUI[]>([]);
  const [filteredUniverses, setFilteredUniverses] = useState<UniverseUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<StatsUI | null>(null);
  const [selectedUniverse, setSelectedUniverse] = useState<UniverseUI | null>(null);

  const loadPublicUniverses = async () => {
    try {
      setLoading(true);
      const [publicUniverses, platformStats] = await Promise.all([
        nootverseService.getPublicUniverses(),
        nootverseService.getStats(),
      ]);
      setUniverses(publicUniverses);
      setFilteredUniverses(publicUniverses);
      setStats(platformStats);
      setError(null);
    } catch (err) {
      console.error('Error loading public universes:', err);
      setError('Failed to load public universes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredUniverses(universes);
      return;
    }

    try {
      setSearching(true);
      const searchResults = await nootverseService.searchUniverses(query);
      setFilteredUniverses(searchResults);
    } catch (err) {
      console.error('Error searching universes:', err);
      setError('Failed to search universes. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    loadPublicUniverses();
  }, []);

  const getAllTags = () => {
    const tagSet = new Set<string>();
    universes.forEach(universe => {
      universe.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  };

  const filterByTag = (tag: string) => {
    const filtered = universes.filter(universe => 
      universe.tags.includes(tag)
    );
    setFilteredUniverses(filtered);
    setSearchQuery('');
  };

  const clearFilters = () => {
    setFilteredUniverses(universes);
    setSearchQuery('');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            Explore Universes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover amazing universes created by the community
          </Typography>
        </Box>

        {/* Stats */}
        {stats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                }}
              >
                <PublicIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" component="div" fontWeight="bold">
                  {stats.publicUniverses}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Public Universes
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                <TrendingIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" component="div" fontWeight="bold">
                  {stats.totalUniverses}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Universes
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <PublicIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4" component="div" fontWeight="bold">
                  {stats.totalUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Creators
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Search */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search universes..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {searching ? <CircularProgress size={20} /> : <SearchIcon />}
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          
          {/* Tags */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Popular Tags
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                label="All"
                onClick={clearFilters}
                variant={searchQuery === '' && filteredUniverses.length === universes.length ? 'filled' : 'outlined'}
                sx={{ mb: 1 }}
              />
              {getAllTags().slice(0, 10).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => filterByTag(tag)}
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Box>
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
            {filteredUniverses.length === 0 ? (
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
                    {searchQuery ? 'No universes found' : 'No public universes yet'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mb={3}>
                    {searchQuery 
                      ? `No universes match "${searchQuery}". Try a different search term.`
                      : 'Be the first to create and share a public universe!'
                    }
                  </Typography>
                  {searchQuery && (
                    <Chip
                      label="Clear search"
                      onClick={clearFilters}
                      variant="outlined"
                    />
                  )}
                </Box>
              </motion.div>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  {searchQuery 
                    ? `Found ${filteredUniverses.length} universe(s) for "${searchQuery}"`
                    : `${filteredUniverses.length} Public Universe(s)`
                  }
                </Typography>
                <Grid container spacing={3}>
                  {filteredUniverses.map((universe, index) => (
                    <Grid item xs={12} md={6} lg={4} key={universe.id}>
                      <UniverseCard
                        universe={universe}
                        index={index}
                        onView={onUniverseView}
                        showActions={false}
                      />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </>
        )}
      </motion.div>
    </Container>
  );
};

export default Explore;