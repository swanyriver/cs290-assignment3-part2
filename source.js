var GistList = [];
function Gist(desciption, useravtimg,
               username, userhtml, gisthtml, languages, id) {
    this.description = desciption;
    this.useravtimg = useravtimg;
    this.username = username;
    this.userhtml = userhtml;
    this.gisthtml = gisthtml;
    this.languages = languages;
    this.id = id;
}

function updateFavorites() {
    //TODO implement
    console.log('onload called loadFavorites');

}

function favorite(id) {
    console.log('favorite clicked ', id);
}

function updateList() {
    var list = document.getElementById('gistlist');
    
    clearNode(list);

    GistList.forEach(function (gist) {
        list.appendChild(new GistListItem(gist));
    });
}

function clearNode(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function GistListItem(gist) {
    var glitem = document.createElement('div');
    glitem.setAttribute('class', 'gistItem');

    var firstline = document.createElement('div');
    firstline.setAttribute('class', 'firstline');

    if (gist.userhtml) {
        var ownerlink = document.createElement('a');
        ownerlink.setAttribute('href', gist.userhtml);
    }

    var ownerimage = document.createElement('img');
    ownerimage.setAttribute('src', gist.useravtimg);
    ownerimage.setAttribute('alt', 'avatar');
    ownerimage.setAttribute('class', 'avatar');

    if (gist.userhtml) {
        ownerlink.appendChild(ownerimage);
    } else {
        firstline.appendChild(ownerimage);
    }

    var ownername = document.createElement('div');
    var ownernameTEXT = document.createTextNode(gist.username);
    ownername.setAttribute('class', 'userName');
    ownername.appendChild(ownernameTEXT);

    if (gist.userhtml) {
        ownerlink.appendChild(ownername);
        firstline.appendChild(ownerlink);
    } else {
        firstline.appendChild(ownername);
    }

    glitem.appendChild(firstline);

    var secondline = document.createElement('div');
    secondline.setAttribute('class', 'secondLine');

    var glink = document.createElement('a');
    glink.setAttribute('class', 'description');
    glink.setAttribute('href', gist.gisthtml);
    var descText = document.createTextNode(gist.description);
    glink.appendChild(descText);

    secondline.appendChild(glink);

    var fav = document.createElement('img');
    fav.setAttribute('src', 'emptyStar.png');
    fav.setAttribute('alt', 'favorite');
    fav.setAttribute('class', 'favoritebutton');
    fav.setAttribute('id', gist.id);
    fav.setAttribute('onclick', 'favorite(this.id)');

    secondline.appendChild(fav);

    glitem.appendChild(secondline);

    return glitem;

}


//attached to search button
function getGists() {

    console.log('getGists running');

    //var url = 'https://api.github.com/gists';
    var url = 'http://web.engr.oregonstate.edu/~swansonb/web3/gists';  //TODO reset to github api
    var gistReq = new XMLHttpRequest();
    var GistsFeed;

    if (!gistReq) {
        throw 'unable to create XMLHttpRequest';
    }

    //defining behavior for state changes, particularily state 4, request done//
    gistReq.onreadystatechange = function () {
        console.log(this.readyState, this.status, this.statusText);
        if (this.readyState === 4 && this.status === 200) {
            console.log('request done');

            if (this.response) {
                GistsFeed = JSON.parse(this.response);
            } else {
                throw 'no response';
            }

            //////make an array of gists////
            GistList = [];
            GistsFeed.forEach(function (g) {

                var nextGist = new Gist();

                nextGist.id = g.id;
                nextGist.gisthtml = g.html_url;

                if (g.description) {
                    nextGist.description = g.description;
                } else {
                    nextGist.description = 'No Description Provided';
                }

                if (g.hasOwnProperty('owner')) {
                    nextGist.username = g.owner.login;
                    nextGist.userhtml = g.owner.html_url;
                    nextGist.useravtimg = g.owner.avatar_url;
                } else {
                    nextGist.username = 'anonymous';
                    nextGist.userhtml = null;
                    nextGist.useravtimg = 'avatar.png';
                }

                //get languages and other file properties
                nextGist.languages = [];
                for (var f in g.files) {
                    nextGist.languages.push(g.files[f].language);
                }

                GistList.push(nextGist);

            });


            ////make calls to update database and refresh
            updateList();

        }
    };

    //sending request
    gistReq.open('GET', url);
    gistReq.send();
}
