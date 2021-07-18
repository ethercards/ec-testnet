import React, { useEffect, useState } from 'react';
import { LazyImage } from '../common/LazyImage';
import artistAvatar from '../../assets/images/nft-icons/artist-default-avatar.png';
import opensea from '../../assets/images/nft-icons/icon_opensea.png';
import etherscan from '../../assets/images/nft-icons/icon_etherscan.png';
import { getTokenMeta } from '../Utils';

import config from '../../config';
    
const BASE_OPENSEA = config.BASE_OPENSEA;
const BASE_ETHERSCAN = config.BASE_ETHERSCAN;

const WalletCard = (props) => {

    const [metaUrl,setMetaUrl] = useState(null);
    const [tokenMeta,setTokenMeta] = useState(null);

    useEffect(()=>{
    
        if(props.metaUrl && props.metaUrl !== metaUrl){
            setMetaUrl(props.metaUrl);
            getMeta(props.metaUrl);
        }

    },[props]);


    const handleClick = ()=> {
        if(props.handleClick){
            props.handleClick(props.index);
        }
    }

    const getMeta = async (url) => {
        let meta = await getTokenMeta(url);
        setTokenMeta(meta);
    }


    return(<>
        {tokenMeta && <div className="nft-card" onClick={handleClick}>

            <LazyImage src={tokenMeta.image}/>
            <div className="nft-type">
                {tokenMeta.id<10?'CREATOR':tokenMeta.id<100?'OG':tokenMeta.id<1000?'ALPHA':'FOUNDER'}
            </div>

            <div className="info-panel row pl-4 py-2 mx-0">
                <div className="col-2 avatar">
                    <img src={artistAvatar} alt="" />
                </div>
                <div className="col-10 pl-1 details">
                    <h5>{tokenMeta.artist}</h5>
                    <p className="mb-1">{tokenMeta.title}</p>
                    <p className="mb-1"><span className="gray-text">ID:</span> {tokenMeta.id}</p>
                
                
                    <div className="link-panel">
                        <a href={`${BASE_OPENSEA}${props.contractAddress}/${tokenMeta.id}`} onClick={(e)=>{e.stopPropagation()}} target="_blank" className="lnk opensea">
                            <img src={opensea} alt="opensea link"/>
                        </a>
                        <a href={`${BASE_ETHERSCAN}${props.contractAddress}?a=${tokenMeta.id}`} onClick={(e)=>{e.stopPropagation()}} target="_blank" className="lnk etherscan">
                            <img src={etherscan} alt="etherscan link"/>
                        </a>
                    </div>
                </div>

                
            </div>

        </div>}

    </>);
}

export default WalletCard;