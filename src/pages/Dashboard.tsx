import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  People,
  Quiz,
  School,
  Assignment
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  PieLabelRenderProps
} from 'recharts';
import dashboardService, { DashboardStats } from '../services/dashboard';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value.toLocaleString()}
          </Typography>
        </Box>
        <Box sx={{ color, fontSize: 40 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const renderSummaryLabel = ({ name, percent }: PieLabelRenderProps) => {
  const numericPercent =
    typeof percent === 'number' ? percent : Number(percent ?? 0);
  return `${name ?? ''} (${(numericPercent * 100).toFixed(0)}%)`;
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboardStats();
      setStats(data);
    } catch (error: any) {
      console.error('Dashboard verisi yüklenirken hata:', error);
      setError('Dashboard verileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !stats) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error || 'Dashboard verileri yüklenemedi'}
      </Alert>
    );
  }

  // Grafik verilerini hazırla
  const subjectChartData = stats.subjectStats.map(subject => ({
    name: subject.subject_name,
    topics: subject.topic_count,
    questions: subject.question_count
  }));

  const summaryPieData = [
    { name: 'Kullanıcılar', value: stats.summary.totalUsers },
    { name: 'Sorular', value: stats.summary.totalQuestions },
    { name: 'Konular', value: stats.summary.totalTopics },
    { name: 'Aktif Programlar', value: stats.summary.activePrograms }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* İstatistik Kartları */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 250 }}>
          <StatCard
            title="Toplam Kullanıcı"
            value={stats.summary.totalUsers}
            icon={<People />}
            color="#1976d2"
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 250 }}>
          <StatCard
            title="Toplam Soru"
            value={stats.summary.totalQuestions}
            icon={<Quiz />}
            color="#388e3c"
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 250 }}>
          <StatCard
            title="Toplam Konu"
            value={stats.summary.totalTopics}
            icon={<School />}
            color="#f57c00"
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 250 }}>
          <StatCard
            title="Aktif Program"
            value={stats.summary.activePrograms}
            icon={<Assignment />}
            color="#7b1fa2"
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Üst Satır: Grafikler */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Ders Bazında İstatistikler */}
          <Box sx={{ flex: 2, minWidth: 400 }}>
            <Paper sx={{ p: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Ders Bazında Konu ve Soru Dağılımı
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={subjectChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="topics" fill="#8884d8" name="Konu Sayısı" />
                  <Bar dataKey="questions" fill="#82ca9d" name="Soru Sayısı" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          {/* Genel Dağılım */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Paper sx={{ p: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Genel Dağılım
              </Typography>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={summaryPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderSummaryLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {summaryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Box>
        </Box>

        {/* Alt Satır: Listeler */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Son Kayıt Olan Kullanıcılar */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Son Kayıt Olan Kullanıcılar
              </Typography>
              <List>
                {stats.recentUsers.map((user) => (
                  <ListItem key={user.id} divider>
                    <ListItemText
                      primary={`${user.name} ${user.surname}`}
                      secondary={`${user.phone_number} - ${new Date(user.created_at).toLocaleDateString('tr-TR')}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>

          {/* Ders İstatistikleri Tablosu */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Ders İstatistikleri
              </Typography>
              <List>
                {stats.subjectStats.map((subject, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={subject.subject_name}
                      secondary={`${subject.topic_count} konu, ${subject.question_count} soru`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
