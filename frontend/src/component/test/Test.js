import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner, Button } from 'react-bootstrap';
import TestCard from './TestCard';
import ApiService from '../../services/api';

const Test = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getAllTests();
        setTests(data);
      } catch (error) {
        console.error('Error fetching tests:', error);
        setError('Không thể tải danh sách bài test. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3">Đang tải bài test...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>⚠️ Lỗi kết nối</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="text-center mb-4">
        <h2>Chọn bài test để làm</h2>
        <p className="text-muted">Có {tests.length} bài test để kiểm tra kiến thức</p>
      </div>

      <Row>
        {tests.length > 0 ? (
          tests.map((test) => (
            <Col key={test.id} lg={4} md={6} sm={12} className="mb-4">
              <TestCard
                title={test.title || test.name}
                img={test.img || 'image/testchoose.jpg'}
                text={test.text || test.description}
                link={`/test-start?testId=${test.id}`}
              />
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <Alert variant="info" className="text-center">
              <h5>📝 Chưa có bài test nào</h5>
              <p>Hệ thống đang được cập nhật. Vui lòng quay lại sau.</p>
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Test;