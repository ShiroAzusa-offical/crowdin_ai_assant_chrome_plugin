function $$(selector){
    return document.querySelectorAll(selector);
}
function getKeywordAll(){
    let html=$$("#source_context_container [data-testid]");
    let content=[];
    content.push(html[0].textContent);
    content=content.concat(html[1].textContent.split('\n'));
    return content;
}

async function setupButton(func){
    while($$('button#suggest_translation').length==0){
        await new Promise(resolve => setTimeout(resolve, 50));;
    }
    let oldButton=$$('button#suggest_translation')[0];
    let newButton=oldButton.cloneNode(true);
    newButton.textContent = 'ask ai';
    newButton.id='ai_btn';
    newButton.replaceWith(newButton.cloneNode(true));
    newButton.addEventListener('click',func);
    oldButton.parentNode.appendChild(newButton);
}
function setText(str){
    let inputAria=$$("textarea#translation")[0];
    inputAria.value=str;
    inputAria.dispatchEvent(new Event('input', { bubbles: true }));
}

function base64ToString(base64Str) {
  const text = decodeURIComponent(escape(atob(base64Str)));
  return text;
}

const callAI = async (endpoint, inputData) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: 'ai_call',
        endpoint: endpoint,
        data: inputData
      },
      (response) => {
        if (response?.success) {
          resolve(response.data);
        } else {
          reject(response?.error || 'unknow error');
        }
      }
    );
  });
};

async function askAI(system,str){
    return await callAI('compatible-mode/v1/chat/completions',{ //change this
        model: "qwen-max-latest", //and this
        messages: [
        {
          role: "user",
          content: `${str}`
        },
        {
            role: "system",
            content: `${system}`
        }
        ]
      });
}
function buildAIString(strlist){
    grepedList=[];
    for(i in strlist){
        let str=strlist.shift();
        if(str!=""){
            grepedList.push(str);
        }
    }
    let str=`please translate the following text into the TARGET_LANGUAGE:"${grepedList.shift()}" the context is:${grepedList.join()}`; //you may need to specify the target language
    return str;
}
async function btnProcessor(){
    sysBase64=''
    let concat=getKeywordAll();
    let question=buildAIString(concat);
    let response=await askAI(`${base64ToString(sysBase64)}`,question);
    console.log(question);
    let response2=JSON.parse(JSON.stringify(response));
    setText(response2.choices[0].message.content);
    console.log("complete");
}
setupButton(btnProcessor);


