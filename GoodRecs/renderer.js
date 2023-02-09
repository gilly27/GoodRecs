const dialogButton = document.getElementById('dialogButton')
const {ipcRenderer} = require('electron')

dialogButton.onclick = openDialog;

async function openDialog() {
    ipcRenderer.send("open-file","true")
}

ipcRenderer.on("open-file", (data) => {
    alert(data);
})