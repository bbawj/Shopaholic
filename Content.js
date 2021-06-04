document.addEventListener("DOMSubtreeModified", getCheckout )
document.addEventListener("DOMContentLoaded", getCheckout )


function getCheckout(){
    const replace = document.createElement('div')
    replace.innerHTML = "<span style='font-size:50px;color:red'>STOP SHOPPING</span>"
    let items = [...document.querySelectorAll("[class*='checkout' i]")]
    items = [...items,...document.querySelectorAll("[value*='checkout' i]"), ...document.querySelectorAll("[href*='checkout' i]")]
    if (items){
        items.forEach(item => {
            item.parentNode.replaceChild(replace, item)
            chrome.runtime.sendMessage({count: "count"})
        })
    }
}