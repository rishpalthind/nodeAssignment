import {Server} from 'socket.io';
import userSocketController from '../controller/userSocketController.js';
async function socketConnect(http_server){

  console.log("socket connection called");
    return new Promise((resolve)=>{
        var io= new Server(http_server, {
            cors: {
              origin: "*",
            }
          });
        io.on('connection', (socket) => {
          const userId = socket.handshake.query?.userId;
          if (!userId) return;
          userSocketController(io, socket);
          resolve(); // Resolve here only after a client connects
        });
    })
} 

export { socketConnect };



