import puppeteer from 'puppeteer';
const browser=await puppeteer.launch({headless:false});
const page=(await browser.pages())[0];
const client=await page.createCDPSession();
await client.send('Debugger.enable');
// await client.send('DOMDebugger.enable');
client.on('Debugger.paused',(event)=>{
    console.log(event.callFrames[0].location);
    client.send('Debugger.stepInto');
});
await client.send('Debugger.pause',({}));
await page.goto('https://www.kansai-u.ac.jp/ja/?stt_lang=ja');
await client.send('Debugger.setBreakpoint',{
   scriptId:3,
   location:{
        lineNumber:1,
        columnNumber:0,
    },
});
await client.send('DOMDebugger.setDOMbreakpoint',{
    nodeId:1,
    type:'subtree-modified',
});
await browser.close();
