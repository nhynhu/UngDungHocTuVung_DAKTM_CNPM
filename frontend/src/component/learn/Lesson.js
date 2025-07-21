import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';

const Lesson = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const topicId = searchParams.get('topicId');

  const [words, setWords] = useState([]);
  const [topicInfo, setTopicInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!topicId) {
      setError('Không tìm thấy chủ đề');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Lấy thông tin topic và từ vựng
        const [topicData, wordsData] = await Promise.all([
          ApiService.getTopicById(topicId),
          ApiService.getWordsByTopic(topicId)
        ]);

        setTopicInfo(topicData);
        setWords(wordsData);
      } catch (error) {
        console.error('Error fetching lesson data:', error);
        setError('Không thể tải bài học. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topicId]);

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3">Đang tải bài học...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>⚠️ Lỗi</Alert.Heading>
          <p>{error}</p>
          <div className="mt-3">
            <Button variant="outline-primary" onClick={() => navigate('/topics')}>
              Quay về chủ đề
            </Button>
            <Button variant="outline-danger" className="ms-2" onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>📖 {topicInfo?.nameVi || topicInfo?.name || 'Bài học từ vựng'}</h2>
          <p className="text-muted mb-0">
            Có {words.length} từ vựng trong chủ đề này
          </p>
        </div>
        <Button variant="outline-secondary" onClick={() => navigate('/topics')}>
          📚 Chọn chủ đề khác
        </Button>
      </div>

      {/* Word List */}
      <Row>
        {words.map((word, index) => (
          <Col key={word.id || index} md={6} lg={4} className="mb-3">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="text-primary">{word.english}</Card.Title>
                <Card.Text className="text-muted">{word.vietnamese}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Action Buttons */}
      {words.length > 0 && (
        <div className="text-center mt-5">
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button
              variant="primary"
              onClick={() => navigate(`/flashcard?topicId=${topicId}`)}
            >
              🃏 Luyện tập Flashcard
            </Button>
            <Button
              variant="success"
              onClick={() => navigate(`/test?topicId=${topicId}`)}
            >
              📝 Làm bài test
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/topics')}
            >
              📚 Chọn chủ đề khác
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Lesson;