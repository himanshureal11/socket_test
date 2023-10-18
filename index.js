const express =  require('express')
const cors = require('cors')
const IOSocket = require('socket.io')
const app = express();

app.use(cors())
app.use(express.json())

app.use((req,res,next)=>{
    const time1 =new Date()
    const request = `${req.method}|${req.originalUrl}`
    res.on('finish' ,()=>{
        console.log(`${request} | ${new Date() - time1}ms |`,res.statusCode, new Date() )
    })
    next()
})

const listen = () => {
    try {
        const server = app.listen(8080, () => {
            console.log('Server is running on port 8080');
        });
        global.socketIO = IOSocket(server, {
            transports: ['websocket','polling'],
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                allowedHeaders: ["*"]
              }
            
        });
        global.socketIO.on('connection', (socket) => {
            socket.on('test-data',(message, arg2) => {
                global.socketIO.sockets.emit(message, arg2);
            });
        });
    } catch (error) {
        console.log("Error:", error);
    }
};

listen();