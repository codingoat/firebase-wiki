"use strict";

showdown.setOption('parseImgDimensions', 'true');
showdown.setOption('simplifiedAutoLink', 'true');
showdown.setOption('excludeTrailingPunctuationFromURLs', 'true');
showdown.setOption('strikethrough', 'true');
showdown.setOption('tables', 'true');
showdown.setOption('tasklists', 'true');
showdown.setOption('simpleLineBreaks', 'true');
showdown.setOption('requireSpaceBeforeHeadingText', 'true');


let theuser;

function previewArticle() {
    document.getElementById('previewbutton').hidden = true;
    document.getElementById('textcontainer').hidden = true;
    document.getElementById('editbutton').hidden = false;
    document.getElementById('contenttext').hidden = false;

    let converter = new showdown.Converter();
    converter.setOption('tables', 'true');
    document.getElementById('contenttext').innerHTML = converter.makeHtml(document.getElementById('text').value);
}

function noPreviewArticle() {
    document.getElementById('previewbutton').hidden = false;
    document.getElementById('textcontainer').hidden = false;
    document.getElementById('editbutton').hidden = true;
    document.getElementById('contenttext').hidden = true;
}


firebase.auth().onAuthStateChanged((user) => {
    
    //console.dir(user);

    document.getElementById("spinner").hidden = true;
    if(isMobile)
    {
        document.getElementsByClassName("footer")[0].style.display = "none";
        document.getElementsByClassName("footer-mobile")[0].style.display = "block";
    }

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

        let params = getParams();
        if(params.edit != null) //editing an article
        {
            firebase.database().ref("/content/".concat(params.edit)).on("value", function(file)
            {
                let article = file.toJSON();
                //let converter = new showdown.Converter();
                //let texthtml = converter.(article.text);
                let txt = $.map(article.text, function(value, index) {
                    return [value];
                });
                console.dir(txt);
                document.getElementById('text').parentElement.MaterialTextfield.change(txt.join("\n"));
                //document.getElementById('title').value = article.title;
                document.getElementById('title').parentElement.MaterialTextfield.change(article.title);
                document.getElementById('subject').parentElement.MaterialTextfield.change(article.subject);
                document.getElementById('filename').parentElement.MaterialTextfield.change(params.edit);
                document.getElementById('shortinfo').parentElement.MaterialTextfield.change(article.shortinfo);
                //console.dir(snapshot.());
                document.getElementById("loginplscell").hidden = true;
                document.getElementById("tycell").hidden = true;
                document.getElementById("contentcell").hidden = false;
                document.getElementById("contentcell").style.animation = "fadein .5s";
            });
        }
        else{ //writing article from scratch
            document.getElementById("loginplscell").hidden = true;
            document.getElementById("tycell").hidden = true;
            document.getElementById("contentcell").hidden = false;
            document.getElementById("contentcell").style.animation = "fadein .5s";
        }

    }
    else{
        let sin = document.getElementsByClassName("signinbtn");
        sin[0].removeAttribute('hidden');
        sin[0].style.animation = "fadein .5s";
        sin[1].removeAttribute('hidden');
        sin[1].style.animation = "fadein .5s";

        document.getElementById("tycell").hidden = true;
        document.getElementById("contentcell").hidden = true;
        document.getElementById("loginplscell").hidden = false;
        document.getElementById("loginplscell").style.animation = "fadein .5s";
    }
    
});

function applyArticle()
{
    let filename = document.getElementById("filename").value;

    while(true)
    {
        if(!filename.includes(" ")) break;
        text.replace(" ", "-");
    }

    firebase.database().ref("content/".concat(filename)).once("value", function(snapshot)
    {
        let article = snapshot.toJSON();
        
        if(article) //editing mode
        {
            //alert("This file already exists! Change your filename.")
            let title = document.getElementById("title").value;
            let shortinfo = document.getElementById("shortinfo").value;
            let subject = document.getElementById("subject").value;
            let text = document.getElementById("text").value;


            let textBroken= [];

            while(text.length > 0)
            {
                if(text.includes("\n")){
                    textBroken.push(text.substring(0,text.indexOf("\n")));
                    text = text.substring(text.indexOf('\n')+1);
                }
                else{
                    textBroken.push(text);
                    text = "";
                }
            }

            let d = new Date();
            let time = d.getTime();

            firebase.database().ref('content-edit/' + filename + '/' + time).set({
                "title": title,
                "subject": subject,
                "shortinfo": shortinfo,
                "text": textBroken,
                "author": theuser.email,
            }).then(function(){
                document.getElementById("contentcell").hidden = true;
                document.getElementById("tycell").hidden = false;
                document.getElementById("tycell").style.animation = "fadein .5s";
            });

        }
        else //new
        {
            let title = document.getElementById("title").value;
            let shortinfo = document.getElementById("shortinfo").value;
            let subject = document.getElementById("subject").value;
            let text = document.getElementById("text").value;


            let textBroken= [];

            while(text.length > 0)
            {
                if(text.includes("\n")){
                    textBroken.push(text.substring(0,text.indexOf("\n")));
                    text = text.substring(text.indexOf('\n')+1);
                }
                else{
                    textBroken.push(text);
                    text = "";
                }
            }

            firebase.database().ref('content/' + filename).set({
                "title": title,
                "subject": subject,
                "shortinfo": shortinfo,
                "text": textBroken,
                "author": theuser.email,
            }).then(function(){
                document.getElementById("contentcell").hidden = true;
                document.getElementById("tycell").hidden = false;
                document.getElementById("tycell").style.animation = "fadein .5s";
            });

        }
    });
}