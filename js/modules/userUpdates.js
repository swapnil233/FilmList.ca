// Import errorPopup and successPopup from popups.js
import { errorPopup, successPopup } from "./popups.js";

// Grab pfp and store it in 'file'
let file = {}
window.chooseFile = (e) => {
    // Get the file from local machine
    file = e.target.files[0]
    console.log(file)
    console.log(file.name)
    console.log(file.type)
}

// Update pfp
const updateDp = async (currentUser) => {
    // Check if new dp has been added/exists.
    if ("name" in file) {
        try {
            // Check if uploaded file is an image
            if (
                file.type !== "image/jpeg" &&
                file.type !== "image/jpg" &&
                file.type !== "image/png" &&
                file.type !== "image/gif"
            ) {
                // Create a pop-up to notify user that the file is not an image
                errorPopup("File is not an image");
                return;
            }

            // Check image file size
            if (file.size / 1024 / 1024 > 10) {
                // Create a pop-up to notify user that the file is too large
                errorPopup("Size too large");
                return;
            }
            console.log("Image passed requirements")

            storage.ref("users/" + currentUser.uid + "/profileImage").put(file).then

            // Create storage ref & put the file in it
            const userPicRef = storage.ref(
                "users/" + currentUser.uid + "/profileImage"
            );

            await userPicRef.put(file);
            console.log("Image uploaded")

            // success => get download link, put it in DB, update dp img src
            const imgURL = await userPicRef.getDownloadURL();
            console.log(`Image URL: ${imgURL}`)
            await db.collection("users").doc(currentUser.uid).set({
                dp_URL: imgURL,
                dp_URL_last_modified: file.lastModified,
            }, {
                merge: true,
            });

            console.log("Document Added")
            document.querySelector("#nav_dp").src = imgURL;

            // Clear out the file
            file = ""

            // Success message
            successPopup("Success!");
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log("Empty/no file");
    }
}

// Update username
const updateUsername = async (newName) => {
    await auth.currentUser.updateProfile({
        displayName: newName
    })

    // Once the name has been updated, append it to the user dropdown menu
    updateDisplayNameInDOM(auth.currentUser)

    // Update username in placeholder
    document.querySelector("#profile_name").placeholder = auth.currentUser.displayName;
}

// Show user's display name inside the DOM
const updateDisplayNameInDOM = (currentUser) => {
    document.querySelector("#user_name").innerHTML = currentUser.displayName;
}

export {file, updateDp, updateUsername, updateDisplayNameInDOM}