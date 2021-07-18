export const getTokenURI = (uri,uriIdx) =>{
  if(uri.indexOf('http') === 0){
    //starts with http, fetch...
    //return axios.get(uri);
  }else{
    //try with ipfs....
    uri = uri.replace('ipfs://','/ipfs/')
    if(uri.indexOf('/ipfs')===-1){
      uri='/ipfs/'+uri;
    }
    uri=getIpfsGatewayUrl(uriIdx)+uri;
  }
    console.log('uri to get',uri);

   return fetch(uri)
      .then(res => res.json())
      .then(
        (result) => {
          return result;
        },
        (error) => {

          console.log('***Error:', error);

          return null;
        }
      )
}

//when the uri is starts with http....
export const getTokenMeta = (uri) => {
  return fetch(uri)
    .then(res => res.json())
    .then(
      (result) => {
        //console.log('result',result);
        return result;
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {

        console.log('***Error:', error);

        return null;
      }
    )
}

export const  pauseFor = (time) => {
  return  new Promise(resolve => setTimeout(resolve, time));
};

export const getIpfsGatewayUrl = (index) => {
  const urls = [
                "https://gateway.pinata.cloud",
                "https://gateway.ipfs.io"
                /* "https://ipfs.io",
                "https://jorropo.net",
                "https://ipfs.best-practice.se" */
                
                /* ,
                "https://jorropo.ovh",
                "https://ninetailed.ninja",
                "https://hardbin.com",
                "https://ipfs.2read.net",
                "https://ipfs.sloppyta.co", */
               ];

  const idx=(index === undefined || index === null)?0:index%urls.length;
  return urls[idx];
}

export const padZeros = (num,zeros) => {
  const z='00000000';
  let n = num.toString();

  if(n.length>=zeros){
    return n;
  }
  return z.substr(0,zeros-n.length)+n;
}

export const parseRpcError = (message) =>{

  console.log('raw message',message);

  let result = message;
  let start =message.indexOf("'{\"")+1;
  let len = message.indexOf("}'")+1 - start;
  let m = message.substr(start, len);

  try {
      let jsonmsg = JSON.parse(m);
      result = jsonmsg.value.data.message;
  }catch{
      console.log('message not found');
  }
  return result;
}

export const getTraitsFromHexString = (traitHex) => {

  let traits = [];
        for(let i=0; i<traitHex.length;i++){
            if(traitHex[traitHex.length-1-i]!=='x'){
                let cnum = parseInt(traitHex[traitHex.length-1-i],16);
                if(cnum & 1){
                  traits.push(i*4);
                }
                if(cnum & 2){
                  traits.push(i*4+1);
                }
                if(cnum & 4){
                  traits.push(i*4+2);
                }
                if(cnum & 8){
                  traits.push(i*4+3);
                }
            }
        }
  return traits;
}

export const validateUrl = (url)=>{
  if(url.indexOf('http') === 0){
    return url;
  }
  if(url.indexOf('ipfs://') === 0 || url.indexOf('/ifps/') === 0){
    let u = url.replace('ipfs://','/ipfs/');
    return getIpfsGatewayUrl(0)+u;
  }
  return getIpfsGatewayUrl(0)+'/ipfs/'+url;
}