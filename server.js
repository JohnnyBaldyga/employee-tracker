// DEPENDENCIES
const express = require('express');
const { Pool } = require('pg');

// APP/PORT
const PORT = process.env.PORT || 3001;
const app = express();

// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// DATA
const pool = new Pool({
    user: 'postgres',
    password: 'jALDYGA7',
    host: 'localhost',
    database: 'business_db'
  });
  pool.connect();

//   ROUTES
app.get('/departments', (req, res) => {
    pool.query('SELECT * FROM department;', [])
      .then(result => res.json(result.rows))
      .catch(error => res.status(500).json({ error: 'Internal server error' }));
  });
  
  
  app.post('/departments', (req, res) => {
    const { name } = req.body;
    pool.query('INSERT INTO department (name) VALUES ($1);', [name])
      .then(() => res.send('Department added successfully.'))
      .catch(error => res.status(500).json({ error: 'Internal server error' }));
  });
  
  
  app.put('/employees/:id/role', (req, res) => {
    const { role_id } = req.body;
    const { id } = req.params;
    pool.query('UPDATE employee SET role_id = $1 WHERE id = $2;', [role_id, id])
      .then(() => res.send('Employee role updated successfully.'))
      .catch(error => res.status(500).json({ error: 'Internal server error' }));
  });
   
  // View all roles
app.get('/roles', (req, res) => {
    pool.query('SELECT r.title, r.salary, d.name AS department FROM role r INNER JOIN department d ON r.department_id = d.id;', [])
      .then(result => res.json(result.rows))
      .catch(error => res.status(500).json({ error: 'Internal server error' }));
});

// Add a role
app.post('/roles', (req, res) => {
    const { title, salary, department_id } = req.body;
    pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3);', [title, salary, department_id])
      .then(() => res.send('Role added successfully.'))
      .catch(error => res.status(500).json({ error: 'Internal server error' }));
});

// View all employees
app.get('/employees', (req, res) => {
    pool.query('SELECT e.id, e.first_name, e.last_name, r.title AS job_title, d.name AS department, r.salary, CONCAT(m.first_name, \' \', m.last_name) AS manager FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id;', [])
      .then(result => res.json(result.rows))
      .catch(error => res.status(500).json({ error: 'Internal server error' }));
});

// Add an employee
app.post('/employees', (req, res) => {
    const { first_name, last_name, role_id, manager_id } = req.body;
    pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);', [first_name, last_name, role_id, manager_id])
      .then(() => res.send('Employee added successfully.'))
      .catch(error => res.status(500).json({ error: 'Internal server error' }));
});

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });