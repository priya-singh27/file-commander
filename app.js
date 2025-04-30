const fs = require('fs/promises');

(async ()=>{
    //All FileHandler objects are <EventEmitter>s
    const commandFileHandler = await fs.open("./command.txt","r");//

    commandFileHandler.on("change", async ()=>{
        // console.log(`The ${event.filename} changed`);
            
        //get the size of file(Buffer: memory container)
        const size = (await commandFileHandler.stat()).size;//file data:size of file, timestamp  etc..

        //allocate our buffer with the size of the file
        const buff= Buffer.alloc(size);

        //the location at whcih we want to start filling our buffer
        const offset=0;

        //how many bytes we want to read
        const length= buff.byteLength;

        //position that we want to start reading the file from
        const position = 0;

        // console.log(`buff: ${buff}`)

        //we always want to read the whole content(from beginning to the end)
        const content = await commandFileHandler.read(buff);

        await commandFileHandler.read(buff,offset, length, position);

        //decoder 01 => meaningful
        //encoder meaningful => 01
        
        console.log(buff.toString('utf-8'));
    })

    // console.log(commandFileHandler.fd)

    const watcher = fs.watch('./command.txt');

    // console.log(watcher); //async

    for await (const event of watcher){
        if(event.eventType=== "change"){
            commandFileHandler.emit("change");
        }
    }
})();