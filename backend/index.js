require("dotenv").config();
const http = require("http")
const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const path=require("path")//1
const directory_name=path.resolve();//2
const watchTimeRouter = require("./Routes/watchTimeRouter")
const watchHistoryRouter = require("./Routes/watchHistoryRouter")
const dbUrl = process.env.dbUrl;
// console.log("This is dirname ",process.env);
console.log("This is dburl ",dbUrl);
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
    mongoose.connect("mongodb+srv://AnujKumar:MuOQh2SzwJ8NMuXn@cluster0.yh3wqfi.mongodb.net/YT_TRACKER")
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

app.use(express.static(path.join(directory_name,"/frontend/dist")));// 4 serving frontened here


//sending frontend 
app.all('/{*any}',(_,res)=>{ //_ as req is not used
  res.sendFile(path.resolve(directory_name,"frontend","dist","index.html"));
});

server.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});




