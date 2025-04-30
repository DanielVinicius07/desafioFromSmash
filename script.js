function upload() {
    const fileInput = document.getElementById("uploadInput");
    const su = new SmashUploader({ region: "eu-west-3", token: "Put your api key here" })

    su.upload({ files: [...fileInput.files] })
        .then(transfer => { console.log("Transfer", transfer); })
        .catch(error => { console.log("Error", error); });

    su.on('progress', (event) => { console.log(event.data.progress.percent); });
}