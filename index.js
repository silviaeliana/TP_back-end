import express from 'express';
import pool from './config/db.js';
import 'dotenv/config';

// Import required modules

// Create an Express app
const app = express();

const puerto = process.env.PORT || 3000;

// Enable JSON parsing for request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Read all resources
app.get('/productos', async (req, res) => {
    const sql = `SELECT productos.id_producto, productos.descripcion, productos.stock, productos.precio,
                usuarios.nombre AS nombre, usuarios.tipo_de_mascota AS mascota  
                
                FROM productos 
                JOIN usuarios ON usuarios.fk_productos = productos.id_producto
                
                ORDER By productos.precio DESC`;

    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql);
        connection.release();
        res.json(rows);

    } catch (error) {
        res.send(500).send('Internal server error')
    }

});

// Read a specific resource
app.get('/productos/:id', async (req, res) => {
    const id = req.params.id
    const sql = `SELECT productos.id_producto, productos.descripcion, productos.stock, productos.precio,
                usuarios.nombre AS nombre, usuarios.tipo_de_mascota AS mascota  
                FROM productos 
                JOIN usuarios ON usuarios.fk_productos = productos.id_producto
                WHERE productos.id_producto = ?
                ORDER By productos.precio DESC`;
    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql, [id]);
        connection.release();
        console.log("UN PRODUCTO --> ", rows)
        res.json(rows[0]);
    } catch (error) {
        res.send(500).send('Internal server error')
    }
});

// Create a new resource
app.post('/productos', async (req, res) => {

    const producto = req.body;

    const sql = `INSERT INTO productos SET ?`;

    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql, [producto]);
        connection.release();
        res.send(`
            <h1>Producto creado con id: ${rows.insertId}</h1>
        `);
    } catch (error) {
        res.send(500).send('Internal server error')
    }
});

// Update a specific resource
app.put('/productos/:id', async (req, res) => {
    const id = req.params.id;
    const producto = req.body;

    const sql = `UPDATE productos SET ? WHERE id_producto = ?`;

    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql, [producto, id]);
        connection.release();
        console.log(rows)
         res.send(`
            <h1>Producto actualizado id: ${id}</h1>
        `);
    } catch (error) {
        res.send(500).send('Internal server error')
    }

});

// Delete a specific resource
app.delete('/productos/:id', async (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM productos WHERE id_producto = ?`;

     try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql, [id]);
        connection.release();
        console.log(rows)
         res.send(`
            <h1>Producto borrado id: ${id}</h1>
        `);
    } catch (error) {
        res.send(500).send('Internal server error')
    }
});

// Start the server
app.listen(puerto, () => {
    console.log('Server started on port 3000');
});