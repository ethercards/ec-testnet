import React, { useEffect, useState } from 'react';
// import { LazyImage } from '../common/LazyImage';
// import artistAvatar from '../../assets/images/nft-icons/artist-default-avatar.png';
import opensea from '../../assets/images/nft-icons/icon_opensea.png';
import etherscan from '../../assets/images/nft-icons/icon_etherscan.png';
// import PLACEHOLDER from '../../assets/images/traits/small_rplaceholder_icon.png';
import { getTokenMeta } from '../Utils';

import './CardDebugDetails.css';

import config from '../../config';
    
const BASE_OPENSEA = config.BASE_OPENSEA;
const BASE_ETHERSCAN = config.BASE_ETHERSCAN;

const CardDebugDetails = (props) => {

    const [metaUrl,setMetaUrl] = useState(null);
    const [tokenMeta,setTokenMeta] = useState(null);
    const [traitsOfToken, setTraitsOfToken] = useState([]);
    const [GlobalTraits, setGlobalTraits] = useState([]);
    const [TokenTraits, setTokenTraits] = useState(null);
    

    useEffect(()=>{
        if(props.metaUrl && props.metaUrl !== metaUrl){
            setMetaUrl(props.metaUrl);
            getMeta();
        }
        if(props.Traits){
            setGlobalTraits(props.Traits);
        }
        if(props.tokenTraits){
            setTokenTraits(props.tokenTraits);
        }        

        // console.log(TokenTraits);
        
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

        // console.log("tokenMeta.id", meta.id, props.tokenTraits.traitData);
    }

    // const renderTraitIcon = (trait, index) => {
    //     if (!trait) {
    //        trait = traitsOfToken[index];
    //     }
    //     const traitIcon = `${process.env.PUBLIC_URL}/static/traits/${trait.icon}`;
    //     // console.log("PUBLIC_URL", process.env.PUBLIC_URL, traitIcon);
    //     return (
    //        <img style={{ height: '18px' }}
    //           src={traitIcon}
    //           onError={(e) => {
    //              e.target.src = PLACEHOLDER;
    //              e.target.onerror = null;
    //           }}>
    //        </img>
    //     )
    //  }

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

                <p className="m-0">Metadata Trait count: <span className="text-white">{traitsOfToken.length}</span></p>
                <div className="m-0 row">
                    <div className="col-2">Count</div>
                    <div className="col-1">ID</div>
                    <div className="col-8">Name</div>
                    <div className="col-1">Times</div>
                </div>
                {traitsOfToken.map((trait, i) => {
                    return (
                        <div key={'trait-' + i} className="m-0 row">
                            <div className="col-2">Trait {i+1}:</div>
                            <div className="col-1">{i}</div>
                            <div className="col-8">
                                {trait.name}
                            </div>
                            <div className="col-1">1x</div>
                        </div>
                    )
                })}

                <p className="m-0">Chain Trait count: <span className="text-white">{TokenTraits.traits.length}</span></p>
                <div className="m-0 row">
                    <div className="col-2">Count</div>
                    <div className="col-1">ID</div>
                    <div className="col-8">Name</div>
                    <div className="col-1">Value</div>
                </div>
                {TokenTraits.traits.map((trait, i) => {
                    return (
                        <div key={'trait-' + i} className="m-0 row">
                            <div className="col-2">Trait {i+1}:</div>
                            <div className="col-1">{GlobalTraits[trait].id}</div>
                            <div className="col-8">
                                {GlobalTraits[trait].name}
                            </div>
                            <div className="col-1">?</div>
                        </div>
                    )
                })}
            </div>
        </div>}



    </>);
}

export default CardDebugDetails;