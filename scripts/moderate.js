"use strict";

let contentc = document.getElementById("contentcell");

firebase.auth().onAuthStateChanged((user) => {

    //console.dir(user);

    document.getElementById("spinner").hidden = true;

    if (user) { //logged in!
        let sin = document.getElementsByClassName("signinbtn");
        sin[0].setAttribute("hidden", "true");
        sin[1].setAttribute("hidden", "true");
        let sout = document.getElementsByClassName("signoutbtn");
        sout[0].removeAttribute('hidden');
        sout[0].style.animation = "fadein .5s";
        sout[1].removeAttribute('hidden');
        sout[1].style.animation = "fadein .5s";
        let userpic = document.getElementsByClassName("userpic");
        userpic[0].src = user.photoURL;
        userpic[1].src = user.photoURL;

        firebase.database().ref("content-edit").on("value", function (snapshot) {
            loadEdits(snapshot);
            });

        //load pending
        firebase.database().ref("content").on("value", function (snapshot) {
            document.getElementById("loginplscell").hidden = true;
            let allfiles = snapshot.toJSON();
            firebase.database().ref("content-directory").on("value", function (snapshot2) {
                loadPending(allfiles, snapshot2);
            });

            if (isMobile) {
                document.getElementsByClassName("footer")[0].style.display = "none";
                document.getElementsByClassName("footer-mobile")[0].style.display = "block";
            }

            document.getElementById("spinner").hidden = true;
            document.getElementById("editcell").hidden = false;
            document.getElementById("editcell").style.animation = "fadein .5s";
        }, function (err) {
            console.dir(err);

            document.getElementById("contentcell").hidden = true;
            document.getElementById("editcell").hidden = true;
            document.getElementById("loginplscell").hidden = false;
            document.getElementById("loginplscell").style.animation = "fadein .5s";

            document.getElementsByClassName("footer")[0].style.display = "block";
            document.getElementsByClassName("footer-mobile")[0].style.display = "none";

        });
    }
    else {
        let sin = document.getElementsByClassName("signinbtn");
        sin[0].removeAttribute('hidden');
        sin[0].style.animation = "fadein .5s";
        sin[1].removeAttribute('hidden');
        sin[1].style.animation = "fadein .5s";

        document.getElementById("contentcell").hidden = true;
        document.getElementById("editcell").hidden = true;
        document.getElementById("loginplscell").hidden = false;
        document.getElementById("loginplscell").style.animation = "fadein .5s";
    }
});


function loadPending(allfiles, snapshot){
    let diritems = snapshot.toJSON();
    //console.dir(diritems);

    let newfilelist = document.getElementById("filelist");
    while (newfilelist.firstChild) //clear the way
    {
        newfilelist.removeChild(newfilelist.firstChild);
    }

    for(let filename in allfiles)
    {
        /*console.dir(filename);
        console.dir(diritems);
        console.dir(diritems.filename);*/
        if(!diritems[filename]) //item doesn't exist in the directory yet!
        {
            let li = document.createElement('li');
            li.class = "mdl-list__item";
            li.innerHTML = '<span class="mdl-list__item-primary-content"><a target="_blank" href="article.html?file='.concat(
                filename, '">',
                filename, ' by ', allfiles[filename].author, '</a>',
                `<button class="moderatebutton mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onclick="acceptArticle('`, filename, `')">Accept</button>`,
                `<button class="moderatebutton mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onclick="deleteArticle('`, filename, `')">Delete</button>`,
                '</span></li>')
            newfilelist.appendChild(li);
        }
    }

    document.getElementById("spinner").hidden = true;
    document.getElementById("contentcell").hidden = false;
    document.getElementById("contentcell").style.animation = "fadein .5s";
    if(isMobile)
    {
        document.getElementsByClassName("footer")[0].style.display = "none";
        document.getElementsByClassName("footer-mobile")[0].style.display = "block";
    }
}

function loadEdits(snapshot){
    let editlist = document.getElementById("editlist");
    while (editlist.firstChild) //clear the way
    {
        editlist.removeChild(editlist.firstChild);
    }

    let allfiles = snapshot.toJSON();

    for(let filename in allfiles)
    {
        for(let edit in allfiles[filename])
        {
            let date = new Date(parseInt(edit));

            let li = document.createElement('li');
            li.class = "mdl-list__item";
            li.innerHTML = '<span class="mdl-list__item-primary-content"><a target="_blank" href="article.html?file='.concat(
                filename, '&edit=', edit, '">',
                filename, ' by ', allfiles[filename][edit].author, ' at ', date.toDateString(), ' ', date.getHours(), ':',  ('0'+date.getMinutes()).slice(-2), '</a>',
                `<a href="article.html?file=`, filename, `" target="blank"> <button class="moderatebutton mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Current</button></a>`,
                `<button class="moderatebutton mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onclick="acceptEdit('`, filename, `',`, edit, `)">Accept</button>`,
                `<button class="moderatebutton mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onclick="deleteEdit('`, filename, `',`, edit, `)">Delete</button>`,
                '</span></li>');
            editlist.appendChild(li);
        }
    }
}



function acceptArticle(filename){
    firebase.database().ref("content/".concat(filename)).once("value", function(snapshot)
    {
        let article = snapshot.toJSON();
        delete article.text;
        firebase.database().ref('content-directory/'.concat(filename)).set(article);
    });
}

function acceptEdit(filename, edit){
    firebase.database().ref("content-edit/".concat(filename,"/",edit)).once("value", function(snapshot)
    {
        let article = snapshot.toJSON();
        console.dir(article);
        console.dir("content-edit/".concat(filename,"/",edit));
        firebase.database().ref('content/'.concat(filename)).set(article);
        console.dir(article);
        delete article.text;
        firebase.database().ref('content-directory/'.concat(filename)).set(article);
        firebase.database().ref("content-edit/".concat(filename, '/', edit)).remove();
    });
}

function deleteArticle(filename){
    firebase.database().ref("content/".concat(filename)).remove();
}

function deleteEdit(filename, edit){
    firebase.database().ref("content-edit/".concat(filename, '/', edit)).remove();
}