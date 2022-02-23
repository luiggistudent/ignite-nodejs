const express = require('express');
const { v4: uuidV4 } = require('uuid');

const app = express();
app.use(express.json());

const customers = [];

const verifyIfAccountExistsByCPF = function(request, response, next) {
    const { cpf } = request.header;
    const customer = customers.find(customer => customer.cpf === cpf);
    
    if (!customer) {
        return response.status(400).json({ error: "Customer not found" });
    }

    request.customer = customer;
    return next();
};

app.post("/account", (request, response) => {
    const { cpf, name } = request.body;

    const customerAlreadyExists = customers.some(customer => customer.cpf === cpf);
    customerAlreadyExists ? response.status(403).json({ error: "Customer already exists" }) : false;

    customers.push({ id: uuidV4(), cpf, name, statement: [] });

    return response.status(201).send();
});

app.get("/statement", verifyIfAccountExistsByCPF, (request, response) => {
    const { customer } = request;
    return response.json(customer.statement);
});

app.listen(3000);