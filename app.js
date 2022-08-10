const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
    title: String,
    content: String,
};

const Article = mongoose.model("Article", articleSchema);


/////////////////////////Request Targeting All Article//////////////////////////////////

app.route("/articles")

.get(function(req, res) {
    Article.find(function(err, foundArticles) {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
        res.send(foundArticles);
    });
})

.post(function(req, res) {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err) {
        if (!err) {
            res.send("Sucessfully added a new article");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res) {
    Article.deleteMany(function(err) {
        if (!err) {
            res.send("Successfully deleted the article");
        } else {
            res.send(err);
        }
    });
});

/////////////////////////Request Targeting A Specific Article//////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res) {
    Article.findOne({ title: req.params.articleTitle }, function(err, foundArticle) {
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("not found");
        }
    });
})

.put(function(req, res) {
    //////updateOne() depricated so we using replaceOne()
    Article.replaceOne({ title: req.params.articleTitle }, { title: req.body.title, content: req.body.content }, { overwrite: true },
        function(err) {
            if (!err) {
                res.send("Successfully updated the article");
            } else {
                res.send("Fail");
            }
        }
    );
})

.patch(function(req, res) {
    Article.updateOne({ title: req.params.articleTitle }, { $set: req.body },
        function(err) {
            if (!err) {
                res.send("Sucessfully updated");
            } else {
                res.send(err);
            }
        }
    );
})

.delete(function(req, res) {
    Article.deleteOne({ title: req.params.articleTitle },

        function(err) {
            if (!err) {
                res.send("Sucessfull Deleted the Article");
            } else {
                res.send(err);
            }
        });
});



app.listen(3000, function() {
    console.log("Server started on port 3000");
});