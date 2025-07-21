const validateRegister = (req, res, next) => {
    const { email, password, fullname } = req.body;

    // Check required fields
    if (!email || !password || !fullname) {
        return res.status(400).json({
            error: 'Missing required fields: email, password, fullname'
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: 'Invalid email format'
        });
    }


    if (password.length < 6) {
        return res.status(400).json({
            error: 'Password must be at least 6 characters long'
        });
    }

    // Validate fullname
    if (fullname.trim().length < 2) {
        return res.status(400).json({
            error: 'Full name must be at least 2 characters long'
        });
    }

    next();
};

module.exports = validateRegister;