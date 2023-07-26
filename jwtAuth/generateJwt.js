import  jwt from "jsonwebtoken"

export const generateToken = (details)=>{
        return jwt.sign(details, process.env.TOKEN_SECRET, { expiresIn: '60d' }); 
}


 export const ownerAuthication = (req,res,next)=>{
        try {   
                const authHeader =  req.headers.authorization
                console.log(authHeader);
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
                res.locals.Id = decoded.ownerId
                console.log(res.locals.Id);
                next();
            } catch (error) {
                console.log(error);
                res.send({
                    message: 'Invalid Token'
                })
            }
}

export const userAuthication =(req,res,next)=>{
        try {   
            const authHeader =  req.headers.authorization
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            res.locals.Id = decoded.userId
                next();
            } catch (error) {
                res.send({
                    message: 'Invalid Token'
                })
            }
}

export const adminAuthication =(req,res,next)=>{
    try {   
        
        const authHeader =  req.headers.authorization
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        res.locals.Id = decoded.adminId
            next();
        } catch (error) {
            res.send({
                message: 'Invalid Token'
            })
        }
}