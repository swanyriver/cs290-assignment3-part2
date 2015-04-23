function searchClick() {
    var below = document.getElementById("below");
    below.textContent = 'button pressed';
    console.log("button pressed");
}

function color() {
    var below = document.getElementById("below");
    below.style.backgroundColor = "blue";
    console.log('onload ran');
}

function getGists() {
    
    console.log("getGists running");
    
    var url = 'https://api.github.com/gists';
    var gistReq = new XMLHttpRequest();
    
    if (!gistReq) {
        throw 'unable to create XMLHttpRequest';
    }
    
    gistReq.onreadystatechange = function () {
        console.log(this.readyState, this.status, this.statusText);
        if (this.readyState === 4 && this.status === 200) {
            console.log("request done");
            
            if (this.response) {
                var GistsFeed = JSON.parse(this.response);
            } else {
                throw 'no response';
            }
            console.log(this.response);
            console.log(GistsFeed.toString());
        }
    };
    gistReq.open('GET', url);
    gistReq.send();
}
    