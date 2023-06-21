const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const app = express();
const body = app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wikiDB",{ useNewUrlParser:true});
    const articleSchema = new mongoose.Schema({
        title: String,
        content: String
    });

    const Article = mongoose.model("Article", articleSchema);

    /////this is where we target all the articles ///
    app.route('/articles')
    .get(async (req, res) => {
        const data = await Article.find({});
        res.send(data);
        })
    .post((req, res) => {
            const title = req.body.title;
            const content = req.body.content;
            const article = new Article({
                title: title,
                content: content
            });
            article.save().then(res.send("that craze was succesfull ya")).catch(function(err){
                res.send(err);
            });
        })
    .delete(async (req, res) => {
                await Article.deleteMany({}).then(res.send("succesfull deleted everything ")).catch(err => {
                res.send(err)
            });
        });

   /////Here we target a single article /////
   app.route("/articles/:articleTitle")
   .get(async (req,res) => {
        const parameters = req.params.articleTitle;
        await Article.findOne({title: parameters}).then(result => {
            res.send(result);
        }).catch(err => {
            res.send(err);
        })

   })
   .put(async (req,res) => {
        const resp = await Article.replaceOne({title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},{ overwrite: true })
        if (resp.acknowledged == true){
            res.send("update was successfull")
        }
   })
   .patch(async (req,res) => {
        const resp = await Article.updateOne({title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content})
        if (resp.acknowledged == true){
            res.send("update was successfull")
        }
   })
   .delete(async (req,res) => {
        await Article.deleteOne({title: req.params.articleTitle}).then(res.send("Delete was successfull")).catch(err => {
            res.send(err)
        })
   })

};
main().catch(console.dir)


app.listen(3000, function(){
    console.log("server is runnig on this port")
});