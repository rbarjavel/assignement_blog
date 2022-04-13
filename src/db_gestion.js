var mongoose = require('mongoose');
var uuid = require('uuid')
const url = 'mongodb+srv://barja:barja&*01@assignement.kskem.mongodb.net/Assignement'
var db = mongoose.connection;
var templates = require("./blog_post.js")
var hash = require("./hashing.js")

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connection Successful!");
});

const db_connect = () => {
    console.log('Connecting to db');
    mongoose.connect(url);
}

const add_post = (p) => {
    var post = new templates.PostMod({
        Title: p.title,
        Content: p.content,
        UserId: p.userid,

        Guid: uuid.v4()
    })

    post.save((err, post) => {
        if (err) return console.error(err)
        console.log(`${post.Guid} as been saved in db`)
    })
}

const add_user = (u) => {
    const user = new templates.UserMod({
        Username: u.username,
        Password: hash(u.password),

        Guid: uuid.v4()
    })

    user.save((err, post) => {
        if (err) return console.error(err)
        console.log(`${post.Guid} as been saved in db`)
    })
}

const get_user_by_login = async (u) => {
    const user = await templates.UserMod.findOne({
        Username: u.username,
        Password: hash(u.password),
    })
    
    if (user) return (user.Guid)
    else return (false)
}

const get_user_by_id = async (id) => {
    const user = await templates.UserMod.findOne({Guid: id})

    return (user)
}

const get_all_posts_from_db = async () => {
    const posts = await templates.PostMod.find()

    return (posts)
}

const get_post_by_id = async (id) => {
    const post = await templates.PostMod.findOne({Guid: id})

    return (post)
}

const modify_post = async (post) => {
    await templates.PostMod.updateOne({Guid: post.Guid},
        {
            Title: post.Title,
            Content: post.Content
        })
}

// Template to acess db functions
const db_template = {
    db_connect,

    add_post,
    get_all_posts_from_db,
    get_post_by_id,
    modify_post,

    add_user,
    get_user_by_id,
    get_user_by_login
}

module.exports = db_template
