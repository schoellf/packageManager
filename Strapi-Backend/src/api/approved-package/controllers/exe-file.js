const { execSync } = require('child_process');
const fs = require("fs");

module.exports = {
    async buildAndSendExe(ctx) {
      // Your custom logic goes here
      let selectedPackages = JSON.parse(ctx.request.body);
      let packageString = "let packageString = '";
      for(let pkg of selectedPackages){
        packageString += pkg.identifier + "%" + pkg.versions[0]+"&";
      }
      packageString = packageString.slice(0,-1);
      packageString += "'";

      fs.writeFileSync("./src/exeBuild/installer.js",packageString);
      
      let templateContent = fs.readFileSync("./src/exeBuild/exeBuilderTemplate.txt");

      fs.appendFileSync("./src/exeBuild/installer.js",templateContent);

      let timestamp = new Date().getTime();
      execSync("pkg ./src/exeBuild/installer.js -t node18-win-x64 -o ./src/exeBuild/.tmp"+timestamp+"/installer.exe");

      ctx.set('Content-Disposition', 'attachment; filename="installer.exe"');
      ctx.set('Content-Type', 'application/x-msdownload');

      ctx.send(fs.readFileSync("./src/exeBuild/.tmp"+timestamp+"/installer.exe"));
      execSync('rmdir "./src/exeBuild/.tmp'+timestamp+'" /s /q');
    },
  };