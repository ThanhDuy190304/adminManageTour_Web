const express = require('express');
const app = express();

app.get('/admin', (req, res) => {
    res.send('Welcome to Admin Dashboard!');
});

app.listen(3001, () => {
    console.log('Admin app running on http://localhost:3001');
});
