var express = require('express');
const bodyParser = require('body-parser');
var app = express();
var db = require('./db_gestion.js')
const { get_post_by_id } = require('./db_gestion.js');
var cookieParser = require('cookie-parser');
const { redirect } = require('express/lib/response');
const router = express.Router()

app.set('view engine', 'ejs')

router.get('/', async (req, res) => {
    var user = 'anonymous'
    var authors = []
    const posts = await db.get_all_posts_from_db()

    for (element of posts) {
        if (element.UserId == "0000") authors.push("Anonymous")
        else {
            var username = await db.get_user_by_id(element.UserId)
            authors.push(username.Username)
        }
    }

    if (req.cookies.UserId) {
        user = await db.get_user_by_id(req.cookies.UserId)
        user = user.Username
    }

    res.render('index', {name: user, posts: posts, authors: authors})
})

router.post('/register', (req, res) => {
    db.add_user({
        username: req.body.username,
        password: req.body.passwd,
    })

    res.redirect('/')
})

router.get('/edit', async (req, res) => {
    var post = await db.get_post_by_id(req.query.postid)

    console.log(post)
    res.render('edit', {post: post})
})

router.post('/edit', async (req, res) => {
    let id = req.query.id

    await db.modify_post({
        Guid: id,
        Title: req.body.title,
        Content: req.body.content
    })
    res.redirect(`/post?id=${id}`)
})

router.get('/register', (_, res) => {
    res.render('register')
})

router.get('/login', (_, res) => {
    res.render('login')
})

router.get('/logoff', (_, res) => {
    res.clearCookie('UserId')
    res.redirect('/')
})

router.post('/login', async (req, res) => {
    const UserId = await db.get_user_by_login({
        username: req.body.username,
        password: req.body.passwd,
    })

    if (!UserId) res.redirect('/login?e=true')
    else {
        res.cookie('UserId', UserId).redirect('/')
    }
})

router.get('/new_post', (_, res) => {
    res.render('new_post')
})

router.get('/post', async (req, res) => {
    var id = "000"
    var postid = ""
    var posts = ""
    var username = "Anonymous"

    if (req.query.id) postid = req.query.id
    if (req.cookies.UserId) id = req.cookies.UserId

    posts = await get_post_by_id(postid)

    if (!posts) res.redirect('/')
    if (posts.UserId != "0000") {
        u = await db.get_user_by_id(posts.UserId)
        username = u.Username
    }
    
    var show_edit = posts.UserId == id
    res.render('post', {name: username, posts: posts, show_edit: show_edit})
})

router.post('/add', (req, res) => {
    var userid = "0000"

    if (req.cookies.UserId) userid = req.cookies.UserId
    db.add_post({
        title: req.body.title,
        content: req.body.content,
        userid: userid
    })
    res.redirect('/')
})

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(__dirname + '/../public'));
app.use(cookieParser());
app.use(router)

db.db_connect()

module.exports = app
