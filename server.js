const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Database connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test the connection
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database');
});

// Question 1: Retrieve all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(`Error: ${err.message}`);
    }
    let output = 'Patient List:\n';
    results.forEach(patient => {
      output += `ID: ${patient.patient_id}, Name: ${patient.first_name} ${patient.last_name}, DOB: ${patient.date_of_birth}\n`;
    });
    res.send(output);
  });
});

// Question 2: Retrieve all providers
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(`Error: ${err.message}`);
    }
    let output = 'Provider List:\n';
    results.forEach(provider => {
      output += `Name: ${provider.first_name} ${provider.last_name}, Specialty: ${provider.provider_specialty}\n`;
    });
    res.send(output);
  });
});

// Question 3: Filter patients by First Name
app.get('/patients/:first_name', (req, res) => {
  const firstName = req.params.first_name;
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  db.query(query, [firstName], (err, results) => {
    if (err) {
      return res.status(500).send(`Error: ${err.message}`);
    }
    let output = `Patients with first name ${firstName}:\n`;
    results.forEach(patient => {
      output += `ID: ${patient.patient_id}, Name: ${patient.first_name} ${patient.last_name}, DOB: ${patient.date_of_birth}\n`;
    });
    res.send(output);
  });
});

// Question 4: Retrieve providers by specialty
app.get('/providers/specialty/:specialty', (req, res) => {
  const specialty = req.params.specialty;
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  db.query(query, [specialty], (err, results) => {
    if (err) {
      return res.status(500).send(`Error: ${err.message}`);
    }
    let output = `Providers with specialty ${specialty}:\n`;
    results.forEach(provider => {
      output += `Name: ${provider.first_name} ${provider.last_name}, Specialty: ${provider.provider_specialty}\n`;
    });
    res.send(output);
  });
});

// listen to the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
