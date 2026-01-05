const express = require('express');                 // backend framework
const cors = require('cors');                       // cors allows frontend to access backend from a different domain
const products = require('./products_data.json');   // fake data of products
const fs = require('fs');                           // filesystem


const app = express();      // create express app
app.use(express.json());    // to access JSON in req.body
app.use(cors());            // to allow cross-origin requests

const port = process.env.PORT || 3000;


// ROOT ROUTE
app.get('/', (req,res) => {
    console.log(`Server running on http://localhost:${port}`);
    res.json({ 
        'message': `Hello from server.js root message!`,
        'endpoints': [
            {'get: /products/': 'returns all products'},
            {'get: /products/:id': 'returns a single product by its id'},
            {'put: /products/update/': 'updates a product name or price by its id'},
            {'post: /products/create/': 'creates a new product informing its name and price'},
            {'delete: /products/delete/': 'deletes a product by its id'}
        ]
    });
})


// ALL PRODUCTS ROUTE
app.get('/products/', (req, res) => {
  return res.json(products);
});


// SINGLE PRODUCT ROUTE
app.get('/products/:id', (req, res) => {
    // extracts ids from each product
    const products_ids_array = products.map(p => String(p.id));
    // check if requested product.id exists
    if(products_ids_array.includes(req.params.id)) {
        return res.json(products.find(product => product.id == req.params.id));
    } else {
        return res.status(404).json({ message: `No product found with this id. Status code: ${res.statusCode}` });
    }
});


// UPDATE ROUTE
app.put('/products/update/', (req, res) =>  {
    // check existance of the product with informed id
    const product_id_informed_on_body = req.body['product_id'] ?? 0;
    const product_itself = products.find(product => product.id == product_id_informed_on_body);
    if(!product_itself) {
        return res.status(400).json({ message: `Product with id ${req.body.product_id} not found. Status code: ${res.statusCode}` });
    } else {
        console.log(`product to be updated: ${JSON.stringify(product_itself)}`);
    }
    // update the product based on informed data (name or price)
    const product_new_name = req.body['name'] ?? product_itself.name;
    const product_new_price = req.body['price'] ?? product_itself.price;
    products.find(product => product.id == product_id_informed_on_body).name = product_new_name;
    products.find(product => product.id == product_id_informed_on_body).price = parseFloat(product_new_price);
    // writing the updated product
    fs.writeFileSync('./products_data.json', JSON.stringify(products));
    return res.json( {'message':'product updated' } ).status(204);
})


// CREATE ROUTE
app.post('/products/create/', (req, res) => {
    // check existance of name and price
    if(req.body.name === undefined || req.body.price === undefined) {
        return res.status(400).json({ message: `Product name and price are required. Status code: ${res.statusCode}` });
    }
    // create new product obj
    const products_ids = products.map(product => product.id);
    const new_product_id = Math.max(...products_ids) + 1;
    const new_product = {
        id: new_product_id,
        name: req.body.name,
        price: parseFloat(req.body.price)
    }
    // write new product
    products.push(new_product);
    fs.writeFileSync('./products_data.json', JSON.stringify(products));
    return res.json( {'message':'product created' } ).status(201);
})


// DELETE ROUTE
app.delete('/products/delete/:id', (req, res) => {
    // check existance of the product with informed id
    const product_id_informed_on_body = req.params.id;
    const product_itself = products.find(product => product.id == product_id_informed_on_body);
    if(!product_itself) {
        return res.status(400).json({ message: `Product with id ${product_id_informed_on_body} not found. Status code: ${res.statusCode}` });
    } else {
        console.log(`product to be deleted: ${JSON.stringify(product_itself)}`);
    }
    // delete the product
    const updated_products = products.filter(product => String(product.id) !== product_id_informed_on_body);
    // writing the remaining products
    fs.writeFileSync('./products_data.json', JSON.stringify(updated_products));
    return res.json( {'message':'product deleted' } ).status(204);
})


// throw error route
app.get('/error-route', (req, res) => {
    // change if condition to throw error (or not)
    if (res.statusCode !== 200) {
        res.json({ message: `Hello World! Listening on port ${port}` });
    } else {
        throw new Error( "Some shit happened" ); // Error, TypeError, SyntaxError, RangeError, ReferenceError, EvalError, URIError, AggregateError, etc
    }
})


app.listen(port, () => {
    console.log(`
        REST API server running on http://localhost:${port}
        Try the following endpoints:
        +--------+----------------------+-------------------------------------------------+
        | METHOD | ENDPOINT             | ABOUT                                           |
        +--------+----------------------+-------------------------------------------------+
        | GET    | /                    | root route                                      |
        | GET    | /products/           | lists all products                              |
        | GET    | /products/:id        | list a product by its id (param)                |
        | PUT    | /products/update/    | update a product name or price by its id (body) |
        | POST   | /products/create/    | create a new product informing name and price   |
        | DELETE | /products/delete/:id | deletes a product by its id (param)             |
        +--------+----------------------+-------------------------------------------------+
    `);
});
