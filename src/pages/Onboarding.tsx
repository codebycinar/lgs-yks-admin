import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { EventAvailable, Insights, Phone, Visibility } from '@mui/icons-material';
import onboardingService, {
  OnboardingProfileSummary,
  OnboardingStatusFilter,
} from '../services/onboarding';

type TableState = 'loading' | 'ready' | 'error';

const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const resolveStatus = (profile: OnboardingProfileSummary) =>
  profile.primary_goal ? 'Tamamlandı' : 'Bekliyor';

const formatDateTime = (value?: string | null) => {
  if (!value) return '-';
  return new Date(value).toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDate = (value?: string | null) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('tr-TR');
};

const Onboarding: React.FC = () => {
  const [profiles, setProfiles] = useState<OnboardingProfileSummary[]>([]);
  const [statusFilter, setStatusFilter] = useState<OnboardingStatusFilter>('all');
  const [tableState, setTableState] = useState<TableState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<OnboardingProfileSummary | null>(null);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setTableState('loading');
        setErrorMessage('');
        const data = await onboardingService.getProfiles(statusFilter);
        setProfiles(data);
        setTableState('ready');
      } catch (error: any) {
        console.error('Onboarding profilleri yüklenirken hata:', error);
        setErrorMessage(error?.message || 'Onboarding profilleri getirilemedi');
        setTableState('error');
      }
    };

    loadProfiles();
  }, [statusFilter]);

  const summaryStats = useMemo(() => {
    const total = profiles.length;
    const completed = profiles.filter((item) => Boolean(item.primary_goal)).length;
    return {
      total,
      completed,
      pending: total - completed,
    };
  }, [profiles]);

  const handleFilterChange = (event: SelectChangeEvent<OnboardingStatusFilter>) => {
    setStatusFilter(event.target.value as OnboardingStatusFilter);
  };

  const handleViewProfile = (profile: OnboardingProfileSummary) => {
    setSelectedProfile(profile);
  };

  const closeDialog = () => {
    setSelectedProfile(null);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Onboarding Özetleri
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Öğrencilerin hedef, müsaitlik ve AI plan verilerini kolayca takip edin.
          </Typography>
        </Box>
        <Box minWidth={200}>
          <InputLabel id="status-filter-label">Duruma göre filtrele</InputLabel>
          <Select
            labelId="status-filter-label"
            size="small"
            fullWidth
            value={statusFilter}
            onChange={handleFilterChange}
          >
            <MenuItem value="all">Tümü</MenuItem>
            <MenuItem value="completed">Tamamlayanlar</MenuItem>
            <MenuItem value="pending">Eksik olanlar</MenuItem>
          </Select>
        </Box>
      </Box>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Toplam kayıt
              </Typography>
              <Typography variant="h5">{summaryStats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Profilini tamamlayanlar
              </Typography>
              <Typography variant="h5" color="success.main">
                {summaryStats.completed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Aksiyon bekleyenler
              </Typography>
              <Typography variant="h5" color="warning.main">
                {summaryStats.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {tableState === 'error' ? (
        <Alert severity="error">{errorMessage}</Alert>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Öğrenci</TableCell>
                  <TableCell>Telefon</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>Hedef</TableCell>
                  <TableCell>Son Güncelleme</TableCell>
                  <TableCell>Çalışma Blokları</TableCell>
                  <TableCell align="center">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableState === 'loading' ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : profiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Filtreyle eşleşen kayıt bulunamadı.
                    </TableCell>
                  </TableRow>
                ) : (
                  profiles.map((profile) => {
                    const availabilityCount = profile.availability?.length ?? 0;
                    const chipColor: 'success' | 'warning' = profile.primary_goal ? 'success' : 'warning';
                    return (
                      <TableRow key={profile.id} hover>
                        <TableCell>
                          <Box display="flex" flexDirection="column">
                            <Typography fontWeight={600}>
                              {profile.name} {profile.surname}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Üyelik: {formatDate(profile.created_at)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Phone fontSize="small" />
                            <Typography>{profile.phone_number}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={resolveStatus(profile)} color={chipColor} size="small" />
                        </TableCell>
                        <TableCell>
                          <Typography noWrap maxWidth={240} title={profile.primary_goal ?? '-'}>
                            {profile.primary_goal ?? '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDateTime(profile.profile_updated_at)}</TableCell>
                        <TableCell>
                          {availabilityCount === 0 ? (
                            <Chip size="small" variant="outlined" label="Blok yok" />
                          ) : (
                            <Tooltip
                              title={profile.availability
                                .map(
                                  (slot) =>
                                    `${dayNames[slot.dayOfWeek] ?? slot.dayOfWeek}: ${slot.startTime}-${slot.endTime}${
                                      slot.intensity ? ` (${slot.intensity})` : ''
                                    }`,
                                )
                                .join(' · ')}
                            >
                              <Chip
                                icon={<EventAvailable fontSize="small" />}
                                label={`${availabilityCount} blok`}
                                size="small"
                                color="primary"
                              />
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton color="primary" onClick={() => handleViewProfile(profile)}>
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog open={Boolean(selectedProfile)} onClose={closeDialog} fullWidth maxWidth="md">
        <DialogTitle>Onboarding Detayı</DialogTitle>
        <DialogContent dividers>
          {selectedProfile ? (
            <Box display="flex" flexDirection="column" gap={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Öğrenci
                      </Typography>
                      <Typography fontWeight={600}>
                        {selectedProfile.name} {selectedProfile.surname}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedProfile.phone_number}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Kayıt: {formatDate(selectedProfile.created_at)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Hedef ve profil
                      </Typography>
                      <Typography variant="body2">
                        Profil tipi: {selectedProfile.profile_type ?? '-'}
                      </Typography>
                      <Typography variant="body2">
                        Ana hedef: {selectedProfile.primary_goal ?? '-'}
                      </Typography>
                      <Typography variant="body2">
                        Hedef tarih: {formatDate(selectedProfile.target_date)}
                      </Typography>
                      <Typography variant="body2">
                        Sınav türü: {selectedProfile.exam_type ?? '-'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {selectedProfile.motivation ? (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Motivasyon
                    </Typography>
                    <Typography>{selectedProfile.motivation}</Typography>
                  </CardContent>
                </Card>
              ) : null}

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Çalışma blokları
                  </Typography>
                  {selectedProfile.availability.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Henüz zaman bloğu paylaşılmamış.
                    </Typography>
                  ) : (
                    <Grid container spacing={1}>
                      {selectedProfile.availability.map((slot) => (
                        <Grid item xs={12} md={6} key={slot.id}>
                          <Chip
                            icon={<EventAvailable fontSize="small" />}
                            label={`${dayNames[slot.dayOfWeek] ?? slot.dayOfWeek} ${slot.startTime}-${slot.endTime}${
                              slot.intensity ? ` • ${slot.intensity}` : ''
                            }`}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Insights fontSize="small" color="primary" />
                    <Typography variant="subtitle2" color="text.secondary">
                      Plan tercihleri
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    Günlük süre: {selectedProfile.daily_available_minutes ?? '-'} dk
                  </Typography>
                  <Typography variant="body2">
                    Haftalık süre: {selectedProfile.weekly_available_minutes ?? '-'} dk
                  </Typography>
                  <Typography variant="body2">
                    Öğrenme stili: {selectedProfile.learning_style ?? '-'}
                  </Typography>
                  <Typography variant="body2">
                    Hatırlatma saati: {selectedProfile.reminder_time ?? '-'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Profil son güncelleme: {formatDateTime(selectedProfile.profile_updated_at)}
                  </Typography>
                  {selectedProfile.study_focus_areas?.length ? (
                    <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                      {selectedProfile.study_focus_areas.map((area) => (
                        <Chip key={area} label={area} size="small" color="primary" variant="outlined" />
                      ))}
                    </Box>
                  ) : null}
                </CardContent>
              </Card>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Onboarding;
