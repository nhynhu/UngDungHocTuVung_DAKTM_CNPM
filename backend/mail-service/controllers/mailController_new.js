exports.healthCheck = (req, res) => {
    res.json({
        service: 'mail-service',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
};
