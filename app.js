const fs = require('fs/promises');

(async ()=>{
    let addedContent = false;
    const addToFile = async(path, content)=>{
        if(addedContent == true) return;

        await fs.appendFile(path, content);
        addedContent= true;
        return console.log(`Content appended to the file ${path}`);
    }
    const renameFile = async(oldFilePath, newFilePath)=>{
        try{
            await fs.rename(oldFilePath, newFilePath);
            return console.log(`File ${oldFilePath} renamed to ${newFilePath}`)
        }catch(err){
            if(err.code === 'ENOENT'){
                console.log('No file at this path')
            }else{
                console.log(`Some error occured ${err}`)
            }
        }
    }
    const deleteFile = async(path)=>{
        try{
            console.log(`Deleting file ${path}...`);
            await fs.unlink(path);
            return console.log(`File ${path} deleted`);
        }catch(err){
            if(err.code === 'ENOENT'){
                console.log('No file at this path')
            }else{
                console.log(`Some error occured ${err}`)
            }
        }
    }

    const createFile = async(path)=> {
        try{
            const fileHandler = await fs.open(path, 'r');
            fileHandler.close();
            return console.log(`The file ${path} already exist`)
        }catch(err){
            const newFileHandler = await fs.open(path, 'w');
            console.log(`File ${path} created successfully`);
            newFileHandler.close();
        }
    };

    //commands
    const CREATE_FILE = "create the file"
    const DELETE_FILE = "delete the file"
    const RENAME_FILE = "rename the file"
    const ADD_TO_FILE = "add to the file"


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
        // const content = await commandFileHandler.read(buff);

        await commandFileHandler.read(buff,offset, length, position);

        //decoder 01 => meaningful
        //encoder meaningful => 01
        const command = buff.toString('utf-8')
        if(command.includes(CREATE_FILE)){
            const filePath = command.substring(CREATE_FILE.length+1);
            createFile(filePath)
        }

        if(command.includes(DELETE_FILE)){
            const filePath = command.substring(DELETE_FILE.length+1);
            deleteFile(filePath);
        }

        //rename command: rename the file <path> to <new-path>
        if(command.includes(RENAME_FILE)){
            const idx = command.indexOf(" to ");
            const oldFilePath = command.substring(RENAME_FILE.length+1, idx);
            const newFilePath = command.substring(idx+4);
            renameFile(oldFilePath, newFilePath);
        }

        //add to file command: add to the file <path> this content: <content>
        if(command.includes(ADD_TO_FILE)){
            const idx = command.indexOf(" this ");
            const filePath = command.substring(ADD_TO_FILE.length+1, idx);

            const idxOfColon = command.indexOf(":")
            const content = command.substring(idxOfColon+1);

            addToFile(filePath, content);
        }
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