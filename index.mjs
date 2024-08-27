import puppeteer from 'puppeteer';


  const browser = await puppeteer.launch({ headless: false });
  const page = (await browser.pages())[0];
  const client = await page.createCDPSession();
  await client.send('Debugger.enable');
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Debugger.pause',({}));
  
  //   if(/eval\(/.test(payload)){
    //     console.warn('Payload contains alert:',payload);
    //   }else{
        //     console.log('Paylaod does not contain alert');
        //   };
        client.on('Page.loadEventFired',async()=>{
            await browser.close();
        });

  // client.on("Runtime.domContentEventFired",async()=>{
    //     await browser.close();
    // });
    
    
    //     await page.evaluate(()=>{
        //     document.addEventListener('Page.DOMContentLoaded', async () => {
            //         await browser.close(); 
            //       });
            //    });
            const hash=Math.random().toString(32).substring(2);
            await client.send("Page.navigate", {
                url: `http://localhost:3000#{hash}`
            });
            let stepIntoPromise = Promise.resolve(); 
            
            client.on('Debugger.paused', async (event) => {
                const scriptId = event.callFrames[0].location.scriptId;
                console.log(scriptId);
                const regex1=/eval\(|new Function\(|setTimeout\(|setInterval\(/g;
                const getSource=await client.send("Debugger.getScriptSource",{scriptId});
                let match;
                let matches=[];
                while((match=regex1.exec(getSource))!=null){
                    matches.push(match[0]);
                };
                // console.log(match);
                // const saving=match;
                // if client.send('Runtime.evaluate',{
                //     expression:match
                // })else

                console.log(matches.includes(hash));



                

    
    
                stepIntoPromise = (async () => {
                await client.send('Debugger.stepInto');
                })();

                async function findDangerousSinks(scriptId) {
                const { scriptSource } = await client.send("Debugger.getScriptSource", { scriptId });
                const dangerousFunctions = ['eval(', 'new Function(', 'setTimeout(', 'setInterval('];
                const detectedSinks = [];

                dangerousFunctions.forEach((func) => {
                let index = 0;
        
                while ((index = scriptSource.indexOf(func, index)) !== -1) {
                const lineNumber = scriptSource.substring(0, index).split('\n').length;
                detectedSinks.push({
                function: func,
                index: index,
                line: lineNumber
                });
                index += func.length;
                }
             });

             if (detectedSinks.length > 0) {
             console.log('Dangerous sinks found:');
            detectedSinks.forEach((sink) => {
            console.log(`Function: ${sink.function}, Line: ${sink.line}`);
            });
            } else {
                console.log('No dangerous sinks found.');
            }
            }

            await findDangerousSinks(scriptId);
            });


  await stepIntoPromise; 










