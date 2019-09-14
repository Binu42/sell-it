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
    }
}