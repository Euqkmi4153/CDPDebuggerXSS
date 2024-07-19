import puppeteer from 'puppeteer';
const browser=await puppeteer.launch({headless:false});
const page=(await browser.pages())[0];
const client=await page.createCDPSession();
await client.send('Debugger.enable');
await client.send('Debugger.pause',({}));
await page.goto('https://www.kansai-u.ac.jp/ja/?stt_lang=ja');
await client.send('Debugger.setBreakpoint',{
   scriptId:3,
   location:{
        lineNumber:1,
        columnNumber:0,
    },
});
client.on('Debugger.paused',(event)=>{
    Debugger.stepInto();
    console.log(event.callFrames[0].location);
});
await browser.close();
