import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import ApiService from '../../services/api'; // THÊM

const SearchBox = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    // Hàm tìm kiếm qua API
    const handleSearch = async (query) => {
        setSearchQuery(query);

        if (query.trim() === '') {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        try {
            const results = await ApiService.searchWords(query); // SỬA: Gọi API
            setSearchResults(results.slice(0, 8));
            setShowResults(true);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
            setShowResults(false);
        }
    };

    // Xử lý khi nhấn nút search hoặc Enter
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setShowResults(false);
        }
    };

    // Xử lý khi chọn kết quả
    const handleSelectResult = (result) => {
        if (result.type === 'topic') {
            navigate(`/lessons?topicId=${result.id}`);
        } else {
            navigate(`/search?q=${encodeURIComponent(result.english)}`);
        }
        setShowResults(false);
        setSearchQuery('');
    };

    // Xử lý khi blur
    const handleBlur = () => {
        setTimeout(() => setShowResults(false), 200);
    };

    return (
        <div style={{ position: 'relative' }}>
            <Form className="d-flex" style={{ alignItems: 'center', gap: '8px' }} onSubmit={handleSearchSubmit}>
                <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    style={{ height: '32px', borderRadius: '20px', fontSize: '1rem', width: '250px' }}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchQuery && setShowResults(true)}
                    onBlur={handleBlur}
                />
                <Button
                    type="submit"
                    style={{ backgroundColor: '#FFDDDD', borderColor: '#FFDDDD', color: '#fff', height: '32px', padding: '0 12px' }}
                >
                    <img src="/image/search-icon.png" alt="search" style={{ width: 20, height: 20 }} />
                </Button>
            </Form>

            {/* Dropdown kết quả tìm kiếm */}
            {showResults && searchResults.length > 0 && (
                <div className="search-dropdown">
                    {searchResults.map((result, index) => (
                        <div
                            key={index}
                            className="search-item"
                            onClick={() => handleSelectResult(result)}
                        >
                            <div className="search-item-title">
                                {result.type === 'topic' ? result.nameVi || result.name : result.english}
                            </div>
                            <div className="search-item-subtitle">
                                {result.type === 'topic' ? `${result.wordCount} từ vựng` : result.vietnamese}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Thông báo không có kết quả */}
            {showResults && searchResults.length === 0 && searchQuery.trim() && (
                <div className="search-dropdown">
                    <div className="search-no-results">
                        Không tìm thấy kết quả cho "{searchQuery}"
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBox;
