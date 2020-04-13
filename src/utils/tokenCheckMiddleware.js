const { verify } = require("jsonwebtoken");

const checkToken = (req, res, next) => {
    const fullToken = req.get("authorization");
    if (fullToken) {
        const token = fullToken.split(" ")[1];
        verify(token, process.env.JWT_ENCRYPTION, (err, decoded) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: "Invalid Token..."
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        res.status(401).json({
            success: 0,
            message: "Access denied"
        })
    }
}


module.exports = {
    checkToken
};