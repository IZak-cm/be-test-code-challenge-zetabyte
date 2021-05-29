const express =  require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors")
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors())

const uri = "mongodb+srv://Izamei1511:izak1511@cluster0.2pigi.mongodb.net/blogdb?retryWrites=true&w=majority"

// make connection
try{
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}), () => console.log("Connected")
} catch (error) {
    console.log("Failed to connect")
};

// model
const commentSchema = mongoose.Schema({
    name: String,
    textComment: String
  })
  const commentModel = mongoose.model('comment', commentSchema)
  
  const articleSchema = mongoose.Schema({
    title: String,
    content: String,
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: commentModel
    }]
  });
  const articleModel = mongoose.model('article', articleSchema);

// Article routes
  app.post("/articles", async (req, res) => {
    const title = req.body.title
    const content =  req.body.content

	const newArticle = new articleModel({title, content})
	await newArticle.save()
	res.send({
        status: 200,
        message: "Success create an article",
        data: newArticle
    })
})
  
// Comment routes
app.post("/articles/:articleId/comments", async (req, res) => {
    const name = req.body.name
    const textComment =  req.body.textComment
    let id = mongoose.Types.ObjectId(req.params.articleId);

    const article = await articleModel.findOne({_id: id})

    const newComment = new commentModel({name, textComment})
    await newComment.save()


	// const newComment = new commentModel({name, textComment})
	// await newComment.save()
    // const article = await articleModel.findOne({_id: req.params.articleId});

    article.comments.push(newComment);
    await article.save();

	res.send({
        status: 200,
        message: "Success create a comment",
        data: newComment
    })
})

app.get("/", (req, res) => {
    res.send("Welcome to IzBlog!")
})

app.listen(3000, () => {
    console.log("Server run on PORT 3000!")
});

