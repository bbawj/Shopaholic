const storageCache = {};
// Asynchronously retrieve data from storage.sync, then cache it.
const initStorageCache = getAllStorageSyncData().then(items => {
  // Copy the data retrieved from storage into storageCache.
  Object.assign(storageCache, items);
});

// Reads all data out of storage.sync and exposes it via a promise.

function getAllStorageSyncData() {
  // Immediately return a promise and start asynchronous work
  return new Promise((resolve, reject) => {
    // Asynchronously fetch all data from storage.sync.
    chrome.storage.local.get(['count','toggle','date','text'], (items) => {
      // Pass any observed errors down the promise chain.
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      // Pass the data retrieved from storage down the promise chain.
      resolve(items);
    });
  });
}

chrome.runtime.onMessage.addListener( async (request, sender, sendResponse) => {
    try{
        await initStorageCache;
        //send toggle state response to content.js (on/off)
        if (request.toggleReq === "toggle"){
            if (storageCache.hasOwnProperty('toggle')){
                sendResponse({toggle: storageCache.toggle})
                console.log(storageCache.toggle, storageCache.text)
                return true
            }else{
                storageCache["toggle"] = "on"
                storageCache["text"] = "Start shopping"
                chrome.storage.local.set(storageCache)
                sendResponse({toggle:"on"})
                return true
            }
        // set script on/off value  
        }else if (request.toggle ==="on"){
            storageCache['toggle'] = "on"
            storageCache['date'] = (new Date()).toJSON()
            storageCache['text'] = "Start shopping"
            chrome.storage.local.set(storageCache, ()=>{
                console.log("script turned on")
            })

        }else if (request.toggle === "off"){
            storageCache['toggle'] = "off"
            storageCache['date'] = "off"
            storageCache['text'] = "Stop shopping"
            chrome.storage.local.set(storageCache, ()=>{
                console.log("script turned off")
            })
        //set the storage count value
        }else if (request.count === "count"){
            console.log(storageCache)
            if (!storageCache.hasOwnProperty('count')){
                const now = (new Date()).toJSON()
                storageCache["count"] = 1
                storageCache["date"] = now 
                chrome.storage.local.set(storageCache)
            } else{
                storageCache["count"]++;
                chrome.storage.local.set(storageCache, () => {
                    console.log("New value set to "+storageCache.count )
                })
            }
        //send the count value to content.js
        }else if (request.date ==="date"){
            if (storageCache["date"]==="off"){
                const now = (new Date()).toJSON()
                storageCache["date"] = now
                chrome.storage.local.set(storageCache, () => {
                    console.log("Date stored as " +storageCache.date)
                })
            } 
        } 
        // send data to popup.js 
        else if (request.req ==="get data"){
            if (storageCache["date"]!=="off"){
                console.log(storageCache)
                const now = new Date()
                const diff = Math.floor((now - new Date(storageCache['date'])) / (1000*60*60*24))
                sendResponse({resCount: storageCache.count, resDays: diff, resText: storageCache.text})
                return true
            } else {
                sendResponse({resCount: storageCache.count, resDays: 0, resText: storageCache.text})
                return true
            }
            
        }
    }catch(e){
        console.log(e)
    }
        
})