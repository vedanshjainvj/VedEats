
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

// --------------- Importing Other Files ---------------
import connectDB from './db/connectDB';
import MainRouter from './routes/main.route';
import { initSocketIO } from './utilities/socket';
import { corsOptions } from './constants/constants';


const app = express();
dotenv.config();
const httpServer = createServer(app);

// --------------- MIDDLEWARES ---------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors(corsOptions));

// --------------- GLOBAL VARIABLES ---------------
const DIRNAME = path.resolve();

// --------------- ROUTES ---------------
app.use('/api/v1', MainRouter);

// --------------- SOCKET.IO CONNECTION HANDLING ---------------
initSocketIO(httpServer);

app.use(express.static(path.join(DIRNAME, '/client/dist')));
app.use("*", (_,res) => {
    res.sendFile(path.resolve(DIRNAME, "client", "dist", "index.html"));
})

// --------------- SERVER ---------------
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
})