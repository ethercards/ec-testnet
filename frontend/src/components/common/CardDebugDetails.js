import React, { useEffect, useState } from 'react';
import { LazyImage } from '../common/LazyImage';
import artistAvatar from '../../assets/images/nft-icons/artist-default-avatar.png';
import opensea from '../../assets/images/nft-icons/icon_opensea.png';
import etherscan from '../../assets/images/nft-icons/icon_etherscan.png';
import PLACEHOLDER from '../../assets/images/traits/small_rplaceholder_icon.png';
import { getTokenMeta } from '../Utils';

import './CardDebugDetails.css';

import config from '../../config';
    
const BASE_OPENSEA = config.BASE_OPENSEA;
const BASE_ETHERSCAN = config.BASE_ETHERSCAN;

const CardDebugDetails = (props) => {

    const [metaUrl,setMetaUrl] = useState(null);
    const [tokenMeta,setTokenMeta] = useState(null);
    const [traitsOfToken, setTraitsOfToken] = useState([]);

    useEffect(()=>{
        if(props.metaUrl && props.metaUrl !== metaUrl){
            setMetaUrl(props.metaUrl);
            getMeta();
        }
    },[props]);

    const getMeta = async (b) => {
        const tokenId = props.card.id;
        const tokenUri = props.card.uri;
        let meta = await getTokenMeta(tokenUri);
        setTokenMeta(meta);
        setTraitsOfToken(meta.traits);

        // let oa = await props.ECContract.ownerOf(tokenId).catch(e=>console.log(e));
        // console.log('id, add', tokenId, oa);
        // setupLayerExplorer(m);
        // console.log(meta.traits);
    }

    const renderTraitIcon = (trait, index) => {
        if (!trait) {
           trait = traitsOfToken[index];
        }
        const traitIcon = `${process.env.PUBLIC_URL}/traits/${trait.icon}`;
        console.log("PUBLIC_URL", process.env.PUBLIC_URL, traitIcon);
        return (
           <img style={{ height: '18px' }}
              src={traitIcon}
              onError={(e) => {
                 e.target.src = PLACEHOLDER;
                 e.target.onerror = null;
              }}>
           </img>
        )
     }

    return(<>

        {tokenMeta && <div className="col-md-12 description mb-5">
            <h5 className="row mb-2">
                <div className="col-md-9">#{tokenMeta.id} - {tokenMeta.title}</div>
                <div className="col-md-">
                    <a href={`${BASE_OPENSEA}${props.ECContract.address}/${tokenMeta.id}`} target="_blank" className="lnk opensea">
                        <img src={opensea} alt="opensea link"/>
                    </a>
                    <a href={`${BASE_ETHERSCAN}${props.ECContract.address}?a=${tokenMeta.id}`} target="_blank" className="lnk etherscan">
                        <img src={etherscan} alt="etherscan link"/>
                    </a>
                </div>
            </h5>

            <div className="lower-part">
                <p className="m-0">Artist: <span className="text-white">{tokenMeta.artist}</span></p>
                <p className="m-0">Other side: <span className="text-white">{tokenMeta.image===tokenMeta.layer_image?'No':'Yes'}</span></p>
                <p className="m-0">Layers: <span className="text-white">{tokenMeta.layer_artists.join(', ')}</span></p>

                <p className="m-0">Trait count: <span className="text-white">{traitsOfToken.length}</span></p>
                {traitsOfToken.map((trait, i) => {
                    return (
                        <div key={'trait-' + i} className="m-0 row">
                            <div className="col-2">
                                <div className="row">
                                    <div className="m-0 p-0 col-9">Trait {i+1}:</div>
                                    <div className="m-0 p-0 col-3 trait">{renderTraitIcon(trait, i)}</div>
                                </div>
                            </div>
                            <div className="col-9">
                                {trait.name}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>}



    </>);
}

export default CardDebugDetails;