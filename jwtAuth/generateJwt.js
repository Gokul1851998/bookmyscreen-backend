import  jwt from "jsonwebtoken"

export const generateToken = (details)=>{
        return jwt.sign(details, process.env.TOKEN_SECRET, { expiresIn: '60d' }); 
}

export const authMiddleware = (req,res,next)=>{
        try {   
                const token = req.body.jwtToken
                const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
                req.body.Id = decoded.ownerId
                next();
            } catch (error) {
                res.send({
                    message: 'Invalid Token'
                })
            }
}