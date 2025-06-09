import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  CircularProgress,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import questionsService, {
  Question,
  QuestionAnswer,
  CreateQuestionData,
  GetQuestionsParams,
  UpdateQuestionData
} from '../services/questions';
import contentService, { Subject, Topic } from '../services/content';

interface QuestionFormState extends Omit<CreateQuestionData, 'answers'> {
  answers: {
    option_letter: string;
    answer_text: string;
    answer_image_url?: string;
    is_correct: boolean;
    order_index: number;
  }[];
}

const Questions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [questionForm, setQuestionForm] = useState<QuestionFormState>({
    question_text: '',
    question_image_url: '',
    solution_text: '',
    has_multiple_correct: false,
    explanation: '',
    estimated_time: 0,
    difficulty_level: 1,
    is_active: true,
    topic_id: '',
    answers: [
      { option_letter: 'A', answer_text: '', is_correct: false, order_index: 0 },
      { option_letter: 'B', answer_text: '', is_correct: false, order_index: 1 },
      { option_letter: 'C', answer_text: '', is_correct: false, order_index: 2 },
      { option_letter: 'D', answer_text: '', is_correct: false, order_index: 3 },
      { option_letter: 'E', answer_text: '', is_correct: false, order_index: 4 }
    ]
  });

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const params: GetQuestionsParams = {
        page: currentPage + 1,
        limit: rowsPerPage,
        topic_id: selectedTopic,
        difficulty_level: selectedDifficulty ? Number(selectedDifficulty) : undefined,
        search: searchQuery
      };
      const response = await questionsService.getQuestions(params);
      setQuestions(response.questions);
      setTotalQuestions(response.pagination.totalQuestions);
    } catch (err) {
      setError('Sorular yüklenirken bir hata oluştu');
      console.error('Soru yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadInitialData = async () => {
    try {
      const [topicsResponse, subjectsResponse] = await Promise.all([
        contentService.getTopics(),
        contentService.getSubjects()
      ]);
      setTopics(topicsResponse.topics);
      setSubjects(subjectsResponse);
    } catch (err) {
      setError('Veriler yüklenirken bir hata oluştu');
      console.error('Veri yükleme hatası:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [currentPage, rowsPerPage, searchQuery, selectedTopic, selectedDifficulty]);

  const handleCreateQuestion = async () => {
    try {
      setError('');
      const createData: CreateQuestionData = {
        ...questionForm,
        question_image_url: questionForm.question_image_url || undefined,
        answers: questionForm.answers.map(answer => ({
          ...answer,
          answer_image_url: answer.answer_image_url || undefined
        }))
      };
      await questionsService.createQuestion(createData);
      setCreateDialogOpen(false);
      resetForm();
      loadQuestions();
    } catch (err) {
      setError('Soru oluşturulurken bir hata oluştu');
      console.error('Soru oluşturma hatası:', err);
    }
  };

  const handleUpdateQuestion = async () => {
    try {
      setError('');
      if (!selectedQuestion) return;

      const updateData: UpdateQuestionData = {
        ...questionForm,
        id: selectedQuestion.id,
        question_image_url: questionForm.question_image_url || undefined,
        answers: questionForm.answers.map(answer => ({
          ...answer,
          answer_image_url: answer.answer_image_url || undefined
        }))
      };

      await questionsService.updateQuestion(updateData);
      setEditDialogOpen(false);
      resetForm();
      loadQuestions();
    } catch (err) {
      setError('Soru güncellenirken bir hata oluştu');
      console.error('Soru güncelleme hatası:', err);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!window.confirm('Bu soruyu silmek istediğinize emin misiniz?')) return;
    try {
      setError('');
      await questionsService.deleteQuestion(id);
      loadQuestions();
    } catch (err) {
      setError('Soru silinirken bir hata oluştu');
      console.error('Soru silme hatası:', err);
    }
  };

  const resetForm = () => {
    setQuestionForm({
      question_text: '',
      question_image_url: '',
      solution_text: '',
      has_multiple_correct: false,
      explanation: '',
      estimated_time: 0,
      difficulty_level: 1,
      is_active: true,
      topic_id: '',
      answers: [
        { option_letter: 'A', answer_text: '', is_correct: false, order_index: 0 },
        { option_letter: 'B', answer_text: '', is_correct: false, order_index: 1 },
        { option_letter: 'C', answer_text: '', is_correct: false, order_index: 2 },
        { option_letter: 'D', answer_text: '', is_correct: false, order_index: 3 },
        { option_letter: 'E', answer_text: '', is_correct: false, order_index: 4 }
      ]
    });
  };

  const handleViewQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setViewDialogOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setSelectedQuestion(question);
    // topic_name'e göre topic_id'yi bul
    const topic = topics.find(t => t.name === question.topic_name);
    const topicId = topic ? topic.id : '';
    
    setQuestionForm({
      question_text: question.question_text,
      question_image_url: question.question_image_url || '',
      solution_text: question.solution_text,
      has_multiple_correct: question.has_multiple_correct,
      explanation: question.explanation || '',
      estimated_time: question.estimated_time,
      difficulty_level: question.difficulty_level,
      is_active: question.is_active,
      topic_id: topicId,
      answers: question.answers.map((answer, index) => ({
        option_letter: answer.option_letter,
        answer_text: answer.answer_text,
        answer_image_url: answer.answer_image_url || '',
        is_correct: answer.is_correct,
        order_index: index
      }))
    });
    setEditDialogOpen(true);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(0);
  };

  const handleTopicChange = (event: SelectChangeEvent<string>) => {
    setSelectedTopic(event.target.value);
    setCurrentPage(0);
  };

  const handleDifficultyChange = (event: SelectChangeEvent<string>) => {
    setSelectedDifficulty(event.target.value);
    setCurrentPage(0);
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    if (name) {
      setQuestionForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleStringSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    if (name) {
      setQuestionForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNumberSelectChange = (event: SelectChangeEvent<number>) => {
    const { name, value } = event.target;
    if (name) {
      setQuestionForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleBooleanSelectChange = (event: SelectChangeEvent<boolean>) => {
    const { name, value } = event.target;
    if (name) {
      setQuestionForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAnswerChange = (index: number, field: string, value: string | boolean) => {
    setQuestionForm(prev => ({
      ...prev,
      answers: prev.answers.map((answer, i) =>
        i === index ? { ...answer, [field]: value } : answer
      )
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Sorular</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Yeni Soru
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <TextField
            fullWidth
            label="Soru Ara"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <FormControl fullWidth>
            <InputLabel>Konu</InputLabel>
            <Select
              value={selectedTopic}
              onChange={handleTopicChange}
              label="Konu"
            >
              <MenuItem value="">Tümü</MenuItem>
              {topics.map(topic => (
                <MenuItem key={topic.id} value={topic.id}>
                  {topic.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <FormControl fullWidth>
            <InputLabel>Zorluk Seviyesi</InputLabel>
            <Select
              value={selectedDifficulty}
              onChange={handleDifficultyChange}
              label="Zorluk Seviyesi"
            >
              <MenuItem value="">Tümü</MenuItem>
              <MenuItem value="1">Kolay</MenuItem>
              <MenuItem value="2">Orta</MenuItem>
              <MenuItem value="3">Zor</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Soru</TableCell>
              <TableCell>Konu</TableCell>
              <TableCell>Zorluk</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : questions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Soru bulunamadı
                </TableCell>
              </TableRow>
            ) : (
              questions.map(question => (
                <TableRow key={question.id}>
                  <TableCell>{question.question_text}</TableCell>
                  <TableCell>{question.topic_name}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        question.difficulty_level === 1
                          ? 'Kolay'
                          : question.difficulty_level === 2
                          ? 'Orta'
                          : 'Zor'
                      }
                      color={
                        question.difficulty_level === 1
                          ? 'success'
                          : question.difficulty_level === 2
                          ? 'warning'
                          : 'error'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={question.is_active ? 'Aktif' : 'Pasif'}
                      color={question.is_active ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleViewQuestion(question)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditQuestion(question)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteQuestion(question.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalQuestions}
          page={currentPage}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      {/* Create Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Yeni Soru Oluştur</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <Box sx={{ width: "100%", mb: 2 }}>
              <TextField
                fullWidth
                label="Soru Metni"
                name="question_text"
                value={questionForm.question_text}
                onChange={handleFormChange}
                multiline
                rows={4}
              />
            </Box>
            <Box sx={{ width: "100%", mb: 2 }}>
              <TextField
                fullWidth
                label="Çözüm"
                name="solution_text"
                value={questionForm.solution_text}
                onChange={handleFormChange}
                multiline
                rows={4}
              />
            </Box>
            <Box sx={{ width: "100%", mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Konu</InputLabel>
                <Select
                  name="topic_id"
                  value={questionForm.topic_id}
                  onChange={handleStringSelectChange}
                  label="Konu"
                >
                  {topics.map(topic => (
                    <MenuItem key={topic.id} value={topic.id}>
                      {topic.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: "100%", mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Zorluk Seviyesi</InputLabel>
                <Select
                  name="difficulty_level"
                  value={questionForm.difficulty_level}
                  onChange={handleNumberSelectChange}
                  label="Zorluk Seviyesi"
                >
                  <MenuItem value={1}>Kolay</MenuItem>
                  <MenuItem value={2}>Orta</MenuItem>
                  <MenuItem value={3}>Zor</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: "100%", mb: 2 }}>
              <TextField
                fullWidth
                label="Tahmini Süre (saniye)"
                name="estimated_time"
                type="number"
                value={questionForm.estimated_time}
                onChange={handleFormChange}
              />
            </Box>
            <Box sx={{ width: "100%", mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Durum</InputLabel>
                <Select
                  name="is_active"
                  value={questionForm.is_active}
                  onChange={handleBooleanSelectChange}
                  label="Durum"
                >
                  <MenuItem value="true">Aktif</MenuItem>
                  <MenuItem value="false">Pasif</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: "100%", mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Cevaplar
              </Typography>
              {questionForm.answers.map((answer, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }} >
                    <Box sx={{ width: "100%", mb: 2 }}>
                      <TextField
                        fullWidth
                        label={`${answer.option_letter} Şıkkı`}
                        value={answer.answer_text}
                        onChange={e =>
                          handleAnswerChange(index, 'answer_text', e.target.value)
                        }
                      />
                    </Box>
                    <Box sx={{ width: "100%", mb: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel>Doğru Cevap</InputLabel>
                        <Select
                          value={answer.is_correct}
                          onChange={e =>
                            handleAnswerChange(
                              index,
                              'is_correct',
                              e.target.value === 'true'
                            )
                          }
                          label="Doğru Cevap"
                        >
                          <MenuItem value="true">Doğru</MenuItem>
                          <MenuItem value="false">Yanlış</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>İptal</Button>
          <Button onClick={handleCreateQuestion} variant="contained" color="primary">
            Oluştur
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Soru Düzenle</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <Box sx={{ width: "100%", mb: 2 }}>
              <TextField
                fullWidth
                label="Soru Metni"
                name="question_text"
                value={questionForm.question_text}
                onChange={handleFormChange}
                multiline
                rows={4}
              />
            </Box>
            <Box sx={{ width: "100%", mb: 2 }}>
              <TextField
                fullWidth
                label="Çözüm"
                name="solution_text"
                value={questionForm.solution_text}
                onChange={handleFormChange}
                multiline
                rows={4}
              />
            </Box>
            <Box sx={{ width: "100%", mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Konu</InputLabel>
                <Select
                  name="topic_id"
                  value={questionForm.topic_id}
                  onChange={handleStringSelectChange}
                  label="Konu"
                >
                  {topics.map(topic => (
                    <MenuItem key={topic.id} value={topic.id}>
                      {topic.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: "100%", mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Zorluk Seviyesi</InputLabel>
                <Select
                  name="difficulty_level"
                  value={questionForm.difficulty_level}
                  onChange={handleNumberSelectChange}
                  label="Zorluk Seviyesi"
                >
                  <MenuItem value={1}>Kolay</MenuItem>
                  <MenuItem value={2}>Orta</MenuItem>
                  <MenuItem value={3}>Zor</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: "100%", mb: 2 }}>
              <TextField
                fullWidth
                label="Tahmini Süre (saniye)"
                name="estimated_time"
                type="number"
                value={questionForm.estimated_time}
                onChange={handleFormChange}
              />
            </Box>
            <Box sx={{ width: "100%", mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Durum</InputLabel>
                <Select
                  name="is_active"
                  value={questionForm.is_active}
                  onChange={handleBooleanSelectChange}
                  label="Durum"
                >
                  <MenuItem value="true">Aktif</MenuItem>
                  <MenuItem value="false">Pasif</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: "100%", mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Cevaplar
              </Typography>
              {questionForm.answers.map((answer, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }} >
                    <Box sx={{ width: "100%", mb: 2 }}>
                      <TextField
                        fullWidth
                        label={`${answer.option_letter} Şıkkı`}
                        value={answer.answer_text}
                        onChange={e =>
                          handleAnswerChange(index, 'answer_text', e.target.value)
                        }
                      />
                    </Box>
                    <Box sx={{ width: "100%", mb: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel>Doğru Cevap</InputLabel>
                        <Select
                          value={answer.is_correct}
                          onChange={e =>
                            handleAnswerChange(
                              index,
                              'is_correct',
                              e.target.value === 'true'
                            )
                          }
                          label="Doğru Cevap"
                        >
                          <MenuItem value="true">Doğru</MenuItem>
                          <MenuItem value="false">Yanlış</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>İptal</Button>
          <Button onClick={handleUpdateQuestion} variant="contained" color="primary">
            Güncelle
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Soru Detayı</DialogTitle>
        <DialogContent>
          {selectedQuestion && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <Box sx={{ width: "100%", mb: 2 }}>
                <Typography variant="h6">Soru</Typography>
                <Typography>{selectedQuestion.question_text}</Typography>
              </Box>
              <Box sx={{ width: "100%", mb: 2 }}>
                <Typography variant="h6">Çözüm</Typography>
                <Typography>{selectedQuestion.solution_text}</Typography>
              </Box>
              <Box sx={{ width: "100%", mb: 2 }}>
                <Typography variant="h6">Konu</Typography>
                <Typography>{selectedQuestion.topic_name}</Typography>
              </Box>
              <Box sx={{ width: "100%", mb: 2 }}>
                <Typography variant="h6">Zorluk Seviyesi</Typography>
                <Typography>
                  {selectedQuestion.difficulty_level === 1
                    ? 'Kolay'
                    : selectedQuestion.difficulty_level === 2
                    ? 'Orta'
                    : 'Zor'}
                </Typography>
              </Box>
              <Box sx={{ width: "100%", mb: 2 }}>
                <Typography variant="h6">Tahmini Süre</Typography>
                <Typography>{selectedQuestion.estimated_time} saniye</Typography>
              </Box>
              <Box sx={{ width: "100%", mb: 2 }}>
                <Typography variant="h6">Durum</Typography>
                <Typography>
                  {selectedQuestion.is_active ? 'Aktif' : 'Pasif'}
                </Typography>
              </Box>
              <Box sx={{ width: "100%", mb: 2 }}>
                <Typography variant="h6">Cevaplar</Typography>
                {selectedQuestion.answers.map((answer, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography>
                      {answer.option_letter}) {answer.answer_text}
                      {answer.is_correct && ' (Doğru Cevap)'}
                    </Typography>
                  </Box>
                ))}
              </Box>
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