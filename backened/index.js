//yt_category_manager-->categoryvideos
//categorywatchtimes
require("dotenv").config();
const http = require("http")
const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');

const watchTimeRouter = require("./Routes/watchTimeRouter")
const watchHistoryRouter = require("./Routes/watchHistoryRouter")
const dbUrl = process.env.dbUrl;
const cors = require('cors');
const { Server } = require("socket.io")
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});
app.use(cors());
app.use(express.json());

async function main() {
  try {
    mongoose.connect(dbUrl)
    console.log("Db Connected!");
  }
  catch (err) {
    console.log(err);
  }
}
main();


io.on("connection", (socket) => {
  console.log("A new socket connected");
  socket.on("disconnect", () => console.log("A user disconnected "));
})


app.use('/watchtime', watchTimeRouter(io));
app.use("/watchhistory", watchHistoryRouter);


server.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});




