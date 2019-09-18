const moment = require('moment');

module.exports = {
    search: function(location) {
        if(location === "sell"){
            return `<ul class="navbar-nav ml-auto">
            <form class="form-inline ml-auto">
                <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                <button class="btn btn-outline-success btn-block-sm my-2 my-sm-0" type="submit">Search</button>
            </form>
            </ul>`
        }else{
            return ""
        }
    },
    // function to format date
    formatDate: function (date, format) {
        return moment(date).format(format);
    },
    // function to give edit and delete icons
    Icon: function(logedInUser, User){
        if(logedInUser.toString() === User.toString()){
            return true;
        }else{
            return false;
        }
    },
    // handlebar function for selecting DropDown option
    select: function (selected, options) {
        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace(new RegExp('>' + selected + '<option>'),
            'selected="selected"$&');
    },
}