import mongoose from "mongoose";


const postSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        image: {
            type: String,
            required: true
        },

        caption: {
            type: String,
            trim: true,
            default: ""
        }
    },{
        timestamps: true
    }
)

export const Post = mongoose.model("Post", postSchema);