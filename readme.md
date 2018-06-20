# Firebase wiki

### Your wiki, powered by Firebase

This is a simple and lightweight wiki with support for user editing and moderation.

You can use a free Google account to deploy this page to Firebase Hosting. It uses the Firebase Realtime Database service for storing data.

This was my first proper web project, so its often *hacky* or *weird*. I still think this project is a good starting point for seeing how FRD actually works.  


### Stuff you need to set up

**.firebaserc**

**In every .html:**
        
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: ""

**In your firebase database rules:**

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

You can easily find your accounts UID by logging in and visiting the Firebase Authentication page in the Firebase console.