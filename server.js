const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortURL')

mongoose.connect('mongodb://localhost/urlShortener', {
	useNewUrlParser : true,
	useUnifiedTopology: true
})

const app = express();

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: false}))

app.get("/", async (req,res)=>{
	const shortURLs = await ShortUrl.find();
	res.render("index", {shortURLs : shortURLs});
})

app.post("/shortURLs", async (req,res)=>{
	await ShortUrl.create({full : req.body.fullURL})
	res.redirect('/')
})

app.get('/:shortURL', async (req,res) => {
	const shortUrl = await ShortUrl.findOne({short : req.params.shortUrl})

	if (shortUrl == null) {
		return res.sendStatus(404)
	}

	shortUrl.clicks++
	shortUrl.save()

	res.redirect(shortUrl.full);
})

app.listen(process.env.PORT || 5000)