// dependencies
const express = require('express');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
const router = express.Router();


require('../models/Rental');
const Rental = mongoose.model('rentals');

// upload of image
const upload = require('../handlers/multer');

// authenticated or not checking
const {
    ensureAuthenticated
} = require('../helper/auth');


// @Access  private
// @route   get /books/rental
// @desc    for taking books on rental basis
router.get('/give', ensureAuthenticated, (req, res) => {
    res.render('rentalbooks/give');
});


router.get('/take', ensureAuthenticated, (req, res) => {
    Rental.find({})
        .then(books => {
            res.render('rentalbooks/rental', {
                books: books
            });
        })
})

router.post('/give', ensureAuthenticated, upload.single('book_pic'), async (req, res) => {
    const result = await cloudinary.v2.uploader.upload(req.file.path)
    const newRental = new Rental({
        user: req.user.id,
        name: req.body.name,
        section: req.body.section,
        author: req.body.authname,
        image: result.secure_url,
        description: req.body.description,
        price: req.body.price,
        address: req.user.address
    });

    newRental.save()
        .then(() => {
            req.flash('success_msg', 'Successfully uploaded');
            res.redirect('/rental/take');
        })
        .catch(error => {
            console.log(error);
            return
        })
})


router.get("/:id", ensureAuthenticated, (req, res) => {
    Rental.findOne({
            _id: req.params.id
        })
        .populate('user', ['name', 'address', 'contact', 'profile'])
        .populate('comments.commentUser', ['name', 'profile'])
        .then(book => {
            res.render('rentalbooks/details', {
                item: book
            });
        })
})


router.delete('/:id', ensureAuthenticated, (req, res) => {
    Rental.findOne({
            _id: req.params.id
        })
        .then(book => {
            if (book.user.toString() === req.user.id.toString()) {
                const name = book.image.substr(62).slice(0, -4);
                cloudinary.v2.uploader.destroy(name, (error, result) => {
                    if (!error) {
                        console.log(result);
                    } else {
                        console.log(error);
                    }
                });
                book.remove();
                req.flash('success_msg', "Book is Removed");
                res.redirect('/rental/take');
            } else {
                req.flash('error_msg', 'you are not authorised!');
                res.redirect('/rental/' + book.id);
            }
        })
        .catch(error => {
            console.log(error);
            return;
        })
})


router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Rental.findOne({
            _id: req.params.id
        })
        .then(book => {
            res.render('rentalbooks/edit', {
                book: book
            })
        })
        .catch(error => {
            console.log(error)
            return;
        })
})


router.put('/:id', ensureAuthenticated, (req, res) => {
    Rental.findOne({
            _id: req.params.id
        })
        .then(book => {
            if (book.user.toString() === req.user.id.toString()) {
                book.name = req.body.name,
                    book.author = req.body.authname,
                    book.section = req.body.section,
                    book.description = req.body.description,
                    book.price = req.body.price

                book.save()
                    .then(book => {
                        req.flash('success_msg', "Book is updated");
                        res.redirect('/rental/' + book.id);
                    })
            } else {
                req.flash('error_msg', 'you are not authorised!');
                res.redirect('/rental/' + book.id);
            }
        })
        .catch(error => {
            console.log(error);
            return;
        })
})


// @Access  private
// @route   post /books/comments/id
// @desc    adding comments on books item
router.post('/comments/:id', ensureAuthenticated, (req, res) => {
    Rental.findOne({
            _id: req.params.id
        })
        .then(book => {
            const newComment = {
                commentBody: req.body.comment,
                commentUser: req.user.id
            }
            book.comments.unshift(newComment);
            book.save()
                .then(book => {
                    req.flash('success_msg', 'Your Comment Added !');
                    res.redirect('/rental/' + book.id);
                })
        })
        .catch(error => {
            console.log(error);
            return;
        })
})

// @Access  private
// @route   get /books/comments/bookId/commentId
// @desc    deleting comments on books
router.get('/comments/:bookId/:commentId', ensureAuthenticated, (req, res) => {
    Rental.findOne({
            _id: req.params.bookId
        })
        .then(book => {
            const index = book.comments.map(comment => comment.id).indexOf(req.params.commentId);
            if (index !== -1) {
                if (book.comments[index].commentUser.toString() === req.user.id.toString()) {
                    book.comments.splice(index, 1);
                    book.save()
                        .then(book => {
                            req.flash('success_msg', 'Your Comment deleted !');
                            res.redirect('/rental/' + req.params.bookId);
                        })
                } else {
                    req.flash('error_msg', 'you are not authorised');
                    res.redirect('/rental/' + req.params.bookId);
                }
            } else {
                req.flash('error_msg', 'comment does not exist');
                res.redirect('/rental/' + req.params.bookId);
            }
        })
        .catch(error => {
            console.log(error);
            return;
        })
})


router.post("/search", ensureAuthenticated, (req, res) => {
    Rental.find({
            section: req.body.section
        })
        .then(books => {
            const searchBooks = []
            for (let i = 0; i < books.length; i++) {
                if (books[i].address.toLowerCase().includes(req.body.location.toLowerCase())) {
                    searchBooks.push(books[i]);
                }
            }
            res.render('rentalbooks/rental', {
                books: searchBooks,
                value: req.body.section,
                location: req.body.location
            });
        })
})

module.exports = router;