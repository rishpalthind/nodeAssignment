// app.js
import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from './connection/connection.js';
import { createServer } from 'http';
import userRoute from './routes/userRoutes.js';
import encryptRoute from './routes/encryptRoute.js';
import { socketConnect } from './connection/socketConnection.js';
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', userRoute)
app.use('/api', encryptRoute)

sequelize.sync({ force: true }).then(() => {
  console.log('Database synced');
  // Start the server
    httpServer.listen(PORT, async () => {
      console.log(`Server is running on port ${PORT}`);
     // Set up socket.io connection
      await socketConnect(httpServer);
    });
});
