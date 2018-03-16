const mongoose = require('mongoose');
//const URLSlugs = require('mongoose-url-slugs');
const Schema  = mongoose.Schema;

const CommentSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref:'users'
    },

    post: {
        type: Schema.Types.ObjectId,
        ref:'posts'
    },
    body:{
        type: String,
        required: true
    },
    approveComment:{
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('comments', CommentSchema);