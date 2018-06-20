"use strict";

let contentc = document.getElementById('content');

let uriparams = getParams();


//get login info
firebase.auth().onAuthStateChanged((user) => {
    
    console.dir(user);

    if(user){ //logged in!
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

        if(isMobile)
        {
            document.getElementsByClassName("footer")[0].style.display = "none";
            document.getElementsByClassName("footer-mobile")[0].style.display = "block";
        }

        document.getElementById("loginplscell").hidden = true;

        //remove existing cards to avoid double loading
        let allcards = document.getElementsByClassName("card");
        for(let card of allcards)
        {
            if(card.id != "cardTemplate") card.hidden = true;
        }

        //load article cards
        firebase.database().ref("/content-directory").on("value", function(snapshot)
        {
            //console.dir(snapshot.toJSON());

            document.getElementById("spinner").hidden = true;
            document.getElementsByClassName("footer-mobile")[0].style.display = "none";


            let content = snapshot.toJSON();

            if(user) //draw favs
            {
                firebase.database().ref("/userprefs/".concat(user.uid)).on("value", function(userprefs)
                {
                    //remove existing cards to avoid double loading
                    let allcards = document.getElementsByClassName("card");
                    for(let card of allcards)
                    {
                        if(card.id != "cardTemplate") card.hidden = true;
                    }

                    let prefs = userprefs.toJSON();
                    let thefavs;
                    if(prefs && prefs.favs && prefs.favs != '')
                    {
                        thefavs = prefs.favs.split(",");
                        thefavs.pop();


                        for(let i = thefavs.length-1; i>=0; i--)
                        {
                            if(content[thefavs[i]]) //create the card
                            {
                                if(uriparams.search &&
                                    !content[thefavs[i]].title.toLowerCase().includes(uriparams.search.toLowerCase()) &&
                                    !content[thefavs[i]].subject.toLowerCase().includes(uriparams.search.toLowerCase())) continue;

                                let card = document.getElementById('cardTemplate').cloneNode(true);
                                card.hidden = false;
                                card.getElementsByClassName("mdl-card__title-text")[0].childNodes[0].innerHTML = content[thefavs[i]].title;
                                card.getElementsByClassName("mdl-chip__text")[0].innerHTML = content[thefavs[i]].subject;
                                card.getElementsByClassName("mdl-card__supporting-text")[0].innerHTML = content[thefavs[i]].shortinfo;
                                card.getElementsByTagName("a")[0].href= "article.html?file=".concat(thefavs[i]);
                                //contentc.appendChild(card);
                                contentc.insertBefore(card, contentc.firstChild);
                                card.style.backgroundColor = "#fff5f8";
                                card.style.animation = "fadein .5s";
                                card.id="";

                            }
                        }

                    }

                    for(let articleName in content) //draw nonfavs
                    {
                        //console.dir(uriparams.search);

                        if(uriparams.search &&
                            !content[articleName].title.toLowerCase().includes(uriparams.search.toLowerCase()) &&
                            !content[articleName].subject.toLowerCase().includes(uriparams.search.toLowerCase())
                            || thefavs && thefavs.includes(articleName)) continue;
                        //console.dir(article);
                        //console.dir(content[article]);

                        let card = document.getElementById('cardTemplate').cloneNode(true);
                        card.hidden = false;
                        card.getElementsByClassName("mdl-card__title-text")[0].childNodes[0].innerHTML = content[articleName].title;
                        card.getElementsByClassName("mdl-chip__text")[0].innerHTML = content[articleName].subject;
                        card.getElementsByClassName("mdl-card__supporting-text")[0].innerHTML = content[articleName].shortinfo;
                        card.getElementsByTagName("a")[0].href= "article.html?file=".concat(articleName);
                        //contentc.appendChild(card);
                        contentc.insertBefore(card, contentc.getElementsByClassName("footer-mobile")[0]);
                        card.style.animation = "fadein .5s";
                        card.id="";
                    }
                });
            }
            /*else //not logged in
            {
                for(let articleName in content)
                {
                    //console.dir(uriparams.search);

                    if(uriparams.search &&
                        !content[articleName].title.toLowerCase().includes(uriparams.search.toLowerCase()) &&
                        !content[articleName].subject.toLowerCase().includes(uriparams.search.toLowerCase())) continue;
                    //console.dir(article);
                    //console.dir(content[article]);

                    let card = document.getElementById('cardTemplate').cloneNode(true);
                    card.hidden = false;
                    card.getElementsByClassName("mdl-card__title-text")[0].childNodes[0].innerHTML = content[articleName].title;
                    card.getElementsByClassName("mdl-chip__text")[0].innerHTML = content[articleName].subject;
                    card.getElementsByClassName("mdl-card__supporting-text")[0].innerHTML = content[articleName].shortinfo;
                    card.getElementsByTagName("a")[0].href= "article.html?file=".concat(articleName);
                    //contentc.appendChild(card);
                    contentc.insertBefore(card, contentc.getElementsByClassName("footer-mobile")[0]);
                    card.style.animation = "fadein .5s";
                    card.id="";
                }
            }*/

        });

    }
    else{
        let sin = document.getElementsByClassName("signinbtn");
        sin[0].removeAttribute('hidden');
        sin[0].style.animation = "fadein .5s";
        sin[1].removeAttribute('hidden');
        sin[1].style.animation = "fadein .5s";

        document.getElementById("loginplscell").hidden = false;
        document.getElementById("spinner").hidden = true;
    }


});
