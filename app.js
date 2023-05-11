import express, { application } from 'express'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import connection from './config/dbConnection.js'
import userRouter from './routes/user.js'
import adminRouter from './routes/admin.js'
import ownerRouter from './routes/owner.js'
import messageRouter from './routes/message.js'
import cors from 'cors'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
dotenv.config() 
const app = express();

const corsOptions = {
    origin: ["https://master.d1qij60nvo1j8a.amplifyapp.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: "Content-Type,Authorization",
    optionsSuccessStatus: 200,
  };
  
app.use(cors(corsOptions));
 
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true,limit:"50mb"}))
app.use(bodyParser.json({limit:"50mb"}))
app.use(express.json({limit:"50mb"}))
app.use(express.urlencoded({limit:"50mb",extended:true,parameterLimit:50000}))
app.use(logger('dev'))
connection()

app.use('/admin',adminRouter)
app.use('/',userRouter)
app.use('/owner',ownerRouter)
app.use('/message',messageRouter)

const server = app.listen(3000,()=>{
    console.log('server connected to port 3000');
})

const io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });


  global.onlineUsers = new Map();

  io.on('connection', (socket) => { 
    global.chatSocket = socket
    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id)
    });

    socket.on('send-msg', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        console.log(sendUserSocket,"bingo");
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-recieve', data.msg);
        }
    });
});