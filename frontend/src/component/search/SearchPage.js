import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Form} from 'react-bootstrap';
import { performSearch } from '../../data/searchData';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [filterType, setFilterType] = useState('all');
  const [results, setResults] = useState([]);

  // Tìm kiếm
  useEffect(() => {
    performSearchAction(query, filterType);
  }, [query, filterType]);

  const performSearchAction = (query, type) => {
    const searchResults = performSearch(query, type);
    setResults(searchResults);
  };

  return (
    <Container className="search-page" style={{ padding: '30px 0' }}>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="search-title mb-0">🔍 Search results</h2>
            <Form.Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ width: '200px' }}
            >
              <option value="all">All</option>
              <option value="topics">Topics only</option>
              <option value="vocabulary">Vocabulary only</option>
            </Form.Select>
          </div>
          {/* Results Summary */}
          {query && (
            <div className="results-summary mb-3">
              <p>
                Found <strong>{results.length}</strong> results for "{query}"
                {filterType !== 'all' && (
                  <span> in <strong>{filterType === 'topics' ? 'topics' : 'vocabulary'}</strong></span>
                )}
              </p>
            </div>
          )}

          {/* Results */}
          <Row>
            {results.length > 0 ? (
              results.map((result, index) => (
                <Col md={6} lg={4} key={index} className="mb-3">
                  <Card className="search-result-card h-100">
                    <Card.Body>
                      {result.type === 'topic' ? (
                        <>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <Badge bg="primary">TOPIC</Badge>
                            <small className="text-muted">{result.wordCount} words</small>
                          </div>
                          <Card.Title className="h5">{result.nameVi}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">{result.name}</Card.Subtitle>
                          <Card.Text>{result.description}</Card.Text>
                        </>
                      ) : (
                        <>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <Badge bg="success">Vocabulary</Badge>
                          </div>
                          <Card.Title className="h5">{result.english}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">{result.vietnamese}</Card.Subtitle>
                          <Card.Text>
                            <small className="text-muted">Topic: {result.topic}</small>
                          </Card.Text>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : query ? (
              <Col>
                <Card className="text-center">
                  <Card.Body>
                    <i className="bi bi-search" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                    <h4 className="mt-3">Not found</h4>
                    <p className="text-muted">
                      No results found for "{query}".
                      Please try with a different keyword.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              <Col>
                <Card className="text-center">
                  <Card.Body>
                    <i className="bi bi-search" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                    <h4 className="mt-3">Enter a keyword to search</h4>
                    <p className="text-muted">
                      You can search for topics, vocabulary, or any content.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchPage;
