const express = require("express");
const app = express();
const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");
const { open } = sqlite;
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");
app.use(express.json());
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at https://localhost:3000/");
    });
  } catch (err) {
    console.log(`DB Error : ${err.message}`);
  }
};

initializeDBAndServer();

app.get("/movies/", async (request, response) => {
  let reqQuery = `select * from movie;`;
  let res = await db.all(reqQuery);
  response.send(res);
});

// post api

app.post("/movies/", async (request, response) => {
  let { directorId, movieName, leadActor } = request.body;
  let createQuery = `insert into movie(director_id,movie_name,lead_actor) values(${directorId},'${movieName}','${leadActor}')`;
  const res = await db.run(createQuery);
  console.log(res);
  response.send("Movie Successfully Added");
});

// get movie api

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getQuery = `select * from movie where movie_id=${movieId}`;
  const res = await db.get(getQuery);
  response.send(res);
});

//put api

app.put("/movies/:movieId", async (request, response) => {
  let { directorId, movieName, leadActor } = request.body;
  let { movieId } = request.params;
  let updateQuery = `update movie set director_id=${directorId},movie_name='${movieName}',lead_actor='${leadActor}' where movie_id=${movieId}`;
  const res = await db.run(updateQuery);
  console.log(res);
  response.send("Movie Successfully Updated");
});
