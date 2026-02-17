import express from 'express'
import productsRouter from "./routes/products";
import fileDb from "./fileDb";

const app = express();
const port = 8000;

app.use(express.json());

app.use('/products', productsRouter);

app.get('/:message', (req: express.Request, res: express.Response) => {
    res.send(req.params.message);
});

const Vigenere = require('caesar-salad').Vigenere;
const password = 123;

app.get('/encode/:message', (req: express.Request, res: express.Response) => {
    const message = Vigenere.Cipher(password).crypt(req.params.message);
    res.send(message);
});

app.get('/decode/:secretMessage', (req: express.Request, res: express.Response) => {
    const message = Vigenere.Decipher(password).crypt(req.params.secretMessage);
    res.send(message);
});


const run = async () => {
    await fileDb.init();

    app.listen(port, () => {
        console.log("Server running on port " + port);
    });
};

run().catch((err) => console.error(err));

