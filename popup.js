document.addEventListener("DOMContentLoaded", () => {
    
    const displayCount = document.getElementById("checkout")
    const displayDays = document.getElementById("days")
    const displayButton = document.getElementById("shopping")
    let counter = 0
    let days = 0
    let text = "Start shopping"
    chrome.runtime.sendMessage({req: "get data"}, (response) => {
        counter = response.resCount
        days = response.resDays
        text = response.resText
        displayCount.innerHTML = counter
        displayDays.innerHTML = days
        displayButton.textContent = text
    })
    document.querySelector('button').addEventListener('click', onclick, false)
    // sends toggle message to background.js to update local storage
    function onclick(){
        if (document.querySelector('button').innerText === "Stop shopping"){
            chrome.runtime.sendMessage({toggle: "on" })
            document.querySelector('button').innerText = "Start shopping"
            chrome.tabs.reload();
            
        }else{
            chrome.runtime.sendMessage({toggle: "off" })
            document.querySelector('button').innerText = "Stop shopping"
            chrome.tabs.reload();
        }
    }

   
    
})
