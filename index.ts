import express from 'express'
import  {Request, Response} from 'express';


const app = express();
const port = 8000;

app.get('/', (req: Request, res: Response) => {
    res.send('Work');
})

app.listen(port, () => {
    console.log("Server running on port " + port);
});