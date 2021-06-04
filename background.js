const storageCache = {};
// Asynchronously retrieve data from storage.sync, then cache it.
const initStorageCache = getAllStorageSyncData().then(items => {
  // Copy the data retrieved from storage into storageCache.
  Object.assign(storageCache, items);
});

// Reads all data out of storage.sync and exposes it via a promise.
//
// Note: Once the Storage API gains promise support, this function
// can be greatly simplified.
function getAllStorageSyncData() {
  // Immediately return a promise and start asynchronous work
  return new Promise((resolve, reject) => {
    // Asynchronously fetch all data from storage.sync.
    chrome.storage.local.get('count', (items) => {
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
        if (request.count === "count"){
            console.log(storageCache)
            if (Object.keys(storageCache).length === 0){
                chrome.storage.local.set({count: 1})
            } else{
                storageCache["count"]++;
                chrome.storage.local.set(storageCache, () => {
                    console.log("New value set to "+storageCache.count )
                })
            }
        } else if (request.req ==="get count"){
            console.log(storageCache.count)
            sendResponse({res: storageCache.count})
            return true
        }
    }catch(e){
        console.log(e)
    }
        
})