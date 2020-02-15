// dependencies
const express = require('express');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
const router = express.Router();

// collections for books and recycling items
require('../models/Books');
const Book = mongoose.model('books');
require('../models/Recycle');
const Recycle = mongoose.model('recycles');

// upload of image
const upload = require('../handlers/multer');
// authenticated or not checking
const {
    ensureAuthenticated
} = require('../helper/auth');

// @Access  private
// @route   get /books/sell
// @desc    form for selling books
router.get('/sell', ensureAuthenticated, (req, res) => {
    res.render('book/sell');
});

// @Access  private
// @route   get /books/buy
// @desc    for buying books
router.get('/buy/:page', ensureAuthenticated, async (req, res) => {
    // console.log(req.params.page)

    const totalDocs = await Book.countDocuments();
    const pages = Math.ceil(totalDocs / 6);
    Book.find({})
        .skip(6 * (req.params.page - 1))
        .limit(6)
        .then(books => {
            // console.log("all books", books)
            res.render('book/buy', {
                books: books,
                pages: pages,
                currentPage: req.params.page
            });
        })
})

// @Access  private
// @route   get /books/recycle
// @desc    form for selling rough books
router.get('/recycle', ensureAuthenticated, (req, res) => {
    res.render('book/recycle');
});

// @Access  private
// @route   post /books/sell
// @desc    adding books item to collection
router.post('/sell', ensureAuthenticated, upload.single('book_pic'), async (req, res) => {
    const result = await cloudinary.v2.uploader.upload(req.file.path)
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
            req.flash('success_msg', 'Successfully uploaded');
            res.redirect('/books/buy/1');
        })
        .catch(error => {
            console.log(error);
            return
        })
});

// @Access  private
// @route   get /books/id
// @desc    show details about books
router.get('/:id', ensureAuthenticated, (req, res) => {
    Book.findOne({
        _id: req.params.id
    })
        .populate('user', ['name', 'address', 'contact', 'profile'])
        .populate('comments.commentUser', ['name', 'profile'])
        .then(item => {
            res.render('book/detail', {
                item: item
            });
        })
        .catch(error => {
            console.log(error);
            return;
        })
});

// @Access  private
// @route   post /books/recycle
// @desc    selling of rough books item to collection
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
            req.flash('success_msg', 'Successfully uploaded');
            res.redirect('/');
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
    Book.findOne({
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
                    res.redirect('/books/' + book.id);
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
    Book.findOne({
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
                            res.redirect('/books/' + req.params.bookId);
                        })
                } else {
                    req.flash('error_msg', 'you are not authorised');
                    res.redirect('/books/' + req.params.bookId);
                }
            } else {
                req.flash('error_msg', 'comment does not exist');
                res.redirect('/books/' + req.params.bookId);
            }
        })
        .catch(error => {
            console.log(error);
            return;
        })
})

// @Access  private
// @route   get /books/edit/id
// @desc    form for editing of book details provided
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Book.findOne({
        _id: req.params.id
    })
        .then(book => {
            if (book.user.toString() === req.user.id.toString()) {
                res.render('book/edit', {
                    book: book
                });
            } else {
                req.flash('error_msg', 'you are not authorised!');
                res.redirect('/books/' + book.id);
            }
        })
        .catch(error => {
            console.log(error);
            return;
        })
})

// @Access  private
// @route   delete /books/id
// @desc    deleting of books
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Book.findOne({
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
                res.redirect('/books/buy');
            } else {
                req.flash('error_msg', 'you are not authorised!');
                res.redirect('/books/' + book.id);
            }
        })
        .catch(error => {
            console.log(error);
            return;
        })
});

// @Access  private
// @route   put /books/id
// @desc    submit form after editing of books
router.put('/:id', ensureAuthenticated, (req, res) => {
    Book.findOne({
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
                        res.redirect('/books/buy');
                    })
            } else {
                req.flash('error_msg', 'you are not authorised!');
                res.redirect('/books/' + book.id);
            }
        })
        .catch(error => {
            console.log(error);
            return;
        })
});

router.post('/search', ensureAuthenticated, (req, res) => {
    Book.find({
        section: req.body.section
    })
        .then(books => {
            res.render('book/buy', {
                books: books,
                value: req.body.section
            });
        })
})

module.exports = router;