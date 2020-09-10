let mongoose = require('mongoose');
mongoose.connect('mongodb+srv:apiuser:abcd1234@cluster0.rcyha.mongodb.net/rest-api?retryWrites=true&w=majority')
let bodyParser = require('body-parser')
let express = require('express');
const Url = require('./urlShortener');
let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let port = process.env.PORT||8080;
let router = express.Router();

router.get('/', (req,res) => {
    res.json({message: 'Successfully connect to server'})
})

router.get('/new/*', (req,res) => {

    Url.findOne({original_url: req.params[0]}).then(doc => {
        if(doc) {
            res.json({original_url: doc['originalUrl'], short_url: doc['shortUrl']})
        }
        else{
            Url.count({}, (err, count) =>{
                if(err) throw error;
                let newUrl = new Url({
                    shortUrl: count+1,
                    originalUrl: req.params[0]
                })
            
                newUrl.save().then(doc => {
                    res.json({'original_url': req.params[0], 'shotener_url': count+1})
                }).catch(err => {
                    res.json({message: 'An error occupied'})
                })
            }).catch(err =>{
                res.json({message: "An error occupied"})
            })
        }
    })
})

router.get('/:short_url', (req,res) => {
    // Retrieving based on short url
    Url.findOne({shortUrl: req.params.short_url}).then(doc => {
        res.redirect( doc['originalUrl'])
    }).catch(err => {
        res.json({message: 'An error occured'})
    })
})

app.use('/api', router);

app.listen(port);

console.log('Magic happen at port ' + port)