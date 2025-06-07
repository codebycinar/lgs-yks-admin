import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Search,
  Visibility,
  Male,
  Female,
  School,
  Quiz,
  Assignment
} from '@mui/icons-material';
import usersService, { User, UserDetail, GetUsersParams } from '../services/users';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [userDetailOpen, setUserDetailOpen] = useState<boolean>(false);
  const [userDetailLoading, setUserDetailLoading] = useState<boolean>(false);

  // Kullanıcıları yükle
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params: GetUsersParams = {
        page: page + 1, // Backend 1-indexed
        limit: rowsPerPage,
      };
      
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await usersService.getUsers(params);
      setUsers(response.users);
      setTotalUsers(response.pagination.totalUsers);
    } catch (error: any) {
      console.error('Kullanıcıları yüklerken hata:', error);
      setError('Kullanıcılar yüklenemedi');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Sayfa değişikliği
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Sayfa boyutu değişikliği
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Arama işlemi
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0); // Arama yapıldığında ilk sayfaya git
  };

  // Kullanıcı detayını görüntüle
  const handleViewUserDetail = async (userId: number) => {
    try {
      setUserDetailLoading(true);
      setUserDetailOpen(true);
      const userDetail = await usersService.getUserById(userId);
      setSelectedUser(userDetail);
    } catch (error: any) {
      console.error('Kullanıcı detayı yüklenirken hata:', error);
      setError('Kullanıcı detayı yüklenemedi');
      setUserDetailOpen(false);
    } finally {
      setUserDetailLoading(false);
    }
  };

  // Dialog kapat
  const handleCloseUserDetail = () => {
    setUserDetailOpen(false);
    setSelectedUser(null);
  };

  // Cinsiyet iconı
  const getGenderIcon = (gender: string) => {
    return gender === 'male' ? <Male color="primary" /> : <Female color="secondary" />;
  };

  // Tarih formatla
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Kullanıcı Yönetimi
      </Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        {/* Arama alanı */}
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Kullanıcı ara (ad, soyad, telefon)"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow>
                <TableCell>Ad Soyad</TableCell>
                <TableCell>Telefon</TableCell>
                <TableCell>Cinsiyet</TableCell>
                <TableCell>Sınıf</TableCell>
                <TableCell>Sınav</TableCell>
                <TableCell>Kayıt Tarihi</TableCell>
                <TableCell align="center">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Kullanıcı bulunamadı
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {getGenderIcon(user.gender)}
                        <Box ml={1}>
                          {user.name} {user.surname}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.phone_number}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.gender === 'male' ? 'Erkek' : 'Kadın'}
                        color={user.gender === 'male' ? 'primary' : 'secondary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{user.class_name || '-'}</TableCell>
                    <TableCell>{user.exam_name || '-'}</TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewUserDetail(user.id)}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalUsers}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Sayfa başına satır:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} / ${count !== -1 ? count : `${to}'den fazla`}`
          }
        />
      </Paper>

      {/* Kullanıcı Detay Dialog */}
      <Dialog
        open={userDetailOpen}
        onClose={handleCloseUserDetail}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Kullanıcı Detayı
        </DialogTitle>
        <DialogContent>
          {userDetailLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : selectedUser ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Temel Bilgiler */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Card sx={{ flex: 1, minWidth: 250 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Temel Bilgiler
                    </Typography>
                    <Typography><strong>Ad Soyad:</strong> {selectedUser.name} {selectedUser.surname}</Typography>
                    <Typography><strong>Telefon:</strong> {selectedUser.phone_number}</Typography>
                    <Typography><strong>Cinsiyet:</strong> {selectedUser.gender === 'male' ? 'Erkek' : 'Kadın'}</Typography>
                    <Typography><strong>Kayıt Tarihi:</strong> {formatDate(selectedUser.created_at)}</Typography>
                  </CardContent>
                </Card>

                {/* Eğitim Bilgileri */}
                <Card sx={{ flex: 1, minWidth: 250 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Eğitim Bilgileri
                    </Typography>
                    <Typography><strong>Sınıf:</strong> {selectedUser.class_name || 'Belirtilmemiş'}</Typography>
                    <Typography><strong>Sınav:</strong> {selectedUser.exam_name || 'Belirtilmemiş'}</Typography>
                    {selectedUser.exam_date && (
                      <Typography><strong>Sınav Tarihi:</strong> {formatDate(selectedUser.exam_date)}</Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>

              {/* İstatistikler */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Aktivite İstatistikleri
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box display="flex" alignItems="center" sx={{ flex: 1, minWidth: 150 }}>
                      <Assignment color="primary" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="h6">{selectedUser.stats.totalGoals}</Typography>
                        <Typography variant="caption">Toplam Hedef</Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" sx={{ flex: 1, minWidth: 150 }}>
                      <Quiz color="success" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="h6">{selectedUser.stats.completedGoals}</Typography>
                        <Typography variant="caption">Tamamlanan Hedef</Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" sx={{ flex: 1, minWidth: 150 }}>
                      <School color="warning" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="h6">{selectedUser.stats.totalPrograms}</Typography>
                        <Typography variant="caption">Toplam Program</Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDetail}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;