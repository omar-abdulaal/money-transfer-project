export const authValidation = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required. Please log in.'
        });
    }
    next();
};