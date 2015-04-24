var GistList = [];
function Gist (desciption, useravtimg, username, userhtml, gisthtml, languages, id) {
    this.description = desciption;
    this.useravtimg = useravtimg;
    this.username = username;
    this.userhtml = userhtml;
    this.gisthtml = gisthtml;
    this.languages = languages;
    this.id = id;
}

function loadFavorites() {
    //TODO implement
    console.log('onload called loadFavorites');
    
    var glistsection = document.getElementById("gistlist");
    var g = document.createElement('div');
    g.setAttribute('class', 'gistItem');
    var t = document.createTextNode('gist item 1');
    g.appendChild(t);
    glistsection.appendChild(g);
    
    
}


//attached to search button
function getGists() {

    console.log('getGists running');

    //var url = 'https://api.github.com/gists';
    var url = 'http://web.engr.oregonstate.edu/~swansonb/web3/gists';
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
                
                nextGist = new Gist();
                
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
                for (var f in g.files){ 
                    nextGist.languages.push(g.files[f].language);
                }
                
                GistList.push(nextGist);
                
            });
        }
    };
    
    //sending request
    gistReq.open('GET', url);
    gistReq.send();
}