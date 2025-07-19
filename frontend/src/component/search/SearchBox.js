import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { performSearch } from '../../data/searchData';
import SearchItem from './SearchItem';

const SearchBox = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    // Hàm tìm kiếm
    const handleSearch = (query) => {
        setSearchQuery(query);
        
        if (query.trim() === '') {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        const results = performSearch(query);
        setSearchResults(results.slice(0, 8)); // Giới hạn 8 kết quả
        setShowResults(true);
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
            navigate('/topics');
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
                        <SearchItem 
                            key={index}
                            result={result}
                            onClick={handleSelectResult}
                        />
                    ))}
                </div>
            )}

            {/* Thông báo không có kết quả */}
            {showResults && searchResults.length === 0 && searchQuery.trim() && (
                <div className="search-dropdown">
                    <div className="search-no-result">
                        <i className="bi bi-search"></i>
                        <span>Not found "{searchQuery}"</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBox;
