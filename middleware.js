const isAdmin = (req, res, next) => {
    const { role } = req.body; 
    if (role !== 'admin') {
        return res.status(403).send("Access denied. Admins only.");
    } 
    next(); 
};

module.exports = { isAdmin };