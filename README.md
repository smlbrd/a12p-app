# Apprenticeship Coin API

This is a RESTful API designed to manage apprenticeship coins and their associated duties.

## Features

This API supports full CRUD (Create, Read, Update, Delete) operations for coins:

- List all available coins: `GET /coins`
- Get details of a specific coin: `GET /coins/:id`
    - Includes any linked duties
- Create a coin: `POST /coins`
    - Note: Validation prevents duplicate coin names.
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

### Running the project

The project uses a Docker container to manage the database for testing and local development. Run the test database
container:

```bash
npm run up
```

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

Check the code coverage:

```bash
npm run coverage
```