const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const likeSchema = new mongoose.Schema(
    {
        userId: {
            required: true,
            type: ObjectId,
            ref: 'User'
        },
        likedID: {
            required: true,
            type: ObjectId,
            ref: 'User'
        },
        postId:{
            required: true,
            type: ObjectId,
            ref: 'Post'
        },
        isDeleted: {
            type: Boolean,
            default: false

        }

    },
    { timestamps: true }
);

module.exports = mongoose.model("like", likeSchema)