This API allows access to apprenticeship coins and their linked duties.

Users can:

- [x] Fetch a list of all coins `GET /coins`
- [x] Fetch an individual coin with linked duties `GET /coins/:id`
- [x] Add a new coin `POST /coins`
    - [x] Prevent adding a coin with a duplicated name
- [x] Update an existing coin `PATCH /coins/:id`
- [ ] Delete a coin `DELETE /coins/:id`

Run the test data database container:

```
npm run up
```

Run the tests:

```
npm test
```

Check the code coverage:

```
npm run coverage
```