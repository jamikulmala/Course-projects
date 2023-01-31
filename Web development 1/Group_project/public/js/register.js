/**
 * TODO: 8.4 Register new user
 *       - Handle registration form submission
 *       - Prevent registration when password and passwordConfirmation do not match
 *       - Use createNotification() function from utils.js to show user messages of
 *       - error conditions and successful registration
 *       - Reset the form back to empty after successful registration
 *       - Use postOrPutJSON() function from utils.js to send your data back to server
 * 
 */

const form = document.getElementById("register-form");
form.addEventListener("submit", function(e){
    e.preventDefault();
    const data = new FormData(form);

    if(data.get("password") !== data.get("passwordConfirmation")){
        createNotification("400 Bad request","notifications-container", isSuccess = false);
    }
    else{
        createNotification("201 created", "notifications-container", isSuccess = true);
        const json = {
            "name": data.get("name"),
            "email": data.get("email"),
            "password": data.get("password")
          }
        postOrPutJSON("/api/register", "POST" ,json);
        form.reset();
    }
})
    