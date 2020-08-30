const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", isId, (request, response) => {
  const { id, repositoryIndex } = request.dados;
  const { title, url, techs } = request.body;
  const { likes } = repositories[repositoryIndex];
  
  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", isId, (request, response) => {
  const { repositoryIndex } = request.dados;
  repositories.splice(repositoryIndex, 1);
  
  return response.status(204).send();

});

app.post("/repositories/:id/like", isId, (request, response) => {
  const { repositoryIndex } = request.dados;
  
  const repository = repositories[repositoryIndex];

  repository.likes++;
  
  return response.status(200).json(repository);

});

function isId(request, response, next) {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryIndex < 0) {
    return response.status(400).json({error: "Repository not found"});
  }

  request.dados = {id, repositoryIndex};

  return next();
}

module.exports = app;
