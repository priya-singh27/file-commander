const fs = require('fs/promises');

(async ()=>{
    const commandFileHandler = await fs.open("./command.txt","r");//
    console.log(commandFileHandler.fd)
    const watcher = fs.watch('./command.txt');
    // console.log(watcher); //async

    for await (const event of watcher){
        if(event.eventType=== "change"){
            console.log(`The ${event.filename} changed`);
            
            //get the size of file(Buffer: memory container)
            const size = (await commandFileHandler.stat()).size;//file data:size of file, timestamp  etc..
            const buff= Buffer.alloc(size);

            const offset=0;
            const length= buff.byteLength;
            const position = 0;

            console.log(`buff: ${buff}`)
            const content = await commandFileHandler.read(buff);

            // const content = await commandFileHandler.read(buff,offset, length, position);
            console.log(content);
        }
    }
})();