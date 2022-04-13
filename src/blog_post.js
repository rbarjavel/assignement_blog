var mongoose = require('mongoose');

var Post = mongoose.Schema({
    Title: String,
    Content: String,
    UserId: String,

    Guid: String
});

var User = mongoose.Schema({
    Username: String,
    Password: String,

    Guid: String
});

var PostMod = mongoose.model('Post', Post)
var UserMod = mongoose.model('User', User)

const post_templates = {
    PostMod,
    UserMod
}

module.exports = post_templates
