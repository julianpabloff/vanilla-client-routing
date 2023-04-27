const express = require('express');
const app = express();

app.use(express.static(`${__dirname}/app`));

app.get('/*', (request, response) => {
	response.sendFile(`${__dirname}/app/index.html`);
});

app.listen(8000, () => console.log('Server at http://localhost:8000/'));
