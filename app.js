const fs = require('fs/promises');

(async ()=>{
    const watcher = fs.watch('./command.txt');
    // console.log(watcher)
    for await (const event of watcher){
        if(event.eventType=== "change"){
            console.log(`The ${event.filename} changed`)
        }
    }
})();