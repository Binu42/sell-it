// Login fast validator
$(function () {
    var password = $('.login-form #password');
    var email = $('.login-form #email');
    console.log(password.val());
    $('.login-form').submit(function (event) {
        if (password.val().trim() === "" || email.val().trim() === "") {
            event.preventDefault();
            if (password.val().trim() === "") {
                $('#password-feedback--login').addClass('d-block');
                $('#password-feedback--login').text('please enter password');
                $('#password').css('box-shadow', '0px 0px 5px red');
                $('#password').css('border', '2px solid red');
            }
            if (email.val().trim() === "") {
                $('#email-feedback--login').addClass('d-block');
                $('#email-feedback--login').text('please enter email');
                $('#email').css('box-shadow', '0px 0px 5px red');
                $('#email').css('border', '2px solid red');
            }
        }
    })
    password.blur(function () {
        if (password.val().trim() === "") {
            $('#password-feedback--login').addClass('d-block');
            $('#password-feedback--login').text('please enter password');
            $('#password').css('box-shadow', '0px 0px 5px red');
            $('#password').css('border', '2px solid red');
        } else {
            $('#password-feedback--login').removeClass('d-block');
            $('#password').css('box-shadow', '0px 0px 5px green');
            $('#password').css('border', '1px solid lightgreen');
        }
    })

    email.blur(function () {
        if (email.val().trim() === "") {
            $('#email-feedback--login').addClass('d-block');
            $('#email-feedback--login').text('please enter email');
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#email-feedback--login').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })
})

// Register fast Validator
$(function () {
    var password = $('.register-form #password');
    var confirmPassword = $('.register-form #confpassword');
    var name = $('.register-form #name');
    var email = $('.register-form #email');
    var address = $('.register-form #location');
    var contact = $('.register-form #mobileno');
    var image = $('.register-form #uploadPic');
    var secret = $('.register-form #secret');

    $('.register-form').submit(function (event) {
        if (password.val().length < 5 || !(/.*[0-9].*/.test(password.val())) || password.val() !== confirmPassword.val() || name.val().length < 3) {
            event.preventDefault();
        }
    })

    password.blur(function () {
        if (password.val().length < 5 || !(/.*[0-9].*/.test(password.val()))) {
            $('#password-feedback--register').addClass('d-block');
            $('#password-feedback--register').text('please enter password with atleast of 5 length and one number.');
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#password-feedback--register').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })
    confirmPassword.blur(function () {
        if (confirmPassword.val() !== password.val()) {
            $('#confirmpassword-feedback--register').addClass('d-block');
            $('#confirmpassword-feedback--register').text("Password doesn't matched");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#confirmpassword-feedback--register').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })
    name.blur(function () {
        if (name.val().length < 3) {
            $('#name-feedback--register').addClass('d-block');
            $('#name-feedback--register').text("Please give valid name");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#name-feedback--register').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })

    email.blur(function () {
        var emailValue = email.val();
        if (!emailValue.includes('@gmail.com')) {
            $('#email-feedback--register').addClass('d-block');
            $('#email-feedback--register').text("Please give valid email");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#email-feedback--register').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })

    address.blur(function () {
        if (address.val().length < 10) {
            $('#address-feedback--register').addClass('d-block');
            $('#address-feedback--register').text("Please give valid address");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#address-feedback--register').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })

    contact.blur(function () {
        if (contact.val().trim().length === 10 || contact.val().trim().length === 11) {
            $('#contact-feedback--register').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        } else {
            $('#contact-feedback--register').addClass('d-block');
            $('#contact-feedback--register').text("Please give valid contact Number");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        }
    })

    image.blur(function () {
        if (image.val().length < 10) {
            $('#image-feedback--register').addClass('d-block');
            $('#image-feedback--register').text("Please give picture");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#image-feedback--register').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })

    secret.blur(function () {
        if (secret.val().trim() === "") {
            $('#secret-feedback--register').addClass('d-block');
            $('#secret-feedback--register').text("Please give valid secret");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#secret-feedback--register').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })
})

// Book sell validator
$(function () {
    var name = $('.book-Sell #name');
    var authname = $('.book-Sell #authname');
    var image = $('.book-Sell #uploadPic');
    var description = $('.book-Sell #description');
    var price = $('.book-Sell #price');

    $('.book-Sell').submit(function(event){
        if(name.val().trim() === "" || authname.val().trim() === "" || image.val() === "" || description.val().trim() === "" || price.val().trim() === ""){
            event.preventDefault();
        }
    })

    name.blur(function () {
        if (name.val().trim().length < 5) {
            $('#name-feedback--bookSell').addClass('d-block');
            $('#name-feedback--bookSell').text("Please give valid name");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#name-feedback--bookSell').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })

    authname.blur(function () {
        if (authname.val().trim().length < 5) {
            $('#author-feedback--bookSell').addClass('d-block');
            $('#author-feedback--bookSell').text("Please give valid author name");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#author-feedback--bookSell').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })

    image.blur(function () {
        if (image.val().trim().length < 5) {
            $('#image-feedback--bookSell').addClass('d-block');
            $('#image-feedback--bookSell').text("Please give image");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#image-feedback--bookSell').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })

    description.blur(function () {
        if (description.val().trim().length < 5) {
            $('#description-feedback--bookSell').addClass('d-block');
            $('#description-feedback--bookSell').text("Please give description");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#description-feedback--bookSell').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })

    price.blur(function () {
        if (price.val().trim().length < 5) {
            $('#price-feedback--bookSell').addClass('d-block');
            $('#price-feedback--bookSell').text("Please give price");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#price-feedback--bookSell').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })
})

// Sell Sport Item
$(function () {
    var name = $('.sport-Sell #name');
    var company = $('.sport-Sell #company');
    var year = $('.sport-Sell #year');
    var image = $('.sport-Sell #uploadPic');
    var description = $('.sport-Sell #description');
    var price = $('.sport-Sell #price');

    $('.sport-Sell').submit(function(event){
        if(name.val().trim() === "" || company.val().trim() === "" || image.val() === "" || description.val().trim() === "" || price.val().trim() === "" || year.val() === ""){
            event.preventDefault();
        }
    })

    name.blur(function () {
        if (name.val().trim().length < 5) {
            $('#name-feedback--sportSell').addClass('d-block');
            $('#name-feedback--sportSell').text("Please give valid name");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#name-feedback--sportSell').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })

    company.blur(function () {
        if (company.val().trim() === "") {
            $('#company-feedback--sportSell').addClass('d-block');
            $('#company-feedback--sportSell').text("Please give valid company name");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#company-feedback--sportSell').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })

    year.blur(function () {
        if (year.val() > 5 || year.val() === "") {
            $('#year-feedback--sportSell').addClass('d-block');
            $('#year-feedback--sportSell').text("Please give valid year");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#year-feedback--sportSell').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })

    image.blur(function () {
        if (image.val().trim() === "") {
            $('#image-feedback--sportSell').addClass('d-block');
            $('#image-feedback--sportSell').text("Please give image");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#image-feedback--sportSell').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })

    description.blur(function () {
        if (description.val().trim().length < 10) {
            $('#description-feedback--sportSell').addClass('d-block');
            $('#description-feedback--sportSell').text("Please give description");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#description-feedback--sportSell').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })

    price.blur(function () {
        if (price.val().trim() === "") {
            $('#price-feedback--sportSell').addClass('d-block');
            $('#price-feedback--sportSell').text("Please give price");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#price-feedback--sportSell').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })
})

// Recycle validator

$(function() {
    var quantity = $('.recycle #quantity');
    var address = $('.recycle #address');
    var contact = $('.recycle #contact');
    var time = $('.recycle #time');
    var date = $('.recycle #date');

    $('.recycle').submit(function(event){
        if(quantity.val() < 20 || address.val().trim() === "" || contact.val().length === 10){
            event.preventDefault();
        }
    })
    
    quantity.blur(function () {
        if (quantity.val().trim() === "") {
            $('#quantity-feedback--recycle').addClass('d-block');
            $('#quantity-feedback--recycle').text("Please give quantity");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#quantity-feedback--recycle').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })

    address.blur(function () {
        if (address.val().trim() === "") {
            $('#address-feedback--recycle').addClass('d-block');
            $('#address-feedback--recycle').text("Please give address");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#address-feedback--recycle').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })

    contact.blur(function () {
        if (contact.val().trim() === "") {
            $('#contact-feedback--recycle').addClass('d-block');
            $('#contact-feedback--recycle').text("Please give contact");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#contact-feedback--recycle').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })

    time.blur(function () {
        if (time.val().trim() === "") {
            $('#time-feedback--recycle').addClass('d-block');
            $('#time-feedback--recycle').text("Please give time");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#time-feedback--recycle').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })

    date.blur(function () {
        if (date.val().trim() === "") {
            $('#date-feedback--recycle').addClass('d-block');
            $('#date-feedback--recycle').text("Please give date");
            $(this).css('box-shadow', '0px 0px 5px red');
            $(this).css('border', '2px solid red');
        } else {
            $('#date-feedback--recycle').removeClass('d-block');
            $(this).css('box-shadow', '0px 0px 5px green');
            $(this).css('border', '1px solid lightgreen');
        }
    })
})