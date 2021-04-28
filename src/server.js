const Express = require('express');
const app = Express();

const clientAppDirectory = path.join(__dirname, '../public', 'build');

app.use(Express.json());
app.use(Express.static(clientAppDirectory));

const port = process.env.PORT || 4100;
app.listen(port, () => console.log(`Server has started on localhost:${port}`));