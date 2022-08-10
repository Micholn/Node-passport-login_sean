const express = require("express");
const app = express();

app.set("view-engine", "ejs");

app.get("/", function(req, res){
  res.send("here we are on the port");
});



app.post("index.ejs", function(req, res) {
  res.send("index.ejs");
})


app.listen(3000, function(req, res) {
  console.log("server is running really fast")
})