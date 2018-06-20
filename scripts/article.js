"use strict";


let uriparams = getParams();

let filename = uriparams.file;
let editnum = uriparams.edit;
let article;

let theuser;
let contentc = document.getElementById('content');

showdown.setOption('parseImgDimensions', 'true');
showdown.setOption('simplifiedAutoLink', 'true');
showdown.setOption('excludeTrailingPunctuationFromURLs', 'true');
showdown.setOption('strikethrough', 'true');
showdown.setOption('tables', 'true');
showdown.setOption('tasklists', 'true');
showdown.setOption('simpleLineBreaks', 'true');
showdown.setOption('requireSpaceBeforeHeadingText', 'true');

document.getElementById("contentcell").style.animation = "fadein .5s";
document.getElementById("loginplscell").style.animation = "fadein .5s";


function loadArticle(){
    if(editnum == null)
    {
        firebase.database().ref("/content/".concat(filename)).on("value", function(file)
        {
            //console.dir(snapshot.());
            document.getElementById("spinner").hidden = true;

            if(isMobile)
            {
                document.getElementsByClassName("footer")[0].style.display = "none";
                document.getElementsByClassName("footer-mobile")[0].style.display = "block";
            }

            article = file.toJSON();
            contentc.getElementsByTagName("h1")[0].innerHTML = article.title;
            contentc.getElementsByClassName("mdl-chip__text")[0].innerHTML = article.subject;
            console.dir(article.text);
            //let txt = $.makeArray(article.text);
            let txt = $.map(article.text, function(value, index) {
                return [value];
            });
            let converter = new showdown.Converter();
            converter.setOption('tables', 'true');
            document.getElementById("contentText").innerHTML = converter.makeHtml(txt.join('\n'));
            document.getElementById('subjectlink').href = "index.html?search=".concat(article.subject);

            if(theuser)
                document.getElementById("contentcell").hidden = false;
            else
                document.getElementById("loginplscell").hidden = false;
        });
    }
    else
    {
        firebase.database().ref("/content-edit/".concat(filename, "/", editnum)).on("value", function(file)
        {
            //console.dir(snapshot.());
            document.getElementById("spinner").hidden = true;

            if(isMobile)
            {
                document.getElementsByClassName("footer")[0].style.display = "none";
                document.getElementsByClassName("footer-mobile")[0].style.display = "block";
            }

            article = file.toJSON();
            let contentc = document.getElementById('content');
            contentc.getElementsByTagName("h1")[0].innerHTML = article.title;
            contentc.getElementsByClassName("mdl-chip__text")[0].innerHTML = article.subject;
            console.dir(article.text);
            //let txt = $.makeArray(article.text);
            let txt = $.map(article.text, function(value, index) {
                return [value];
            });
            let converter = new showdown.Converter();
            converter.setOption('tables', 'true');
            document.getElementById("contentText").innerHTML = converter.makeHtml(txt.join('\n'));
            document.getElementById('subjectlink').href = "index.html?search=".concat(article.subject);

            if(theuser)
                document.getElementById("contentcell").hidden = false;
            else
                document.getElementById("loginplscell").hidden = false;
        });
    }
}

loadArticle();




firebase.auth().onAuthStateChanged((user) => {
    
    console.dir(user);

    if(user){ //logged in!
        theuser = user;

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

        loadArticle();

        firebase.database().ref("/userprefs/".concat(theuser.uid)).once("value", function(userprefs)
        {
            let prefs = userprefs.toJSON();
            if(!prefs.favs) return;

            let favs = prefs.favs;
            if(favs.indexOf(filename) != -1 ) //is fav
            {
                let fab = document.getElementsByClassName("fab")[0];
                fab.classList.add("fabactive");
            }
        });

        if(contentc.getElementsByClassName("mdl-chip__text")[0].innerHTML !== "")
            document.getElementById("contentcell").hidden = false;

        document.getElementById("loginplscell").hidden = true;
    }
    else{
        let sin = document.getElementsByClassName("signinbtn");
        sin[0].removeAttribute('hidden');
        sin[0].style.animation = "fadein .5s";
        sin[1].removeAttribute('hidden');
        sin[1].style.animation = "fadein .5s";


        document.getElementById("spinner").hidden = true;
        document.getElementById("contentcell").hidden = true;
        document.getElementById("loginplscell").hidden = false;
    }
});

function editArticle()
{
    window.location = 'contribute.html?edit='.concat(filename);
}

function favThis()
{
    if(!theuser) return;

    firebase.database().ref("/userprefs/".concat(theuser.uid)).once("value", function(userprefs)
    {
        let prefs = userprefs.toJSON();
        let favs;
        if(prefs != null)
            favs = prefs.favs;
        else
            prefs = {};

        if(favs == null)
        {
            favs = filename + ',';
        }
        else if(favs.indexOf(filename) == -1 ) //add fav
        {
            favs = favs.concat(filename, ",");
        }
        else //remove fav
        {
            favs = favs.replace(filename+',', '');
        }

        console.dir(favs);

        prefs.favs = favs;

        firebase.database().ref("/userprefs/".concat(theuser.uid)).set(prefs);
    });

    let fab = document.getElementsByClassName("fab")[0];
    if(fab.classList.contains("fabactive"))
        fab.classList.remove("fabactive");
    else
        fab.classList.add("fabactive");
}