const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:8000/api';
        this.timeout = 30000;
    }

    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;

        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        console.log('🚀 API Request:', url, config);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API Error Response:', errorText);
                throw new Error(errorText || `HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ API Success:', data);
            return data;

        } catch (error) {
            console.error('❌ API Request Failed:', error);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - server không phản hồi');
            }
            throw error;
        }
    }

    // Auth methods
    async register(userData) {
        return this.makeRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(credentials) {
        return this.makeRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    // Topics methods
    async getAllTopics() {
        return this.makeRequest('/topics');
    }

    async getTopicById(id) {
        return this.makeRequest(`/topics/${id}`);
    }

    async getWordsByTopic(topicId) {
        return this.makeRequest(`/topics/${topicId}/words`);
    }

    // Search methods
    async searchWords(query, type = 'all') {
        return this.makeRequest(`/topics/search?q=${encodeURIComponent(query)}&type=${type}`);
    }

    // Test methods
    async getAllTests() {
        return this.makeRequest('/tests');
    }

    async getTestQuestions(testId) {
        return this.makeRequest(`/tests/${testId}/questions`);
    }

    async submitTest(testData) {
        return this.makeRequest('/tests/submit', {
            method: 'POST',
            body: JSON.stringify(testData),
        });
    }
}

export default new ApiService();