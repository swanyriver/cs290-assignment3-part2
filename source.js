var GistList = [];
function Gist (desciption ) {
    this.description = desciption;
    //todo make more of this;
}

function loadFavorites() {
    //TODO implement
    console.log('onload called loadFavorites');
}


//attached to search button
var GistsFeed;  //todo return to local variable  MAYBE
function getGists() {

    console.log('getGists running');

    //var url = 'https://api.github.com/gists';
    var url = 'http://web.engr.oregonstate.edu/~swansonb/web3/gists';
    var gistReq = new XMLHttpRequest();
    //var GistsFeed;

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
                    //console.log( typeof g.files );
                    //g.files.forEach(function (f) {
                    //    if (!f.hasOwnProperty('language')) {
                    //        console.log('this file has no language');
                    //    }
                    //});
                    //for (var f in g.files){
                    //    console.log(f[property].language);
                    //}
                    for (var f in g.files){ console.log(g.files[f].language);}
                }
                
            });
        }
    };
    gistReq.open('GET', url);
    gistReq.send();
}