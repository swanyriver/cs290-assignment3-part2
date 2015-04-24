var GistList = [];
var favoriteIDs = [];
var languagesPresent = [];
var numEachLanguage = new Object();



function updateFavorites() {
    //TODO implement
    console.log('onload called loadFavorites');
    
    favlist = document.getElementById('favoritelist');
    
    for ( var i = 0; i < localStorage.length; i++ ){
        key = localStorage.key(i);
        jsonStr = localStorage.getItem(key);
        favitem = JSON.parse(jsonStr);
        
        favoriteIDs.push(favitem.id);
        
        favlist.appendChild(FavoriteListItem(GistListItem(favitem)));
    }

}

function favorite(id, elem) {
    
    console.log("favorite",id);
    
    //get list item
    while(elem.className != 'gistItem'){
        elem = elem.parentElement;
    }
    
    //remove from gists and move to favorite
    elem.parentElement.removeChild(elem);
    document.getElementById('favoritelist').appendChild(FavoriteListItem(elem));
    
    //store favorite in local storage
    favoriteIDs.push(id);
    localStorage.setItem(id,JSON.stringify(getGistbyID(id)));

}

function unfavorite(id, elem) {
    console.log ("unfavorite", id);
    
    //remove list from local storage
    localStorage.removeItem(id);
    
    //remove from favorite list display
    while(elem.className != 'FavoriteItem'){
        elem = elem.parentElement;
    }
    document.getElementById('favoritelist').removeChild(elem);
    
    //remove id from favorites
    favoriteIDs.splice(favoriteIDs.indexOf(id),1);
    
    //update gistlist, if removed favorite is still in results it will be displayed
    updateList();
}

function getGistbyID(id){
    for (var i = 0; i<GistList.length; i++){
        if (GistList[i].id==id){
            return GistList[i];
        }
    }
}

function updateList() {
    var list = document.getElementById('gistlist');
    
    clearNode(list);

    GistList.filter(listFilter).forEach(function (gist) {
        list.appendChild(new GistListItem(gist));
    });
}

function listFilter(gist){
    //is a favorite
    //if(favoriteIDs.indexOf(gist.id) != -1){
    //    return false;
    //}
    
    //not in selected language
    //TODO implement
    
    //return true;
    return (nonFavorite(gist) && languageSelected(gist));
}

function nonFavorite(gist){
    return (favoriteIDs.indexOf(gist.id) == -1);
}
function languageSelected(gist){
    //TODO implement this
    return true;
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
    fav.setAttribute('onclick', 'favorite(this.id, this)');
    secondline.appendChild(fav);

    glitem.appendChild(secondline);

    return glitem;

}

//recives a gistlist item made by GistListItem
function FavoriteListItem(glitem){
    
    glitem.className='FavoriteItem';
    var button = glitem.getElementsByClassName('favoritebutton')[0];
    button.setAttribute('src', 'star.jpg');
    button.setAttribute('onclick', 'unfavorite(this.id, this)'); 
    
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
            languagesPresent = [];
            GistsFeed.forEach(function (g) {

                var nextGist = new Object();

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
                    var lang = g.files[f].language;
                    if (!lang){
                        lang = 'None';
                    }
                    if (nextGist.languages.indexOf(lang) == -1){
                        nextGist.languages.push(lang);
                    }
                    if (languagesPresent.indexOf(lang) == -1){
                        languagesPresent.push(lang);
                        numEachLanguage[lang] = 1;
                    } else {
                        numEachLanguage[lang]++;
                    }
                    
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
