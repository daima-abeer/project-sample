const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "proj"
})

const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set('views', path.join(__dirname, 'template'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'assets')))
async function getProducts() {
    const q = "SELECT * FROM products";
    return new Promise((resolve, reject) => {
        con.query(q, (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

async function updateProduct(values) {
    const q = `UPDATE products SET name="${values.name}", price="${values.price}" WHERE id=${values.id}`;
    return new Promise((resolve, reject) => {
        con.query(q, (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

async function deleteProduct(id) {
    const q = `DELETE FROM products WHERE id=${id}`;
    return new Promise((resolve, reject) => {
        con.query(q, (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

async function createProduct(val) {
    const q = `INSERT INTO products(name, rating, thumbnail, price) VALUES ('${val.name}', '0', '${val.img}', '${val.price}');`;
    return new Promise((resolve, reject) => {
        con.query(q, (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

app.get('/', async (req, res) => {
    const p = await getProducts();
    res.render('index', {products: p});
});

app.get('/admin', async (req, res) => {
    const p = await getProducts();
    res.render('admin', {products: p});
})

app.post('/admin', urlencodedParser, async function (req, res) {
    if (req.body.type === 'update') {
        const result = await updateProduct({
            id: req.body.id,
            name: req.body.name,
            price: req.body.price
        });
    } else if (req.body.type === 'delete') {
        const result = await deleteProduct(req.body.id)
    } else {
        const result = await createProduct(req.body)
    }
    const p = await getProducts();
    res.render('admin', {products: p});
});

app.get('*', function(req, res){
    res.status(404).send('Error: 404 Page Not Found');
});

const server = app.listen(3000, () => {
    console.log(`The application started on port ${server.address().port}`);
});