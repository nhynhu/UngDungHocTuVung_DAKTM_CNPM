const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// LẤY TOKEN
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// SỬA LỖI: Improved error handling
const makeRequest = async (endpoint, method = 'GET', body = null) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const controller = new AbortController();
    // SỬA LỖI: Tăng timeout lên 30 giây để cho backend có thời gian khởi động
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
        console.log(`🌐 API ${method} Request:`, url, body ? { body } : '');

        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(getAuthToken() && { 'Authorization': `Bearer ${getAuthToken()}` })
            },
            signal: controller.signal
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(url, config);
        clearTimeout(timeoutId);

        // SỬA LỖI: Xử lý trường hợp response không phải JSON (ví dụ: lỗi 5xx trả về HTML)
        const contentType = response.headers.get("content-type");
        if (!response.ok) {
            let errorData = { message: `Request failed with status ${response.status}` };
            if (contentType && contentType.indexOf("application/json") !== -1) {
                errorData = await response.json();
            }
            throw new Error(errorData.message || `An unexpected error occurred.`);
        }

        // Nếu không có content thì trả về object rỗng
        if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
            return {};
        }

        return await response.json();

    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            console.error('❌ API Request timeout');
            throw new Error('Server is taking too long to respond. This might happen on the first start. Please try again.');
        }

        console.error('❌ API Request Failed:', error.message);
        throw error;
    }
};

// Xóa hàm handleApiError không cần thiết này
// const handleApiError = (error) => { ... };

// Tạo và export một đối tượng ApiService làm default
const ApiService = {
    // Auth
    login: (credentials) => makeRequest('/auth/login', 'POST', credentials),
    // SỬA LỖI: Sử dụng makeRequest để nhất quán và sửa lỗi 'api is not defined'
    register: (userData) => makeRequest('/auth/register', 'POST', userData),
    verify: (token) => makeRequest('/auth/verify', 'POST', { token }),

    // Topics
    getAllTopics: () => makeRequest('/topics'),
    getTopicById: (id) => makeRequest(`/topics/${id}`),

    // Words
    getWordsByTopic: (topicId) => makeRequest(`/words/topic/${topicId}`),
    searchWords: (query, type = 'all') => makeRequest(`/words/searchWords?q=${encodeURIComponent(query)}&type=${type}`),

    // Tests
    getAllTests: () => makeRequest('/tests'),
    getQuestionsByTest: (testId) => makeRequest(`/tests/${testId}`),
    submitTest: (submission) => makeRequest('/tests/submit', 'POST', submission),

    // User
    getUserHistory: (userId, token) => makeRequest(`/users/${userId}/history`, 'GET', null, token),
    getUserProfile: (userId) => makeRequest(`/users/${userId}/profile`),
    getUserTestsCount: (userId) => makeRequest(`/users/${userId}/tests/count`),
};

export default ApiService;