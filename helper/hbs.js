const moment = require('moment');

module.exports = {
    // function to format date
    formatDate: function (date, format) {
        return moment(date).format(format);
    },
    // function to give edit and delete icons
    Icon: function (logedInUser, User) {
        // console.log(logedInUser, User)
        if (logedInUser.toString() === User.toString()) {
            return true;
        } else {
            return false;
        }
    },

    // pagination
    pagination: function (pages, currentPage) {
        let paginationLi = ''
        for (var i = 0; i < pages; i++) {
            if (currentPage == i + 1) {
                paginationLi += `<li class="page-item active"><a class="page-link" href="/books/buy/${i + 1}">${i + 1}</a></li>`
            } else {
                paginationLi += `<li class="page-item"><a class="page-link" href="/books/buy/${i + 1}">${i + 1}</a></li>`
            }

        }
        return paginationLi;
    },

    // to disabled pagination on condition match
    equality: function (currentPage, checkPage) {
        // console.log(currentPage, checkPage)
        if (currentPage.toString() === checkPage.toString()) {
            // console.log('true')
            return true;
        } else {
            return false;
        }
    },

    // handlebar function for selecting DropDown option
    select: function (selected, options) {
        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace(new RegExp('>' + selected + '<option>'),
            'selected="selected"$&');
    },
}