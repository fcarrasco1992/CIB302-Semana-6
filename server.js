require('dotenv').config();
const express = require('express');
const { auth } = require('express-oauth2-jwt-bearer');
const app = express();
const port = process.env.PORT || 3000;

const checkJwt = auth({
  audience: 'https://dev-qaoeyz8r8w361i38.us.auth0.com/api/v2/',
  issuerBaseURL: `https://dev-qaoeyz8r8w361i38.us.auth0.com/`,
});

app.use(express.static('public'));

app.get('/api/productos', checkJwt, (req, res) => {
  res.json({ mensaje: "Esta es información protegida de productos" });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});