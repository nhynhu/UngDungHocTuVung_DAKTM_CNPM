import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Auto search on mount if query exists
  useEffect(() => {
    if (initialQuery) {
      handleSearch(null, initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (e, searchQuery = null) => {
    if (e) e.preventDefault();

    const searchTerm = searchQuery || query;
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const data = await ApiService.searchWords(searchTerm, searchType);
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setError('Không thể tìm kiếm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result) => {
    if (result.type === 'topic') {
      navigate(`/lessons?topicId=${result.id}`);
    }
  };

  return (
    <Container className="mt-4">
      <div className="text-center mb-4">
        <h2>Tìm kiếm nâng cao</h2>
        <p className="text-muted">Tìm kiếm từ vựng và chủ đề trong hệ thống</p>
      </div>

      {/* Search Form */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="align-items-end">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Từ khóa tìm kiếm</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập từ cần tìm..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Loại tìm kiếm</Form.Label>
                  <Form.Select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    disabled={loading}
                  >
                    <option value="all">Tất cả</option>
                    <option value="topics">Chủ đề</option>
                    <option value="vocabulary">Từ vựng</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading || !query.trim()}
                  className="w-100"
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Đang tìm...
                    </>
                  ) : (
                    '🔍 Tìm kiếm'
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Error */}
      {error && (
        <Alert variant="danger" className="text-center">
          <Alert.Heading>⚠️ Lỗi tìm kiếm</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => setError('')}>
            Đóng
          </Button>
        </Alert>
      )}

      {/* Results */}
      {hasSearched && !loading && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>
              Kết quả tìm kiếm cho "{query}"
              <Badge bg="secondary" className="ms-2">{results.length}</Badge>
            </h5>
            {results.length > 0 && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                  setHasSearched(false);
                }}
              >
                Xóa kết quả
              </Button>
            )}
          </div>

          <Row>
            {results.length > 0 ? (
              results.map((result, index) => (
                <Col key={`${result.type}-${result.id}-${index}`} lg={6} md={6} sm={12} className="mb-3">
                  <Card
                    className={`h-100 shadow-sm ${result.type === 'topic' ? 'border-primary' : 'border-success'}`}
                    style={{ cursor: result.type === 'topic' ? 'pointer' : 'default' }}
                    onClick={() => result.type === 'topic' && handleResultClick(result)}
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Badge
                          bg={result.type === 'topic' ? 'primary' : 'success'}
                          className="mb-2"
                        >
                          {result.type === 'topic' ? '📚 Chủ đề' : '📝 Từ vựng'}
                        </Badge>
                        {result.type === 'topic' && (
                          <small className="text-muted">Click để xem</small>
                        )}
                      </div>

                      {result.type === 'topic' ? (
                        <>
                          <Card.Title className="text-primary">
                            {result.nameVi || result.name}
                          </Card.Title>
                          <Card.Text>
                            {result.description}
                            <br />
                            <small className="text-muted">
                              {result.wordCount} từ vựng
                            </small>
                          </Card.Text>
                        </>
                      ) : (
                        <>
                          <Card.Title className="text-success">
                            {result.english}
                          </Card.Title>
                          <Card.Text>
                            <strong>Nghĩa:</strong> {result.vietnamese}
                            <br />
                            <small className="text-muted">
                              Chủ đề: {result.topic}
                            </small>
                          </Card.Text>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <Alert variant="info" className="text-center">
                  <h5>Không tìm thấy kết quả</h5>
                  <p>Không có kết quả nào cho từ khóa "<strong>{query}</strong>"</p>
                  <div className="mt-3">
                    <p className="mb-2">Gợi ý:</p>
                    <ul className="list-unstyled">
                      <li>• Kiểm tra chính tả</li>
                      <li>• Thử từ khóa khác</li>
                      <li>• Sử dụng từ ngắn hơn</li>
                    </ul>
                  </div>
                </Alert>
              </Col>
            )}
          </Row>
        </div>
      )}

      {/* Initial state */}
      {!hasSearched && !loading && (
        <div className="text-center mt-5">
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
          <h4>Bắt đầu tìm kiếm</h4>
          <p className="text-muted">
            Nhập từ khóa vào ô tìm kiếm để khám phá từ vựng và chủ đề
          </p>
        </div>
      )}
    </Container>
  );
};

export default SearchPage;
