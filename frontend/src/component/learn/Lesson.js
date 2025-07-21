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
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
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
<<<<<<< HEAD
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
          ← Quay về
        </Button>
      </div>

      {/* Từ vựng */}
      <Row>
        {words.length > 0 ? (
          words.map((word, index) => (
            <Col key={word.id || index} lg={6} md={6} sm={12} className="mb-3">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="text-primary mb-0">
                      {word.english}
                    </Card.Title>
                    <small className="text-muted">#{index + 1}</small>
                  </div>

                  <Card.Text>
                    <strong className="text-success">Nghĩa:</strong> {word.vietnamese}
                    {word.pronunciation && (
                      <>
                        <br />
                        <strong className="text-info">Phát âm:</strong> {word.pronunciation}
                      </>
                    )}
                    {word.example && (
                      <>
                        <br />
                        <strong className="text-warning">Ví dụ:</strong> {word.example}
                      </>
                    )}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <Alert variant="info" className="text-center">
              <h5>📝 Chưa có từ vựng</h5>
              <p>Chủ đề này chưa có từ vựng nào. Vui lòng chọn chủ đề khác.</p>
              <Button variant="primary" onClick={() => navigate('/topics')}>
                Chọn chủ đề khác
              </Button>
            </Alert>
          </Col>
        )}
      </Row>

      {/* Action buttons */}
      {words.length > 0 && (
        <div className="text-center mt-4 mb-4">
          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <Button
              variant="primary"
              onClick={() => navigate(`/flashcards?topicId=${topicId}`)}
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
=======
    <div style={{ textAlign: 'center', marginTop: '60px', position: 'relative'}}>
      {/* Ảnh góc trái trên */}
    <img
      src="image/flashcard2.png"
      alt="ảnh góc trái trên"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '120px',
        opacity: 0.9,
        zIndex: 1,
      }}
    />
      <h1 style={{color:'#E7487D'}}>Chủ đề</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 220}}>
        <Flashcard front={flashcards[index].front} back={flashcards[index].back} />
      </div>
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 24 }}>
        <button onClick={prevCard} style={{color: '#E7487D'}}>&#8592;</button>
        <button onClick={nextCard} style={{color: '#E7487D'}} >&#8594;</button>
      </div>
     
      {/* Ảnh góc phải dưới */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: 0,
          zIndex: -1,
          width: '120px',

        }}
      >
        <img
          src="/image/flashcard1.jpg"
          alt="Trang trí góc phải"
          style={{
            width: '100%',
            opacity: 0.8,
            height: 'auto',
          }}
        />
      </div>
          </div>
        );
>>>>>>> 52f59facf8cdf788a990443461952dd81303f136
};

export default Lesson;