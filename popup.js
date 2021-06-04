document.addEventListener("DOMContentLoaded", () => {
    const display = document.getElementById("checkout")
    let counter = 0
    chrome.runtime.sendMessage({req: "get count"}, (response) => {
        console.log("test")
        counter = response.res
        display.innerHTML = counter
    })
    
})
