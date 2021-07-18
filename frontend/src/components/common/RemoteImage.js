/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {SpinnerDotted} from 'spinners-react';
import defaultImage from '../../assets/images/default-card-image.jpg';
import { getIpfsGatewayUrl } from '../Utils';
import './RemoteImage.css';


const RemoteImage = (props) => {
    const [theImage, setTheImage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        setTheImage('');

        return ()=>{
            if(isLoading){
                setTheImage('');
            }
        }
    },[]);

    useEffect(()=>{
        if(props.src) {
            console.log('imagesource',props.src);
            if(props.src.indexOf('http') !== 0){
                if(props.src.indexOf('data:image')<0){
                    if(props.src.indexOf('/static') === 0){
                        // local file
                        showImage(props.src);
                    }else{
                        // ipfs
                        let url = props.src.replace('ipfs://','/ipfs/');
                        if(url.indexOf('/ipfs') !== 0){
                            url = '/ipfs/'+props.src;
                        }
                        console.log('FINGLAVINA',getIpfsGatewayUrl);
                        showImage(getIpfsGatewayUrl(props.idx)+url);
                    }
                }else{
                    // embedded
                    showImage(props.src);
                }
            }else{
                // http...
                showImage(props.src);
            }
        }else{
            if(!props.disableBg){
                showImage(defaultImage);
            }else{
                showImage('');
            }
        }
    },[props.src])

    const showImage = (imgSrc) => {
        
        setIsLoading(true);
        let delay = props.idx?props.idx:0;

        if(theImage){
            delay+=1500;
        }
        setTimeout(()=>{setTheImage(imgSrc/* .replace('https://ether-cards.mypinata.cloud/ipfs/QmbkGSyXgthdE7bXA8RUzFxXnR13qQCsk4sBJm4KAFDhwC','http://images.burneth.com') */)},delay);
    }

    return (
        <>
          <SpinnerDotted style={{top:'45%', left:'45%', zIndex:2}} className="position-absolute" enabled={isLoading} size={30} thickness={160} speed={100} color="rgba(255, 255, 255, 0.5)" />
          {theImage&& <img id="r-img" className={`${props.className} ${+isLoading?'hide-image':'show-image'}`} style={{opacity:isLoading?0:1}} src={theImage} onLoad={(e)=>{if(isLoading){setIsLoading(false)}}} alt="token" onError={(e)=>{console.log('img err',theImage)}} />}
        </>
    );
}

export default RemoteImage;