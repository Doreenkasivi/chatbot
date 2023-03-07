
module.exports = {
  async pdfHandler({sock, args, m}){
    const puppeteer = require('puppeteer');
      try {
        sock.sendMessage(m.key.remoteJid, {text: "😁 Please wait. Downloading..."}, {quoted: m})
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`https://www.google.com/search?q=${args}&num=100`);
        const pdfLinks = await page.$$eval('a[href$=".pdf"]', links =>
          links.map(link => link.href)
        );
       if(pdfLinks.length <= 0){
        sock.sendMessage(m.key.remoteJid, {text: "😢 No Book Found."}, {quoted: m})

       }else{
        sock.sendMessage(
          m.key.remoteJid, 
          { document: { url: pdfLinks[0]}},
          {quoted: m}
      )
       }
        
        await browser.close();

      }
      catch (error){
        sock.sendMessage(m.key.remoteJid, {text: "⚠️ Error occured."+error}, {quoted: m})

      }
    }
  }