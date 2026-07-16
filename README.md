# Apprenticeship Coin App

This app is designed to manage apprenticeship coins, their completion status and their associated duties.

## Features

The application allows a user to view coin progress.

## API

The API supports full CRUD (Create, Read, Update, Delete) operations for coins:

- List all available coins: `GET /coins`
- Get details of a specific coin: `GET /coins/:id`
    - Includes any linked duties
- Create a coin: `POST /coins`
    - Note: Validation prevents duplicate or malformed coin names.
- Update a coin: `PATCH /coins/:id`
    - Valid updates:
        - Name
        - Description
        - Completion Status
        - Linked Duties
- Delete a coin: `DELETE /coins/:id`

## Getting Started

### Prerequisites

[Node.js](https://nodejs.org/en) (v24, or use `nvm` with the `.nvmrc` file)

[Docker](https://www.docker.com/)

### Installation

Install dependencies:

```bash
npm install
```

Set up your environment variables by creating a `.env` file in the root directory and configuring your local database
connection parameters. See `.env.example` for examples.

### Running the project

The project uses a Docker container to manage the database for testing and local development. Run the test database
container:

```bash
npm run up
```

Before running the API or your tests for the first time (or whenever database schemas change), sync and seed your
database:

```bash
npm run db:setup:local
````

### Development

Run a local version of the API:

```bash
npm run dev
```

### Testing

Run the test suite:

```bash
npm test
```

> Note: This command will automatically run pending database migrations and seed fresh data into your Docker container
> before executing the tests:

Check the code coverage:

```bash
npm run coverage
```

### Development

Run a local version of the API:

```bash
npm run dev
```