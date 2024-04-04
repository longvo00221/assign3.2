import express from "express";
import cors from "cors";
import 'dotenv/config.js'
import path from 'path';
import routes from './routes/index.js';
import connectDb from './mongodbConn/MongodbConnection.js';
const PORT = process.env.PORT || 8000;

const app = express();
connectDb()
app.use(cors());
app.use(express.json());
app.use("/api", routes);
app.use(express.static(path.join(path.resolve(), 'public')));

app.get("/", (req, res) => {
  res.sendFile('index.html');
});
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
