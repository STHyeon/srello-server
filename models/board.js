const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BoardSchema = new Schema({
    title: String,
    author: String,
    published_date: String,
    list: [
        {
            listTitle: String,
            author: String,
            published_date: String,
            taskIds: [
                {
                    author: String,
                    content: String,
                    published_date: String,
                },
            ],
        },
    ],
});

module.exports = mongoose.model("Board", BoardSchema);
