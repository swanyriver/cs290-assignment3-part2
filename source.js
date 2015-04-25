var GistList = [];
var favoriteIDs = [];
var languagesPresent = [];
var numEachLanguage = new Object();
var langaugesSelected = [];


function updateFavorites() {
    console.log('onload called loadFavorites');

    var favlist = document.getElementById('favoritelist');

    for (var i = 0; i < localStorage.length; i++) {
        key = localStorage.key(i);
        jsonStr = localStorage.getItem(key);
        favitem = JSON.parse(jsonStr);
        
        favoriteIDs.push(favitem.id);
        
        favlist.appendChild(FavoriteListItem(GistListItem(favitem)));
    }
    
    updateLanguagePanel();

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
    
    updateLanguagePanel();

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
    
    updateLanguagePanel();

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

function updateLanguagePanel(){
    languagesPresent = []
    numEachLanguage = new Object();

    GistList.filter(nonFavorite).forEach(function(gist) {
        gist.languages.forEach(function(lang){   
            if (languagesPresent.indexOf(lang) == -1){
                languagesPresent.push(lang);
                numEachLanguage[lang] = 1;
            } else {
                numEachLanguage[lang]++;
            }
        });
    });
    
    //update html
    langList = document.getElementById('languageList');
    clearNode(langList);
    
    languagesPresent.forEach(function (lang){
        chlabel = document.createElement('label');
        ch = document.createElement('input');
        
        ch.setAttribute('type','checkbox');
        ch.setAttribute('onclick','languageSelect(this.checked,this.value)');
        ch.setAttribute('value',lang);
        
        if(langaugesSelected.indexOf(lang) != -1){
            ch.setAttribute('checked','true');
        }
        
        chlabel.appendChild(ch);
        
        chlabel.appendChild(document.createTextNode(lang + ' (' + numEachLanguage[lang] + ')  '));
        
        langList.appendChild(chlabel);
    });
    
    for(var i = 0; i<langaugesSelected.length; i++){
        //selecetd language no longer in set
        if(languagesPresent.indexOf(langaugesSelected[i]) == -1){
            langaugesSelected.splice(i,1);
        }
    }
}

function languageSelect(selected,language){
    console.log(selected,language);
    
    if(selected){
        langaugesSelected.push(language);
    } else {
        langaugesSelected.splice(langaugesSelected.indexOf(language),1);
    }
    
    console.log(langaugesSelected);
    
    updateList();
    
}

function listFilter(gist){
    if(!langaugesSelected.length) return nonFavorite(gist);
    return (nonFavorite(gist) && langFilter(gist));
}

function nonFavorite(gist){
    return (favoriteIDs.indexOf(gist.id) == -1);
}

function langFilter(gist){
    var match = false;
    gist.languages.forEach(function(lang){
        if(langaugesSelected.indexOf(lang) != -1){
            match = true;
        }
    });
    return match;
}

function clearNode(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

//returns an HTML element
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
        firstline.appendChild(ownerlink);
    } else {
        firstline.appendChild(ownerimage);
    }

    
    var glink = document.createElement('a');
    glink.setAttribute('class', 'description');
    glink.setAttribute('href', gist.gisthtml);
    var descText = document.createTextNode(gist.description);
    glink.appendChild(descText);

    firstline.appendChild(glink);

    glitem.appendChild(firstline);

    var secondline = document.createElement('div');
    secondline.setAttribute('class', 'secondLine');

    ////username
    if (gist.userhtml) {
        var ownername = document.createElement('a');
        ownername.setAttribute('href',gist.userhtml);
    } else {
        var ownername = document.createElement('span');
    }
    ownername.setAttribute('class', 'userName');
    var ownernameTEXT = document.createTextNode(gist.username);
    ownername.appendChild(ownernameTEXT);
    secondline.appendChild(ownername);
    
    var footer = document.createElement('span');
    footer.setAttribute('class','footer');
    
    //languages
    var langsdiv = document.createElement('span');
    langsdiv.setAttribute('class','langList');
    var langstr = '';
    gist.languages.forEach(function(lang){
        langstr+=lang + ' ';
    });
    langsdiv.appendChild(document.createTextNode(langstr));
    footer.appendChild(langsdiv);

    ///favorite button
    var fav = document.createElement('img');
    fav.setAttribute('src', 'emptyStar.png');
    fav.setAttribute('alt', 'favorite');
    fav.setAttribute('class', 'favoritebutton');
    fav.setAttribute('id', gist.id);
    fav.setAttribute('onclick', 'favorite(this.id, this)');
    footer.appendChild(fav);
    
    secondline.appendChild(footer);

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

function getGistsButton(){
    //initialize
    GistList = [];
    GistList.ids = [];
    var langaugesSelected = [];
    
    //exctact paramater from html element
    var pageSelect = document.getElementById('page-select');
    numPages = pageSelect.options[pageSelect.selectedIndex].value
    console.log(numPages, " pages of gists requested");
    
    //call recursive Get
    getGists(numPages,1);
    
}

//attached to search button
function getGists(PagesRequested, PageNum) {

    var url = 'https://api.github.com/gists?page=' + PageNum;
    console.log("request url: ", url);
    //var url = 'http://web.engr.oregonstate.edu/~swansonb/web3/gists';  //TODO reset to github api
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
            console.log('page', PageNum);

            if (this.response) {
                GistsFeed = JSON.parse(this.response);
            } else {
                throw 'no response';
            }

            //////make an array of gists////            
            GistsFeed.forEach(function (g) {

                if(GistList.indexOf(g.id) == -1 ) {
                    GistList.push(CreateGist(g));
                    GistList.ids.push(g.id);
                }
                
            });

            
            /////recusive call to xmlrequest,  update page elements on breakcase
            if(PageNum<PagesRequested){
                getGists(PagesRequested,++PageNum);
            } else {
                ////make calls to update database and refresh
                console.log("all pages loaded, refresing page now");
                updateLanguagePanel();
                updateList();
            }

        }
    };

    //sending request
    gistReq.open('GET', url);
    gistReq.send();

}

function CreateGist(g){
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
    }
    
    return nextGist;
}
