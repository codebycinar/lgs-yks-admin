import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
  FormControlLabel,
  Checkbox,
  SelectChangeEvent,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  School,
  Quiz,
  Class as ClassIcon,
  Assignment,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import contentService, {
  Exam,
  Class as ClassType,
  Subject,
  Topic,
  CreateExamData,
  CreateClassData,
  CreateSubjectData,
  CreateTopicData
} from '../services/content';

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
      id={`content-tabpanel-${index}`}
      aria-labelledby={`content-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Content = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Data states
  const [exams, setExams] = useState<Exam[]>([]);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  // Dialog states
  const [examDialogOpen, setExamDialogOpen] = useState(false);
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);
  const [topicDialogOpen, setTopicDialogOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  // Form states
  const [examForm, setExamForm] = useState({
    name: '',
    exam_date: '',
    target_class_levels: [] as number[],
    prep_class_levels: [] as number[],
    description: '',
    is_active: true
  });

  const [classForm, setClassForm] = useState({
    name: '',
    min_class_level: 5,
    max_class_level: 8,
    exam_id: '',
    is_active: true
  });

  const [subjectForm, setSubjectForm] = useState({
    name: '',
    description: '',
    min_class_level: 6,
    max_class_level: 12,
    order_index: 0,
    is_active: true
  });

  const [topicForm, setTopicForm] = useState({
    name: '',
    description: '',
    order_index: 0,
    subject_id: '',
    class_id: '',
    parent_id:'',
    is_active: true
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError('');

      // Her bir API çağrısını ayrı ayrı yapalım ve hataları yakalayalım
      const [examsData, classesData, subjectsData, topicsData] = await Promise.all([
        contentService.getExams().catch(error => {
          console.error('Exams loading error:', error);
          return [];
        }),
        contentService.getClasses().catch(error => {
          console.error('Classes loading error:', error);
          return [];
        }),
        contentService.getSubjects().catch(error => {
          console.error('Subjects loading error:', error);
          return [];
        }),
        contentService.getTopics().catch(error => {
          console.error('Topics loading error:', error);
          return { topics: [], pagination: { totalTopics: 0, totalPages: 0, currentPage: 1, limit: 10 } };
        })
      ]);

      // State'leri güncelle
      setExams(examsData);
      setClasses(classesData);
      setSubjects(subjectsData);
      setTopics(topicsData.topics || []);

      // Eğer hiç veri yüklenemezse hata göster
      if (!examsData.length && !classesData.length && !subjectsData.length && !topicsData.topics?.length) {
        setError('Veriler yüklenemedi. Lütfen sayfayı yenileyin.');
      }
    } catch (error: any) {
      console.error('Data loading error:', error);
      setError('Veriler yüklenirken bir hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Sınav oluşturma
  const handleCreateExam = async () => {
    try {
      setLoading(true);
      await contentService.createExam(examForm);
      setExamDialogOpen(false);
      setExamForm({
        name: '',
        exam_date: '',
        target_class_levels: [],
        prep_class_levels: [],
        description: '',
        is_active: true
      });
      await loadAllData();
    } catch (error: any) {
      setError('Sınav oluşturulurken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Sınıf oluşturma
  const handleCreateClass = async () => {
    try {
      setLoading(true);
      await contentService.createClass(classForm);
      setClassDialogOpen(false);
      setClassForm({
        name: '',
        min_class_level: 5,
        max_class_level: 8,
        exam_id: '',
        is_active: true
      });
      await loadAllData();
    } catch (error: any) {
      setError('Sınıf oluşturulurken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Ders oluşturma
  const handleCreateSubject = async () => {
    try {
      setLoading(true);
      await contentService.createSubject(subjectForm);
      setSubjectDialogOpen(false);
      setSubjectForm({
        name: '',
        description: '',
        min_class_level: 6,
        max_class_level: 12,
        order_index: 0,
        is_active: true
      });
      await loadAllData();
    } catch (error: any) {
      setError('Ders oluşturulurken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Konu oluşturma
  const handleCreateTopic = async () => {
    try {
      setLoading(true);
      await contentService.createTopic(topicForm);
      setTopicDialogOpen(false);
      setTopicForm({
        name: '',
        description: '',
        order_index: 0,
        subject_id: '',
        class_id: '',
        parent_id: '',
        is_active: true
      });
      await loadAllData();
    } catch (error: any) {
      setError('Konu oluşturulurken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Sınıf seviyesi checkbox handler
  const handleClassLevelChange = (level: number, field: 'target_class_levels' | 'prep_class_levels') => {
    setExamForm(prev => ({
      ...prev,
      [field]: prev[field].includes(level)
        ? prev[field].filter(l => l !== level)
        : [...prev[field], level]
    }));
  };

  // Konu seçimi için handler
  const handleTopicChange = (event: SelectChangeEvent<string>) => {
    const selectedTopicId = event.target.value;
    setTopicForm(prev => ({
      ...prev,
      parent_id: selectedTopicId
    }));
  };

  const handleTopicFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setTopicForm(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setTopicForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const handleEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setTopicForm({
      name: topic.name,
      description: '',
      order_index: topic.order_index,
      subject_id: topic.subject_id,
      class_id: topic.class_id,
      parent_id: topic.parent_id || '',
      is_active: topic.is_active
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await contentService.deleteTopic(id);
      await loadAllData();
    } catch (error: any) {
      setError('Konu silinirken hata oluştu');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTopic) {
        await contentService.updateTopic(editingTopic.id, topicForm);
      } else {
        await contentService.createTopic(topicForm);
      }
      setOpenDialog(false);
      setEditingTopic(null);
      setTopicForm({
        name: '',
        description: '',
        order_index: 0,
        subject_id: '',
        class_id: '',
        parent_id: '',
        is_active: true
      });
      await loadAllData();
    } catch (error: any) {
      setError('Konu kaydedilirken hata oluştu');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        İçerik Yönetimi
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setError('')}
          action={
            <Button color="inherit" size="small" onClick={loadAllData}>
              Yeniden Dene
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab icon={<Assignment />} label="Sınavlar" />
          <Tab icon={<ClassIcon />} label="Sınıflar" />
          <Tab icon={<School />} label="Dersler" />
          <Tab icon={<Quiz />} label="Konular" />
        </Tabs>

        {/* Sınavlar Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Sınavlar</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setExamDialogOpen(true)}
            >
              Yeni Sınav
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sınav Adı</TableCell>
                  <TableCell>Sınav Tarihi</TableCell>
                  <TableCell>Hedef Sınıflar</TableCell>
                  <TableCell>Hazırlık Sınıfları</TableCell>
                  <TableCell>Oluşturulma</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell>{exam.name}</TableCell>
                    <TableCell>{formatDate(exam.exam_date)}</TableCell>
                    <TableCell>
                      {exam.target_class_levels.map(level => (
                        <Chip key={level} label={`${level}. Sınıf`} size="small" sx={{ mr: 0.5 }} />
                      ))}
                    </TableCell>
                    <TableCell>
                      {exam.prep_class_levels.map(level => (
                        <Chip key={level} label={`${level}. Sınıf`} size="small" sx={{ mr: 0.5 }} />
                      ))}
                    </TableCell>
                    <TableCell>{formatDate(exam.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Sınıflar Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Sınıflar</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setClassDialogOpen(true)}
            >
              Yeni Sınıf
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sınıf Adı</TableCell>
                  <TableCell>Min Seviye</TableCell>
                  <TableCell>Max Seviye</TableCell>
                  <TableCell>Bağlı Sınav</TableCell>
                  <TableCell>Oluşturulma</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classes.map((classItem) => (
                  <TableRow key={classItem.id}>
                    <TableCell>{classItem.name}</TableCell>
                    <TableCell>{classItem.min_class_level}. Sınıf</TableCell>
                    <TableCell>{classItem.max_class_level}. Sınıf</TableCell>
                    <TableCell>{classItem.exam_name || '-'}</TableCell>
                    <TableCell>{formatDate(classItem.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Dersler Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Dersler</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setSubjectDialogOpen(true)}
            >
              Yeni Ders
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ders Adı</TableCell>
                  <TableCell>Min Sınıf</TableCell>
                  <TableCell>Max Sınıf</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>Oluşturulma</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell>{subject.name}</TableCell>
                    <TableCell>{subject.min_class_level || '-'}. Sınıf</TableCell>
                    <TableCell>{subject.max_class_level || '-'}. Sınıf</TableCell>
                    <TableCell>
                      <Chip
                        label={subject.is_active ? 'Aktif' : 'Pasif'}
                        color={subject.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(subject.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Konular Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Konular</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Yeni Konu
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Konu Adı</TableCell>
                  <TableCell>Ders</TableCell>
                  <TableCell>Sınıf</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>Üst Konu</TableCell>
                  <TableCell>Sıra</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topics.map((topic) => (
                  <TableRow key={topic.id}>
                    <TableCell>{topic.name}</TableCell>
                    <TableCell>{topic.subject_name}</TableCell>
                    <TableCell>{topic.class_name}</TableCell>
                    <TableCell>
                      <Chip
                        label={topic.is_active ? 'Aktif' : 'Pasif'}
                        color={topic.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{topic.parent_name || 'Ana Konu'}</TableCell>
                    <TableCell>{topic.order_index}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(topic)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(topic.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Sınav Oluşturma Dialog */}
      <Dialog open={examDialogOpen} onClose={() => setExamDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Yeni Sınav Oluştur</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Sınav Adı"
              value={examForm.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExamForm(prev => ({ ...prev, name: e.target.value }))}
            />

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                fullWidth
                label="Sınav Tarihi"
                type="date"
                value={examForm.exam_date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExamForm(prev => ({ ...prev, exam_date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 200 }}
              />

              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="subtitle2" gutterBottom>Hedef Sınıf Seviyeleri</Typography>
                {[5, 6, 7, 8].map(level => (
                  <FormControlLabel
                    key={level}
                    control={
                      <Checkbox
                        checked={examForm.target_class_levels.includes(level)}
                        onChange={() => handleClassLevelChange(level, 'target_class_levels')}
                      />
                    }
                    label={`${level}. Sınıf`}
                  />
                ))}
              </Box>

              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="subtitle2" gutterBottom>Hazırlık Sınıf Seviyeleri</Typography>
                {[5, 6, 7, 8].map(level => (
                  <FormControlLabel
                    key={level}
                    control={
                      <Checkbox
                        checked={examForm.prep_class_levels.includes(level)}
                        onChange={() => handleClassLevelChange(level, 'prep_class_levels')}
                      />
                    }
                    label={`${level}. Sınıf`}
                  />
                ))}
              </Box>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Açıklama"
              value={examForm.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setExamForm(prev => ({ ...prev, description: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExamDialogOpen(false)}>İptal</Button>
          <Button onClick={handleCreateExam} variant="contained">Oluştur</Button>
        </DialogActions>
      </Dialog>

      {/* Sınıf Oluşturma Dialog */}
      <Dialog open={classDialogOpen} onClose={() => setClassDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Sınıf Oluştur</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Sınıf Adı"
              value={classForm.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClassForm(prev => ({ ...prev, name: e.target.value }))}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Min Sınıf Seviyesi</InputLabel>
                <Select
                  value={classForm.min_class_level}
                  onChange={(e: SelectChangeEvent<number>) => setClassForm(prev => ({ ...prev, min_class_level: Number(e.target.value) }))}
                  label="Min Sınıf Seviyesi"
                >
                  {[5, 6, 7, 8].map(level => (
                    <MenuItem key={level} value={level}>{level}. Sınıf</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Max Sınıf Seviyesi</InputLabel>
                <Select
                  value={classForm.max_class_level}
                  onChange={(e: SelectChangeEvent<number>) => setClassForm(prev => ({ ...prev, max_class_level: Number(e.target.value) }))}
                  label="Max Sınıf Seviyesi"
                >
                  {[5, 6, 7, 8].map(level => (
                    <MenuItem key={level} value={level}>{level}. Sınıf</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <FormControl fullWidth>
              <InputLabel>Bağlı Sınav (Opsiyonel)</InputLabel>
              <Select
                value={classForm.exam_id || ''}
                onChange={(e: SelectChangeEvent<string>) => setClassForm(prev => ({ ...prev, exam_id: e.target.value }))}
                label="Bağlı Sınav (Opsiyonel)"
              >
                <MenuItem value="">Seçiniz</MenuItem>
                {exams.map(exam => (
                  <MenuItem key={exam.id} value={exam.id}>{exam.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClassDialogOpen(false)}>İptal</Button>
          <Button onClick={handleCreateClass} variant="contained">Oluştur</Button>
        </DialogActions>
      </Dialog>

      {/* Ders Oluşturma Dialog */}
      <Dialog open={subjectDialogOpen} onClose={() => setSubjectDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Ders Oluştur</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Ders Adı"
              value={subjectForm.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubjectForm(prev => ({ ...prev, name: e.target.value }))}
            />
            <TextField
              fullWidth
              type="number"
              label="Sıra Numarası"
              value={subjectForm.order_index}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubjectForm(prev => ({ ...prev, order_index: Number(e.target.value) }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubjectDialogOpen(false)}>İptal</Button>
          <Button onClick={handleCreateSubject} variant="contained">Oluştur</Button>
        </DialogActions>
      </Dialog>

      {/* Konu Oluşturma Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTopic ? 'Konu Düzenle' : 'Yeni Konu Oluştur'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              name="name"
              label="Konu Adı"
              value={topicForm.name}
              onChange={handleTopicFormChange}
            />

            <FormControl fullWidth>
              <InputLabel>Ders</InputLabel>
              <Select
                name="subject_id"
                value={topicForm.subject_id}
                onChange={handleSelectChange}
                label="Ders"
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Sınıf</InputLabel>
              <Select
                name="class_id"
                value={topicForm.class_id}
                onChange={handleSelectChange}
                label="Sınıf"
              >
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Üst Konu (Opsiyonel)</InputLabel>
              <Select
                name="parent_id"
                value={topicForm.parent_id || ''}
                onChange={handleSelectChange}
                label="Üst Konu (Opsiyonel)"
              >
                <MenuItem value="">Ana Konu</MenuItem>
                {topics.map((topic) => (
                  <MenuItem key={topic.id} value={topic.id}>
                    {topic.name} ({topic.subject_name})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Durum</InputLabel>
              <Select
                value={topicForm.is_active ? "true" : "false"}
                onChange={(e) => setTopicForm({ ...topicForm, is_active: e.target.value === "true" })}
                label="Durum"
                sx={{ minWidth: 100 }}
              >
                <MenuItem value="true">Evet</MenuItem>
                <MenuItem value="false">Hayır</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              name="order_index"
              type="number"
              label="Sıra Numarası"
              value={topicForm.order_index}
              onChange={handleTopicFormChange}
            />

            <Button type="submit" variant="contained" color="primary" fullWidth>
              {editingTopic ? 'Güncelle' : 'Konu Ekle'}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>İptal</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Content;