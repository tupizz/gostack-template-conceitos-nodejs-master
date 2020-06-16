const express = require('express');
const cors = require('cors');

const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.status(200).json(repositories);
});

app.post('/repositories', (request, response) => {
  const { url, title, techs } = request.body;

  const newRepository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0,
  };

  repositories.push(newRepository);

  return response.status(201).json(newRepository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;

  // Find the index of the desired repository for update
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({
      error: {
        message: "The repository referenced doesn't exist",
      },
    });
  }

  // Get the repository and change it by its reference
  let repository = repositories[repositoryIndex];

  const { url, title, techs } = request.body;

  // Changing the reference object in repository array
  repository = {
    ...repository,
    url,
    title,
    techs,
  };

  return response.status(200).json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({
      error: {
        message: "The repository referenced doesn't exist",
      },
    });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json({});
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({
      error: {
        message: "The repository referenced doesn't exist",
      },
    });
  }

  // Get the repository and change it by its reference
  let repository = repositories[repositoryIndex];

  repository.likes += 1;

  return response.status(200).json(repository);
});

module.exports = app;
