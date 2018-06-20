"use strict";

let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

let getParams = function(){
    let uriparamstr = decodeURIComponent(location.search).slice(1).split("&");
    let uriparams = {};
    for(let param of uriparamstr)
    { 
        uriparams[param.split("=")[0]] = param.split("=")[1]
    }

    return uriparams;
}


function signIn(){
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().useDeviceLanguage();
    firebase.auth().signInWithPopup(provider).then(function(result){
        console.dir(result);
        let sin = document.getElementsByClassName("signinbtn");
        sin[0].hidden = true;
        sin[1].hidden = true;
    });
}

function signOut(){
    firebase.auth().signOut().then(function() {
        location.reload();
    }).catch(function(error) {
        console.dir(error.message);
    });
}