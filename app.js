var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override')
    mongoose = require('mongoose'),
    app = express();

mongoose.connect('mongodb://localhost/restful_blog_app');

// view engine setup
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date,  default: Date.now}
});

var Blog = mongoose.model('Blog', blogSchema);

app.get('/', function (req, res) {
    res.redirect('/blogs');
});

app.get('/blogs', function (req, res) {
    Blog.find({}, function (err, blogs) {
        if(err) {
            console.log('Error');
        } else {
            res.render('index', {blogs: blogs})
        }
    });
});

app.get('/blogs/new', function (req, res) {
    res.render('new');
});

app.post('/blogs', function (req, res) {
    Blog.create(req.body.blog, function (err, newBlog) {
        if(err) {
            res.redirect('new')
        } else {
            res.redirect('/blogs');
        }
    });
});

app.get('/blogs/:id', function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.render('show', {blog: foundBlog});
        }
    });
});

app.get('/blogs/:id/edit', function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.render('edit', {blog: foundBlog});
        }
    });
});

app.put('/blogs/:id', function (req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

app.delete('/blogs/:id', function (req, res) {
    Blog.findByIdAndRemove(req.params.id, req.body.blog, function (err) {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs');
        }
    });
});

app.listen(3000, function () {
   console.log('Server has started')
});
