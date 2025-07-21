const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
    // Auth APIs
    static async login(credentials) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    }

    static async register(userData) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error('Registration failed');
        return response.json();
    }

    // Topic APIs
    static async getAllTopics() {
        const response = await fetch(`${API_BASE_URL}/topics`);
        if (!response.ok) throw new Error('Failed to fetch topics');
        return response.json();
    }

    static async getTopicById(id) {
        const response = await fetch(`${API_BASE_URL}/topics/${id}`);
        if (!response.ok) throw new Error('Failed to fetch topic');
        return response.json();
    }

    // Word APIs
    static async getWordsByTopic(topicId) {
        const response = await fetch(`${API_BASE_URL}/words/topic/${topicId}`);
        if (!response.ok) throw new Error('Failed to fetch words');
        return response.json();
    }

    static async searchWords(query, type = 'all') {
        const response = await fetch(`${API_BASE_URL}/words/search?q=${encodeURIComponent(query)}&type=${type}`);
        if (!response.ok) throw new Error('Search failed');
        return response.json();
    }

    // Test APIs
    static async getAllTests() {
        const response = await fetch(`${API_BASE_URL}/tests`);
        if (!response.ok) throw new Error('Failed to fetch tests');
        return response.json();
    }

    static async getTestQuestions(testId) {
        const response = await fetch(`${API_BASE_URL}/tests/${testId}`);
        if (!response.ok) throw new Error('Failed to fetch test questions');
        return response.json();
    }

    static async submitTest(testData) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/results`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(testData)
        });
        if (!response.ok) throw new Error('Failed to submit test');
        return response.json();
    }

    // User Profile API
    static async getUserProfile() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        return response.json();
    }
}

export default ApiService;