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
  Checkbox
} from '@mui/material';
import {
  Add,
  School,
  Quiz,
  Class as ClassIcon,
  Assignment
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

const Content: React.FC = () => {
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

  // Form states
  const [examForm, setExamForm] = useState<CreateExamData>({
    name: '',
    examDate: '',
    targetClassLevels: [],
    prepClassLevels: [],
    description: ''
  });

  const [classForm, setClassForm] = useState<CreateClassData>({
    name: '',
    minClassLevel: 5,
    maxClassLevel: 8,
    examId: undefined
  });

  const [subjectForm, setSubjectForm] = useState<CreateSubjectData>({
    name: '',
    orderIndex: 0
  });

  const [topicForm, setTopicForm] = useState<CreateTopicData>({
    name: '',
    subjectId: 0,
    classId: 0,
    parentId: undefined,
    orderIndex: 0
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [examsData, classesData, subjectsData, topicsData] = await Promise.all([
        contentService.getExams(),
        contentService.getClasses(),
        contentService.getSubjects(),
        contentService.getTopics()
      ]);
      setExams(examsData);
      setClasses(classesData);
      setSubjects(subjectsData);
      setTopics(topicsData);
    } catch (error: any) {
      setError('Veriler yüklenirken hata oluştu');
      console.error('Data loading error:', error);
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
        examDate: '',
        targetClassLevels: [],
        prepClassLevels: [],
        description: ''
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
        minClassLevel: 5,
        maxClassLevel: 8,
        examId: undefined
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
        orderIndex: 0
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
        subjectId: 0,
        classId: 0,
        parentId: undefined,
        orderIndex: 0
      });
      await loadAllData();
    } catch (error: any) {
      setError('Konu oluşturulurken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Sınıf seviyesi checkbox handler
  const handleClassLevelChange = (level: number, field: 'targetClassLevels' | 'prepClassLevels') => {
    setExamForm(prev => ({
      ...prev,
      [field]: prev[field].includes(level) 
        ? prev[field].filter(l => l !== level)
        : [...prev[field], level]
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  if (loading && !exams.length) {
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
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
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
              startIcon={<Add />}
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
              startIcon={<Add />}
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
              startIcon={<Add />}
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
                  <TableCell>Sıra</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>Oluşturulma</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell>{subject.name}</TableCell>
                    <TableCell>{subject.order_index}</TableCell>
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
              startIcon={<Add />}
              onClick={() => setTopicDialogOpen(true)}
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
                  <TableCell>Üst Konu</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>Oluşturulma</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topics.map((topic) => (
                  <TableRow key={topic.id}>
                    <TableCell>{topic.name}</TableCell>
                    <TableCell>{topic.subject_name}</TableCell>
                    <TableCell>{topic.class_name}</TableCell>
                    <TableCell>{topic.parent_name || '-'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={topic.is_active ? 'Aktif' : 'Pasif'} 
                        color={topic.is_active ? 'success' : 'default'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{formatDate(topic.created_at)}</TableCell>
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
              onChange={(e) => setExamForm(prev => ({ ...prev, name: e.target.value }))}
            />
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                fullWidth
                label="Sınav Tarihi"
                type="date"
                value={examForm.examDate}
                onChange={(e) => setExamForm(prev => ({ ...prev, examDate: e.target.value }))}
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
                        checked={examForm.targetClassLevels.includes(level)}
                        onChange={() => handleClassLevelChange(level, 'targetClassLevels')}
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
                        checked={examForm.prepClassLevels.includes(level)}
                        onChange={() => handleClassLevelChange(level, 'prepClassLevels')}
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
              onChange={(e) => setExamForm(prev => ({ ...prev, description: e.target.value }))}
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
              onChange={(e) => setClassForm(prev => ({ ...prev, name: e.target.value }))}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Min Sınıf Seviyesi</InputLabel>
                <Select
                  value={classForm.minClassLevel}
                  onChange={(e) => setClassForm(prev => ({ ...prev, minClassLevel: Number(e.target.value) }))}
                >
                  {[5, 6, 7, 8].map(level => (
                    <MenuItem key={level} value={level}>{level}. Sınıf</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Max Sınıf Seviyesi</InputLabel>
                <Select
                  value={classForm.maxClassLevel}
                  onChange={(e) => setClassForm(prev => ({ ...prev, maxClassLevel: Number(e.target.value) }))}
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
                value={classForm.examId || ''}
                onChange={(e) => setClassForm(prev => ({ ...prev, examId: Number(e.target.value) || undefined }))}
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
              onChange={(e) => setSubjectForm(prev => ({ ...prev, name: e.target.value }))}
            />
            <TextField
              fullWidth
              type="number"
              label="Sıra Numarası"
              value={subjectForm.orderIndex}
              onChange={(e) => setSubjectForm(prev => ({ ...prev, orderIndex: Number(e.target.value) }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubjectDialogOpen(false)}>İptal</Button>
          <Button onClick={handleCreateSubject} variant="contained">Oluştur</Button>
        </DialogActions>
      </Dialog>

      {/* Konu Oluşturma Dialog */}
      <Dialog open={topicDialogOpen} onClose={() => setTopicDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Konu Oluştur</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Konu Adı"
              value={topicForm.name}
              onChange={(e) => setTopicForm(prev => ({ ...prev, name: e.target.value }))}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Ders</InputLabel>
                <Select
                  value={topicForm.subjectId}
                  onChange={(e) => setTopicForm(prev => ({ ...prev, subjectId: Number(e.target.value) }))}
                >
                  {subjects.map(subject => (
                    <MenuItem key={subject.id} value={subject.id}>{subject.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Sınıf</InputLabel>
                <Select
                  value={topicForm.classId}
                  onChange={(e) => setTopicForm(prev => ({ ...prev, classId: Number(e.target.value) }))}
                >
                  {classes.map(classItem => (
                    <MenuItem key={classItem.id} value={classItem.id}>{classItem.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Üst Konu (Opsiyonel)</InputLabel>
                <Select
                  value={topicForm.parentId || ''}
                  onChange={(e) => setTopicForm(prev => ({ ...prev, parentId: Number(e.target.value) || undefined }))}
                >
                  <MenuItem value="">Ana Konu</MenuItem>
                  {topics
                    .filter(topic => topic.subject_id === topicForm.subjectId && topic.class_id === topicForm.classId)
                    .map(topic => (
                      <MenuItem key={topic.id} value={topic.id}>{topic.name}</MenuItem>
                    ))}
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                type="number"
                label="Sıra Numarası"
                value={topicForm.orderIndex}
                onChange={(e) => setTopicForm(prev => ({ ...prev, orderIndex: Number(e.target.value) }))}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTopicDialogOpen(false)}>İptal</Button>
          <Button onClick={handleCreateTopic} variant="contained">Oluştur</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Content;