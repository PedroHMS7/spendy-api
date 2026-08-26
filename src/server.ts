import 'dotenv/config'
import app = require('./app')

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
    console.log(`API rodando na porta ${port}`);
});