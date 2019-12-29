module.exports = (app, mongoose) => {
    const { Schema } = mongoose;


    const articleSchema = new Schema({
        title: String,
        description: String,
        text: String
    });

    const editSchema = new Schema({
        title: String,
        user: String,
        date: { type: Date, default: Date.now },
        event: String
    });

    app.get("/api/articles", (req, res) => {
        const Article = mongoose.model("Articles", articleSchema);
        Article.find({}, (err, articles) => {
            res.send(articles);
            console.log(err);
        });
    });

    app.post("/api/create-article", (req, res) => {
        // 1 - Create model for Article & Edit
        const Article = mongoose.model("Articles", articleSchema);
        const Edit = mongoose.model("Edit", editSchema);

        // 2 - Get article info from POST request body
        const { title, description, text, user } = req.body;
        console.log(req.body);

        // 3 - Search whether article with title is already in db
        Article.find({ title }, (err, article) => {
            if (err) {
                return console.log(err);
            } else {
                console.log(article);
                if (article.length === 0) {
                    console.log("Adding");

                    // 4a - If not, generate article & edit objects
                    const newArticle = new Article({
                        title,
                        description,
                        text
                    });

                    const edit = new Edit({
                        title,
                        user: user.displayName,
                        event: "Creation"
                    });

                    // 5 - Perform save operation on db
                    newArticle.save(err => {
                        if (err) return console.log(err);
                        res.send("Added");
                    });
                    edit.save(err => {
                        if (err) return console.log(err);
                    });
                } else {

                    // 4b - If yes, send a 403
                    res.sendStatus(403);
                }
            }
        });
    });


    app.post("/api/update-article", (req, res) => {

        // 1 - Create model for Article & Edit
        const Article = mongoose.model("Articles", articleSchema);
        const Edit = mongoose.model("Edit", editSchema);

        // 2 - Get article info from POST request body
        const { id, title, description, text, user } = req.body;
        console.log(req.body);

        // 3 - Update the article by searching by its existing id
        Article.findOneAndUpdate({ _id: id }, { title, description, text }, (err, article) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {

                // 4 - Create an Edit Object & save it
                const edit = new Edit({
                    title,
                    user: user.displayName,
                    event: "Edited"
                });
                edit.save(err => {
                    if (err) return console.log(err);
                });
                res.send("Added");
            }
        });
    });

    app.get("/api/article-data", (req, res) => {
        // 1 - Create article model
        const Article = mongoose.model("Articles", articleSchema);

        // 2 - Get article id from query string
        const { id } = req.query;

        // 3 - Find & send article
        Article.find({ _id: id }, (err, article) => {
            if (err) return res.send({ success: false });
            res.send({
                success: true,
                ...article
            });
        });
    });


    app.get("/api/edit-history", (req, res) => {

        // 1 - Create Edit model using schema
        const Edit = mongoose.model("Edit", editSchema);

        // 2 - Get article id from query string
        const { id } = req.query;

        // 3 - Find & send history
        Edit.find({ title: id }, (err, article) => {
            if (err) return res.send('');
            res.send(article);
        });
    });

};
