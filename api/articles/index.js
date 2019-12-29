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
};
