const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cloudinary = require('cloudinary');
const router = express.Router();

require('../models/Books');
const Book = mongoose.model('books');
require('../models/Recycle');
const Recycle = mongoose.model('recycles');

const upload = require('../handlers/multer');
const {ensureAuthenticated} = require('../helper/auth');

router.get('/sell', ensureAuthenticated, (req, res) => {
    res.render('book/sell');
});

router.get('/buy', ensureAuthenticated, (req, res) => {
    Book.find()
    .then(books => {
        res.render('book/buy', {books: books});
    })
})

router.get('/rental', ensureAuthenticated, (req, res) => {
    res.render('book/rental');
});

router.get('/recycle', ensureAuthenticated, (req, res) => {
    res.render('book/recycle');
});

router.post('/sell', ensureAuthenticated, upload.single('book_pic'), async (req, res) => {
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill"
    })
    const newBook = new Book({
        user: req.user.id,
        name: req.body.name,
        section: req.body.section,
        author: req.body.authname,
        image: result.secure_url,
        description: req.body.description,
        price: req.body.price
    });

    newBook.save()
    .then(book => {
        req.flash('sucess_msg', 'Successfully uploaded');
        res.redirect('/books/buy');
    })
    .catch(error => {
        console.log(error);
        return
    })
});

router.get('/:id', ensureAuthenticated, (req, res)=> {
    Book.findOne({_id: req.params.id})
    .populate('user', ['name', 'address', 'contact', 'profile'])
    .populate('comments.commentUser', ['name', 'profile'])
    .then(item => {
        res.render('book/detail', {item: item});
    })
    .catch(error => {
        console.log(error);
        return;
    })
});

router.post('/recycle', ensureAuthenticated, (req, res) => {
    const recycle = new Recycle({
        user: req.user.id,
        quantity: req.body.quantity,
        address: req.body.address,
        contact: req.body.contact,
        time: req.body.time,
        date: req.body.date
    });
    recycle.save()
    .then(rec => {
        req.flash('sucess_msg', 'Successfully uploaded');
        res.redirect('/');
    })
    .catch(error => {
        console.log(error);
        return;
    })
})

router.post('/comments/:id', (req, res)=> {
    Book.findOne({_id: req.params.id})
    .then(book => {
        const newComment = {
            commentBody: req.body.comment,
            commentUser: req.user.id
        }
        book.comments.unshift(newComment);
        book.save()
            .then(book => {
                req.flash('success_msg', 'Your Comment Added !');
                res.redirect('/books/' + book.id);
            })
    })
})

module.exports = router;