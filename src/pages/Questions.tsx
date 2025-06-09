import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
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
  TablePagination,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  Fab,
  InputAdornment
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  CloudUpload,
  Image,
  PictureAsPdf,
  Visibility,
  Close
} from '@mui/icons-material';
import questionsService, { 
  Question, 
  QuestionAnswer,
  CreateQuestionData,
  GetQuestionsParams
} from '../services/questions';
import contentService, { Subject, Topic } from '../services/content';

const Questions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<number>(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  // Form state
  const [form, setForm] = useState<CreateQuestionData>({
    topicId: 0,
    difficultyLevel: 'medium',
    questionText: '',
    questionImageUrl: '',
    questionPdfUrl: '',
    solutionText: '',
    solutionImageUrl: '',
    solutionPdfUrl: '',
    answers: [{ answerText: '', answerImageUrl: '', isCorrect: false, orderIndex: 0 }],
    explanation: '',
    keywords: [],
    estimatedTime: 0
  });

  const [uploadLoading, setUploadLoading] = useState(false);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const params: GetQuestionsParams = {
        page: page + 1,
        limit: rowsPerPage,
      };

      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedTopic) params.topicId = selectedTopic;
      if (selectedDifficulty) params.difficultyLevel = selectedDifficulty;

      const response = await questionsService.getQuestions(params);
      setQuestions(response.questions);
      setTotalQuestions(response.pagination.totalQuestions);
    } catch (error: any) {
      setError('Sorular yüklenirken hata oluştu');
      console.error('Questions loading error:', error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery, selectedTopic, selectedDifficulty]);

  const loadInitialData = async () => {
    try {
      const [subjectsData, topicsData] = await Promise.all([
        contentService.getSubjects(),
        contentService.getTopics()
      ]);
      setSubjects(subjectsData);
      setTopics(topicsData);
    } catch (error: any) {
      setError('Başlangıç verileri yüklenirken hata oluştu');
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleCreateQuestion = async () => {
    try {
      setLoading(true);
      await questionsService.createQuestion(form);
      setCreateDialogOpen(false);
      resetForm();
      await fetchQuestions();
    } catch (error: any) {
      setError('Soru oluşturulurken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuestion = async () => {
    if (!selectedQuestion) return;
    
    try {
      setLoading(true);
      await questionsService.updateQuestion({
        ...form,
        id: selectedQuestion.id
      });
      setEditDialogOpen(false);
      resetForm();
      await fetchQuestions();
    } catch (error: any) {
      setError('Soru güncellenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!window.confirm('Bu soruyu silmek istediğinize emin misiniz?')) return;

    try {
      setLoading(true);
      await questionsService.deleteQuestion(id);
      await fetchQuestions();
    } catch (error: any) {
      setError('Soru silinirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList | null, fileType: string) => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append(fileType, files[0]);

    try {
      setUploadLoading(true);
      const response = await questionsService.uploadFiles(formData);
      
      // Form'u güncelle
      if (fileType === 'questionImage' && response.questionImageUrl) {
        setForm(prev => ({ ...prev, questionImageUrl: response.questionImageUrl! }));
      } else if (fileType === 'questionPdf' && response.questionPdfUrl) {
        setForm(prev => ({ ...prev, questionPdfUrl: response.questionPdfUrl! }));
      } else if (fileType === 'solutionImage' && response.solutionImageUrl) {
        setForm(prev => ({ ...prev, solutionImageUrl: response.solutionImageUrl! }));
      } else if (fileType === 'solutionPdf' && response.solutionPdfUrl) {
        setForm(prev => ({ ...prev, solutionPdfUrl: response.solutionPdfUrl! }));
      }
    } catch (error: any) {
      setError('Dosya yüklenirken hata oluştu');
    } finally {
      setUploadLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      topicId: 0,
      difficultyLevel: 'medium',
      questionText: '',
      questionImageUrl: '',
      questionPdfUrl: '',
      solutionText: '',
      solutionImageUrl: '',
      solutionPdfUrl: '',
      answers: [{ answerText: '', answerImageUrl: '', isCorrect: false, orderIndex: 0 }],
      explanation: '',
      keywords: [],
      estimatedTime: 0
    });
  };

  const openEditDialog = (question: Question) => {
    setSelectedQuestion(question);
    setForm({
      topicId: question.topic_id,
      difficultyLevel: question.difficulty_level,
      questionText: question.question_text || '',
      questionImageUrl: question.question_image_url || '',
      questionPdfUrl: question.question_pdf_url || '',
      solutionText: question.solution_text || '',
      solutionImageUrl: question.solution_image_url || '',
      solutionPdfUrl: question.solution_pdf_url || '',
      answers: question.answers || [{ answerText: '', answerImageUrl: '', isCorrect: false, orderIndex: 0 }],
      explanation: question.explanation || '',
      keywords: question.keywords,
      estimatedTime: question.estimated_time || 0
    });
    setEditDialogOpen(true);
  };

  const openViewDialog = (question: Question) => {
    setSelectedQuestion(question);
    setViewDialogOpen(true);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const addAnswer = () => {
    setForm(prev => ({
      ...prev,
      answers: [...(prev.answers || []), { 
        answerText: '', 
        answerImageUrl: '', 
        isCorrect: false, 
        orderIndex: (prev.answers?.length || 0)
      }]
    }));
  };

  const updateAnswer = (index: number, field: keyof QuestionAnswer, value: any) => {
    setForm(prev => ({
      ...prev,
      answers: prev.answers?.map((answer, i) => 
        i === index ? { ...answer, [field]: value } : answer
      ) || []
    }));
  };

  const removeAnswer = (index: number) => {
    setForm(prev => ({
      ...prev,
      answers: prev.answers?.filter((_, i) => i !== index) || []
    }));
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case 'easy': return 'Kolay';
      case 'medium': return 'Orta';
      case 'hard': return 'Zor';
      default: return level;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Soru Havuzu Yönetimi</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Yeni Soru
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            sx={{ flex: 1, minWidth: 200 }}
            placeholder="Soru ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ flex: 1, minWidth: 200 }}>
            <InputLabel>Konu</InputLabel>
            <Select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(Number(e.target.value))}
            >
              <MenuItem value={0}>Tüm Konular</MenuItem>
              {topics.map(topic => (
                <MenuItem key={topic.id} value={topic.id}>
                  {topic.subject_name} - {topic.class_name} - {topic.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ flex: 1, minWidth: 200 }}>
            <InputLabel>Zorluk</InputLabel>
            <Select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <MenuItem value="">Tüm Seviyeler</MenuItem>
              <MenuItem value="easy">Kolay</MenuItem>
              <MenuItem value="medium">Orta</MenuItem>
              <MenuItem value="hard">Zor</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Questions Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Konu</TableCell>
                <TableCell>Zorluk</TableCell>
                <TableCell>Soru Metni</TableCell>
                <TableCell>Dosyalar</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell>Oluşturulma</TableCell>
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
              ) : questions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Soru bulunamadı
                  </TableCell>
                </TableRow>
              ) : (
                questions.map((question) => (
                  <TableRow key={question.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {question.subject_name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {question.class_name} - {question.topic_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getDifficultyLabel(question.difficulty_level)}
                        color={getDifficultyColor(question.difficulty_level)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {question.question_text || 'Sadece görsel/PDF'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={0.5}>
                        {question.question_image_url && <Image fontSize="small" color="primary" />}
                        {question.question_pdf_url && <PictureAsPdf fontSize="small" color="secondary" />}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={question.is_active ? 'Aktif' : 'Pasif'}
                        color={question.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(question.created_at)}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => openViewDialog(question)} color="info">
                        <Visibility />
                      </IconButton>
                      <IconButton onClick={() => openEditDialog(question)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteQuestion(question.id)} color="error">
                        <Delete />
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
          count={totalQuestions}
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

      {/* Create/Edit Question Dialog */}
      <Dialog 
        open={createDialogOpen || editDialogOpen} 
        onClose={() => {
          setCreateDialogOpen(false);
          setEditDialogOpen(false);
          resetForm();
        }}
        maxWidth="lg" 
        fullWidth
      >
        <DialogTitle>
          {editDialogOpen ? 'Soru Düzenle' : 'Yeni Soru Oluştur'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Temel Bilgiler */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl sx={{ flex: 1, minWidth: 200 }}>
                <InputLabel>Konu</InputLabel>
                <Select
                  value={form.topicId}
                  onChange={(e) => setForm(prev => ({ ...prev, topicId: Number(e.target.value) }))}
                >
                  {topics.map(topic => (
                    <MenuItem key={topic.id} value={topic.id}>
                      {topic.subject_name} - {topic.class_name} - {topic.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ flex: 1, minWidth: 200 }}>
                <InputLabel>Zorluk Seviyesi</InputLabel>
                <Select
                  value={form.difficultyLevel}
                  onChange={(e) => setForm(prev => ({ ...prev, difficultyLevel: e.target.value as any }))}
                >
                  <MenuItem value="easy">Kolay</MenuItem>
                  <MenuItem value="medium">Orta</MenuItem>
                  <MenuItem value="hard">Zor</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Soru İçeriği */}
            <Box>
              <Typography variant="h6" gutterBottom>Soru İçeriği</Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Soru Metni"
                value={form.questionText}
                onChange={(e) => setForm(prev => ({ ...prev, questionText: e.target.value }))}
              />
            </Box>

            {/* Dosya Yüklemeler */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>Soru Görseli</Typography>
                    {form.questionImageUrl && (
                      <Box mb={1}>
                        <Chip 
                          label="Görsel yüklendi" 
                          color="success" 
                          size="small"
                          onDelete={() => setForm(prev => ({ ...prev, questionImageUrl: '' }))}
                        />
                      </Box>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="question-image-upload"
                      onChange={(e) => handleFileUpload(e.target.files, 'questionImage')}
                    />
                    <label htmlFor="question-image-upload">
                      <Button
                        component="span"
                        variant="outlined"
                        startIcon={<CloudUpload />}
                        fullWidth
                        disabled={uploadLoading}
                      >
                        Görsel Yükle
                      </Button>
                    </label>
                  </CardContent>
                </Card>
              </Box>

              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>Soru PDF</Typography>
                    {form.questionPdfUrl && (
                      <Box mb={1}>
                        <Chip 
                          label="PDF yüklendi" 
                          color="success" 
                          size="small"
                          onDelete={() => setForm(prev => ({ ...prev, questionPdfUrl: '' }))}
                        />
                      </Box>
                    )}
                    <input
                      type="file"
                      accept="application/pdf"
                      style={{ display: 'none' }}
                      id="question-pdf-upload"
                      onChange={(e) => handleFileUpload(e.target.files, 'questionPdf')}
                    />
                    <label htmlFor="question-pdf-upload">
                      <Button
                        component="span"
                        variant="outlined"
                        startIcon={<CloudUpload />}
                        fullWidth
                        disabled={uploadLoading}
                      >
                        PDF Yükle
                      </Button>
                    </label>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Cevaplar */}
            <Box>
              <Typography variant="h6" gutterBottom>Cevaplar</Typography>
              {form.answers?.map((answer, index) => (
                <Card key={index} variant="outlined" sx={{ mb: 2, p: 2 }}>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <TextField
                        fullWidth
                        label={`Cevap ${index + 1}`}
                        value={answer.answerText || ''}
                        onChange={(e) => updateAnswer(index, 'answerText', e.target.value)}
                      />
                      <FormControl>
                        <InputLabel>Doğru?</InputLabel>
                        <Select
                          value={answer.isCorrect}
                          onChange={(e) => updateAnswer(index, 'isCorrect', e.target.value)}
                          sx={{ minWidth: 100 }}
                        >
                          <MenuItem value={true}>Evet</MenuItem>
                          <MenuItem value={false}>Hayır</MenuItem>
                        </Select>
                      </FormControl>
                      <IconButton 
                        onClick={() => removeAnswer(index)}
                        disabled={(form.answers?.length || 0) === 1}
                        color="error"
                      >
                        <Close />
                      </IconButton>
                    </Box>
                    <TextField
                      fullWidth
                      label="Cevap Görsel URL (opsiyonel)"
                      value={answer.answerImageUrl || ''}
                      onChange={(e) => updateAnswer(index, 'answerImageUrl', e.target.value)}
                    />
                  </Box>
                </Card>
              ))}
              <Button onClick={addAnswer} variant="outlined" size="small">
                Cevap Ekle
              </Button>
            </Box>

            {/* Çözüm */}
            <Box>
              <Typography variant="h6" gutterBottom>Çözüm</Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Açıklama"
                value={form.explanation}
                onChange={(e) => setForm(prev => ({ ...prev, explanation: e.target.value }))}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                type="number"
                label="Tahmini Süre (dakika)"
                value={form.estimatedTime}
                onChange={(e) => setForm(prev => ({ ...prev, estimatedTime: Number(e.target.value) }))}
                sx={{ maxWidth: 200 }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setCreateDialogOpen(false);
            setEditDialogOpen(false);
            resetForm();
          }}>
            İptal
          </Button>
          <Button 
            onClick={editDialogOpen ? handleUpdateQuestion : handleCreateQuestion} 
            variant="contained"
            disabled={loading}
          >
            {editDialogOpen ? 'Güncelle' : 'Oluştur'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Question Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Soru Detayı</DialogTitle>
        <DialogContent>
          {selectedQuestion && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="h6">
                  {selectedQuestion.subject_name} - {selectedQuestion.class_name} - {selectedQuestion.topic_name}
                </Typography>
                <Chip 
                  label={getDifficultyLabel(selectedQuestion.difficulty_level)}
                  color={getDifficultyColor(selectedQuestion.difficulty_level)}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
              
              {selectedQuestion.question_text && (
                <Box>
                  <Typography variant="subtitle2">Soru Metni:</Typography>
                  <Typography>{selectedQuestion.question_text}</Typography>
                </Box>
              )}

              {selectedQuestion.answers && selectedQuestion.answers.length > 0 && (
                <Box>
                  <Typography variant="subtitle2">Cevaplar:</Typography>
                  <List dense>
                    {selectedQuestion.answers.map((answer, index) => (
                      <ListItem key={index}>
                        <ListItemText 
                          primary={`${index + 1}. ${answer.answerText}`}
                          secondary={answer.isCorrect ? 'Doğru cevap' : 'Yanlış cevap'}
                        />
                        {answer.isCorrect && (
                          <Chip label="Doğru" color="success" size="small" sx={{ ml: 1 }} />
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {selectedQuestion.explanation && (
                <Box>
                  <Typography variant="subtitle2">Açıklama:</Typography>
                  <Typography>{selectedQuestion.explanation}</Typography>
                </Box>
              )}

              {selectedQuestion.estimated_time && (
                <Box>
                  <Typography variant="subtitle2">
                    Tahmini Süre: {selectedQuestion.estimated_time} dakika
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Questions;