const express = require('express');
const { v4: uuidV4 } = require('uuid');

const app = express();
app.use(express.json());

const customers = [];

const verifyIfAccountExistsByCPF = function(request, response, next) {
    const { cpf } = request.headers || request.header;
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

    customers.push({ 
        id: uuidV4(), 
        cpf, 
        name, 
        statement: [] }
    );

    return response.status(201).send();
});

app.use(verifyIfAccountExistsByCPF);

app.get("/statement", (request, response) => {
    const { customer } = request;
    return response.json(customer.statement);
});

app.post("/deposit", (request, response) => {
    const { customer } = request;
    const { description, amount, type } = request.body;

    const opetation = {
        description,
        amount,
        created_at: new Date(),
        type
    };

    customer.statement.push(opetation);

    return response.status(201).send();
});

app.get("/statement/date", (request, response) => {
    const { customer } = request;
    const { date } = request.query;
    const formatDate = new Date(date + " 00:00");
    const statement = customer.statement.filter(sta => sta.created_at.toDateString() === new Date(formatDate).toDateString());

    return response.json(statement);
});

app.get("/account", (request, response) => {
    const { customer } = request;
    return response.json(customer);
});

app.put("/account", (request, response) => {
    const { customer } = request;
    const { name } = request.body;
    customer.name = name;
    return response.status(202).send();
});

app.delete("/account", (request, response) => {
    const { customer } = request;
    customers.splice(customer, 1);
    return response.status(202).send();
});

app.listen(3000);