import express from 'express';
import { MongoClient } from 'mongodb';
// localhost:3000/article/learn-node
    // let articlesInfo = [{
    //     name: 'learn-react',
    //     upvotes: 0,
    //     comments: [],
    // },{
    //     name: 'learn-node',
    //     upvotes: 0,
    //     comments: [],
    // },{
    //     name: 'mongodb',
    //     upvotes: 0,
    //     comments: [],
    // }]; 
const app = express();
app.use(express.json()); 

// app.post('/hello', (req, res) => {
//     console.log(req.body);
//     res.send(`Hello ${req.body.name}!`);
// });

// app.get('/hello/:name', (req, res) => {
//     console.log(req.params);
//     const { name } = req.params;
//     res.send(`Hello ${name}!!`);
// })
app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect()
    const db = client.db('react-blog-db'); // use react-blog-db

    const article = await db.collection('articles').findOne({ name });

    if (article)
        res.json(article);
    else 
        res.sendStatus(404).send('Article not found!');
});

app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;
    // const article = articlesInfo.find(a => a.name === name);
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();
    const db = client.db('react-blog-db');

    await db.collection('articles').updateOne({ name }, {
        $inc: { upvotes: 1 },
        //$set: { updates: 100 }
    });

    const article = await db.collection('articles').findOne({name});

    if (article) {
        res.send(`The ${name} article now has ${article.upvotes} upvotes!!!`);
    } else {
        res.send('That article doesn\'t exist');
    }
});

app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params;
    const { postedBy, text } = req.body;
    // const article = articlesInfo.find(a => a.name === name);

    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();
    const db = client.db('react-blog-db');

    await db.collection('articles').updateOne({ name }, {
        $push: { comments: { postedBy, text} },
    });

    const article = await db.collection('articles').findOne({ name });

    if (article) {
        res.send(article.comments);
    } else {
        res.send('That article doesn\'t exist');
    }
});

app.listen(8000, () => {
    console.log('Server is listening on port 8000');
    // http://localhost:8000/hello
});
