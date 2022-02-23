const express = require('express');
const app = express();

app.use(express.json());

app.get("/courses", (request, response) => {
    const queryParams = request.query;
    console.log(queryParams);
    return;
});

app.post("/courses", (request, response) => {
    const body = request.body;
    console.log(body);
});

app.put("/courses/:id", (request, response) => {
    const { id } = request.params;
    console.log(id);
    return response.json(["five", "two", "three", "four"]);
});

app.patch("/courses/:id", (request, response) => {
    return response.json(["five", "two", "three", "six"]);
});

app.delete("/courses/:id", (request, response) => {
    return response.json(["five", "two", "six"]);
})

app.listen(3333, () => console.log("server running on port: 3333"));