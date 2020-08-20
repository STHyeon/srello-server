import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BoardSchema = new Schema({
    title: String,
    author: String,
    published_date: { type: Date, default: Date.now },
    list: [
        {
            listTitle: String,
            author: String,
            taskIds: [
                {
                    author: String,
                    content: String,
                    published_date: { type: Date, default: Date.now },
                },
            ],
        },
    ],
});

export default mongoose.model("Board", BoardSchema);
