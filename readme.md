# Firebase wiki

### Your wiki, powered by Firebase




### Stuff you need to set up

.firebaserc

In every .html
        
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: ""

In your firebase database rules

        {
          "rules": {
            "content":{
                ".read": "auth != null",
                ".write": "auth.uid === 'MODERATOR ID'"
            },
            "content-directory":{
                ".read": "auth != null",
                ".write": "auth.uid === 'MODERATOR ID'"
            },
            "content-edit":{
              ".read": "auth.uid === 'MODERATOR ID'",
              ".write": "auth != null"
            },
            "userprefs":{
               "$uid": {
                ".read": "$uid === auth.uid",
                ".write": "$uid === auth.uid"
              }
            }
          }
        }