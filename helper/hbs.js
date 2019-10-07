const moment = require('moment');

module.exports = {
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