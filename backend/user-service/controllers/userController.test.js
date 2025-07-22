const userController = require('./userController');
const User = require('../models/User');

jest.mock('../models/User');

describe('userController.createUser', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: { email: 'test@example.com', password: '123456', fullname: 'Test User' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should create a new user and return user info', async () => {
        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue({
            id: 1,
            email: 'test@example.com',
            fullname: 'Test User'
        });

        await userController.createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            id: 1,
            email: 'test@example.com',
            fullname: 'Test User'
        });
    });

    it('should return 409 if user exists', async () => {
        User.findOne.mockResolvedValue({ id: 1 });

        await userController.createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ message: 'An account with this email already exists.' });
    });

    it('should handle server error', async () => {
        User.findOne.mockRejectedValue(new Error('DB error'));

        await userController.createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Failed to create user due to a server error.' });
    });
});

describe('userController.getUserByEmail', () => {
    let req, res;

    beforeEach(() => {
        req = { params: { email: 'test@example.com' } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should return user if found', async () => {
        User.findOne.mockResolvedValue({ id: 1, email: 'test@example.com', fullname: 'Test User' });

        await userController.getUserByEmail(req, res);

        expect(res.json).toHaveBeenCalledWith({ id: 1, email: 'test@example.com', fullname: 'Test User' });
    });

    it('should return 404 if user not found', async () => {
        User.findOne.mockResolvedValue(null);

        await userController.getUserByEmail(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle server error', async () => {
        User.findOne.mockRejectedValue(new Error('DB error'));

        await userController.getUserByEmail(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to get user' });
    });
});