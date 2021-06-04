document.addEventListener("DOMContentLoaded", () => {

    document.querySelector('button').addEventListener('click', onclick, false)

    function onclick(){
        if (document.querySelector('button').innerText === "Stop shopping"){
            chrome.runtime.sendMessage({toggle: "on" })
            document.querySelector('button').innerText = "Start shopping"
        }else{
            chrome.runtime.sendMessage({toggle: "off" })
            document.querySelector('button').innerText = "Stop shopping"
        }
    }

    const display = document.getElementById("checkout")
    let counter = 0
    chrome.runtime.sendMessage({req: "get count"}, (response) => {
        console.log("test")
        counter = response.res
        display.innerHTML = counter
    })
    
})
