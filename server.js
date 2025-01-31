import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());


app.get('/', (req, res) => {
    res.status(200).json({
        "email": "tobbey.adesanya@gmail.com",
        "current_datetime": new Date().toISOString(),
        "github_url": "https://github.com/theChosenDevop/HNG_Backend",
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});