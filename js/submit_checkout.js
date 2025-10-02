const scriptURL = "https://script.google.com/macros/s/AKfycbwxfWHedQILESG1XDFTWCsl2avQYOW44tkh5f6GrQjurZ2jTPCae9RN6GjMPrxjjyXH/exec"

let form = document.getElementById("form_contact");

form.addEventListener("submit" , (e) => {
    e.preventDefault()

    fetch(scriptURL , {
        method: "POST",
        body: new FormData(form),
    })
    .then((Response) => {
        setTimeout(() => {
            window.location.reload()
        },3000)
    })
    .catch((error) => console.error("eroor!" , error.message))
})