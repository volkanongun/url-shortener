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
	const short = await ShortUrl.find();
	res.render("index", { shortURLs : short});
})

app.post("/shortURLs", async (req,res)=>{
	await ShortUrl.create({full : req.body.fullURL})
	res.redirect('/')
})

app.get('/:shortURL', async (req,res) => {
	console.log(req.params, " REQ params")
	const s = await ShortUrl.findOne({short : req.params.shortURL})

	if (s == null) {
		return res.sendStatus(404)
	}

	s.clicks++
	s.save()

	res.redirect(s.full);
})

app.listen(process.env.PORT || 5000)