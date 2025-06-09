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
  SelectChangeEvent
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
    description: '',
    isActive: true
  });

  const [classForm, setClassForm] = useState<CreateClassData>({
    name: '',
    minClassLevel: 5,
    maxClassLevel: 8,
    examId: '',
    isActive: true
  });

  const [subjectForm, setSubjectForm] = useState<CreateSubjectData>({
    name: '',
    description: '',
    min_class_level: 6,
    max_class_level: 12,
    orderIndex: 0,
    isActive: true
  });

  const [topicForm, setTopicForm] = useState<CreateTopicData>({
    name: '',
    description: '',
    subjectId: '',
    classId: '',
    parentId: undefined,
    orderIndex: 0,
    isActive: true
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const examsData = await contentService.getExams().catch(() => []);
      const classesData = await contentService.getClasses().catch(() => []);
      const subjectsData = await contentService.getSubjects().catch(() => []);
      const topicsData = await contentService.getTopics().catch(() => []);
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
        description: '',
        isActive: true
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
        examId: '',
        isActive: true
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
        orderIndex: 0,
        isActive: true
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
        subjectId: '',
        classId: '',
        parentId: undefined,
        orderIndex: 0,
        isActive: true
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

  // Konu seçimi için handler
  const handleTopicChange = (event: SelectChangeEvent<string>) => {
    const selectedTopicId = event.target.value;
    setTopicForm(prev => ({
      ...prev,
      parentId: selectedTopicId
    }));
  };

  // Zorluk seviyesi için handler
  const handleDifficultyChange = (event: SelectChangeEvent<string>) => {
    const difficulty = event.target.value as 'easy' | 'medium' | 'hard';
    setTopicForm(prev => ({
      ...prev,
      difficultyLevel: difficulty
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
                    <TableCell>{formatDate(exam.examDate)}</TableCell>
                    <TableCell>
                      {exam.targetClassLevels.map(level => (
                        <Chip key={level} label={`${level}. Sınıf`} size="small" sx={{ mr: 0.5 }} />
                      ))}
                    </TableCell>
                    <TableCell>
                      {exam.prepClassLevels.map(level => (
                        <Chip key={level} label={`${level}. Sınıf`} size="small" sx={{ mr: 0.5 }} />
                      ))}
                    </TableCell>
                    <TableCell>{formatDate(exam.createdAt)}</TableCell>
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
                    <TableCell>{classItem.minClassLevel}. Sınıf</TableCell>
                    <TableCell>{classItem.maxClassLevel}. Sınıf</TableCell>
                    <TableCell>{classItem.examId || '-'}</TableCell>
                    <TableCell>{formatDate(classItem.createdAt)}</TableCell>
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
                    <TableCell>{subject.orderIndex}</TableCell>
                    <TableCell>
                      <Chip 
                        label={subject.isActive ? 'Aktif' : 'Pasif'} 
                        color={subject.isActive ? 'success' : 'default'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{formatDate(subject.createdAt)}</TableCell>
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
                  <TableCell>Sınıf Seviyesi</TableCell>
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
                    <TableCell>{topic.class_level}. Sınıf</TableCell>
                    <TableCell>{topic.parent_name || '-'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={topic.isActive ? 'Aktif' : 'Pasif'} 
                        color={topic.isActive ? 'success' : 'default'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{formatDate(topic.createdAt)}</TableCell>
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
                value={examForm.examDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExamForm(prev => ({ ...prev, examDate: e.target.value }))}
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
                  value={classForm.minClassLevel}
                  onChange={(e: SelectChangeEvent<number>) => setClassForm(prev => ({ ...prev, minClassLevel: Number(e.target.value) }))}
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
                  value={classForm.maxClassLevel}
                  onChange={(e: SelectChangeEvent<number>) => setClassForm(prev => ({ ...prev, maxClassLevel: Number(e.target.value) }))}
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
                value={classForm.examId || ''}
                onChange={(e: SelectChangeEvent<string>) => setClassForm(prev => ({ ...prev, examId: e.target.value }))}
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
              value={subjectForm.orderIndex}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubjectForm(prev => ({ ...prev, orderIndex: Number(e.target.value) }))}
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTopicForm(prev => ({ ...prev, name: e.target.value }))}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Ders</InputLabel>
                <Select
                  value={topicForm.subjectId}
                  onChange={(e: SelectChangeEvent<string>) => setTopicForm(prev => ({ ...prev, subjectId: e.target.value }))}
                  label="Ders"
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
                  onChange={(e: SelectChangeEvent<string>) => setTopicForm(prev => ({ ...prev, classId: e.target.value }))}
                  label="Sınıf"
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
                  onChange={(e: SelectChangeEvent<string>) => setTopicForm(prev => ({ ...prev, parentId: e.target.value || undefined }))}
                  label="Üst Konu (Opsiyonel)"
                >
                  <MenuItem value="">Ana Konu</MenuItem>
                  {topics
                    .filter(topic => 
                      topic.subject_name === subjects.find(s => s.id === topicForm.subjectId)?.name &&
                      topic.class_name === classes.find(c => c.id === topicForm.classId)?.name
                    )
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTopicForm(prev => ({ ...prev, orderIndex: Number(e.target.value) }))}
              />
            </Box>

            {/* Konu seçimi için Select komponenti */}
            <FormControl fullWidth>
              <InputLabel>Konu</InputLabel>
              <Select
                value={topicForm.parentId || ''}
                onChange={handleTopicChange}
                label="Konu"
                inputProps={{ 'aria-label': 'Konu seçimi' }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300
                    }
                  }
                }}
              >
                {topics.map(topic => (
                  <MenuItem key={topic.id} value={topic.id}>
                    {topic.subject_name} - {topic.class_name} ({topic.class_level}. Sınıf) - {topic.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Zorluk seviyesi için Select komponenti */}
            <FormControl fullWidth>
              <InputLabel>Zorluk Seviyesi</InputLabel>
              <Select
                value={topicForm.difficultyLevel || ''}
                onChange={handleDifficultyChange}
                label="Zorluk Seviyesi"
                inputProps={{ 'aria-label': 'Zorluk seviyesi seçimi' }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300
                    }
                  }
                }}
              >
                <MenuItem value="easy">Kolay</MenuItem>
                <MenuItem value="medium">Orta</MenuItem>
                <MenuItem value="hard">Zor</MenuItem>
              </Select>
            </FormControl>
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