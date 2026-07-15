import express from 'express'
import pg from 'pg'
const app = express()
const port = 3001
const { Pool } = pg

app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
)
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Mahasiswa',
    password: 'Nanda123', //sesuaikan dengan password postgres kalian
    port: 5432,
})

