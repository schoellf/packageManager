let packageString = 'ZelloInc.Zello%2.6.0.0'
//a string with all packages will be written above this

const { execSync } = require('child_process');
const fs = require("fs");


// let filename = fs.readFileSync("./src/exeBuild/packages.txt",{encoding: "utf-8"})//process.argv0.split(".exe")[0];

let packages = packageString.split("&");

// Check if the filename is provided as an argument
if (packages.length > 0) {
    for(let package of packages){
        console.log("working on " + package);
        let id = package.split("%")[0];
        let version = package.split("%")[1];

        let command = `winget install --id ${id} -s ownsource`;

        if(version){
            command += ` -v ${version}`;
        }

        try{
            console.log(execSync(command));
        }catch(ex){
            console.log(ex);
        }
    }
    
} else {
  console.log('No filename argument provided.');
}
