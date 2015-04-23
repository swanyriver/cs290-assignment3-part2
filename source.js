function loadFavorites() {
    //TODO implement
    console.log('onload called loadFavorites');
}


//attached to search button
function getGists() {

    console.log('getGists running');

    var url = 'https://api.github.com/gists';
    var gistReq = new XMLHttpRequest();
    var GistsFeed;

    if (!gistReq) {
        throw 'unable to create XMLHttpRequest';
    }

    gistReq.onreadystatechange = function () {
        console.log(this.readyState, this.status, this.statusText);
        if (this.readyState === 4 && this.status === 200) {
            console.log('request done');

            if (this.response) {
                GistsFeed = JSON.parse(this.response);
            } else {
                throw 'no response';
            }
            //console.log(this.response);
            //console.log(GistsFeed.toString());
            GistsFeed.forEach(function (g) {
                //console.log(g.description);
                if (g.hasOwnProperty('owner')) {
                    console.log(g.owner.avatar_url);
                }
                
                if (!g.hasOwnProperty('files')) {
                    console.log('this one has no file');
                } else {
                    
                    //g.files.forEach(function (f) {
                    //    if (!f.hasOwnProperty('language')) {
                    //        console.log('this file has no language');
                    //    }
                    //});
                }
                
            });
        }
    };
    gistReq.open('GET', url);
    gistReq.send();
}

