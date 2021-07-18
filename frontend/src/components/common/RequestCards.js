import React, { useEffect, useState } from 'react';
import { LazyImage } from './LazyImage';
import artistAvatar from '../../assets/images/nft-icons/artist-default-avatar.png';
import opensea from '../../assets/images/nft-icons/icon_opensea.png';
import etherscan from '../../assets/images/nft-icons/icon_etherscan.png';
import PLACEHOLDER from '../../assets/images/traits/small_rplaceholder_icon.png';
import { getTokenMeta } from '../Utils';

import { toast } from "react-toast";
import './RequestCards.css';

import config from '../../config';
    

const CARD = {
    OG: 'og',
    ALPHA: 'alpha',
    FOUNDER: 'founder'
}

const selectedCardIdDefault = "none";

const RequestCards = (props) => {

    const [unownedTokenIds, setUnownedTokenIds] = useState(null);
    const [unownedOgs, setUnownedOgs] = useState([]);
    const [unownedAlphas, setUnownedAlphas] = useState([]);
    const [unownedFounders, setUnownedFounders] = useState([]);

    const [cardType,setCardType] = useState('all');
    const [selectedCardTypeIds,setSelectedCardTypeIds] = useState([]);
    const [selectedCardId,setSelectedCardId] = useState(selectedCardIdDefault);

    const [requestQueueIds,setRequestQueueIds] = useState([]);


    useEffect(()=>{
        getUnownedTokenIds();

    },[props.helpers.zoom2]);

    const getUnownedTokenIds = async () => {
       
        console.log("getUnownedTokenIds", unownedTokenIds);

        let tokenIds = [];
        let ownedTokenIds = [];
        let ogIds = [];
        let alphaIds = [];
        let founderIds = [];

        const ZoomLibraryInstance = new props.helpers.zoomLib();
        const maxTokenCount = 10000;

        // lets find out all token ids using totalSupply and tokenByIndex
        // 1 normal call to contract
        // 1 or more zoom calls to get the rest depending on count
        // TODO: chunk at 1k requests

        const contract = props.helpers.ec;
        const totalSupply = await contract.totalSupply();

        if (totalSupply > 0) {
            const item_identifiers = [];

            for(let i = 0; i < totalSupply; i++) {
                // request the token ID
                const tokenIdCall = ZoomLibraryInstance.addCall(
                    contract,
                    ["tokenByIndex", [i]],
                    "tokenByIndex(uint256) returns (uint256)"
                );
                item_identifiers.push(tokenIdCall);
            }

            // Prepare the binary call
            const ZoomQueryBinary = ZoomLibraryInstance.getZoomCall();

            console.log("======== ZOOM CALL START ============" );
            console.time('zoomCall')
            const combinedResult = await props.helpers.zoom2.combine( ZoomQueryBinary );
            console.timeEnd('zoomCall')
            console.log("======== ZOOM CALL END ==============" );

            ZoomLibraryInstance.resultsToCache( combinedResult, ZoomQueryBinary );

            for(let i = 0; i < totalSupply; i++) {
                let tokenId = ZoomLibraryInstance.decodeCall(item_identifiers[i]).toString();
                ownedTokenIds.push(tokenId);
            }

        }

        console.log("ownedTokenIds", ownedTokenIds);

        // Determine unused ids
        for(let i = 0; i < maxTokenCount; i++) {
            if(!ownedTokenIds.includes(i.toString())) {
                tokenIds.push(i);
            }
        }

        tokenIds.forEach((id)=>{
            if(id < 100) {
                ogIds.push(id);
            } else if(id < 1000) {
                alphaIds.push(id);
            } else if(id < 10000) {
                founderIds.push(id);
            }
        });

        setUnownedTokenIds(tokenIds);
        setUnownedOgs(ogIds);
        setUnownedAlphas(alphaIds);
        setUnownedFounders(founderIds);

 
    }

    const getTokens = async () => {

    }

    //filters 
    const handleCardTypeSelect = (value) => {
        console.log(value);
        setCardType(value);
        setSelectedCardId(selectedCardIdDefault);
        if(value === "og") {
            setSelectedCardTypeIds(unownedOgs);
        } else if(value === "alpha") {
            setSelectedCardTypeIds(unownedAlphas);
        } else if(value === "founder") {
            setSelectedCardTypeIds(unownedFounders);
        }

        return;
    }

    const addSelectedIdToQueue = (value)=>{
        console.log("addSelectedIdToQueue", value)

        let newRequestQueueIds = [];
        requestQueueIds.forEach(element => {
            if(element != value) {
                newRequestQueueIds.push(element);
            }
        });
        newRequestQueueIds.push(value);

        setRequestQueueIds(newRequestQueueIds);
        console.log("requestQueueIds", requestQueueIds)

    };

    const handleSelectedIdClick = (value)=>{
        console.log("handleSelectedIdClick", value)

        let newRequestQueueIds = [];
        requestQueueIds.forEach(element => {
            if(element != value) {
                newRequestQueueIds.push(element);
            }
        });

        setRequestQueueIds(newRequestQueueIds);
        console.log("requestQueueIds", requestQueueIds)
    };
    

    const requestSelectedTokens = async () => {
        console.log("requestSelectedTokens", requestQueueIds);
        let contract = props.helpers.ec;
        let signer = props.helpers.ethersProvider.getSigner();
        let c = contract.connect(signer);
        let tx = null;
        tx = await c["batchMint(uint256[],address)"](requestQueueIds, props.helpers.myWalletAddress).catch(e =>{
            toast.error(e.error.message);
            console.log(e)
        });
    }


    return(<>

        {unownedTokenIds && 
        <div className="col-md-12 requestcards mb-5">
            <div className="row mb-2">
                <div className="filters ml-3 mr-3">
                    <div className="content mx-auto">
                        <div className="row px-2 py-2">
                            <div className="col-md-4 pt-2"><h3 className="text-peach text-center">Request New Token</h3></div>
                            <div className="filter-item">
                                <h5>Select Type</h5>
                                <div className="selected-option open">
                                    {cardType==='og'?'OG':cardType==='all'?'All card types':cardType}
                                    <div className="dropdown">
                                        <div className="dd-container">
                                            <ul className="">
                                                <li onClick={()=>handleCardTypeSelect(CARD.OG)}>OG ({unownedOgs.length})</li>
                                                <li onClick={()=>handleCardTypeSelect(CARD.ALPHA)}>Alpha ({unownedAlphas.length})</li>
                                                <li onClick={()=>handleCardTypeSelect(CARD.FOUNDER)}>Founder ({unownedFounders.length})</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="filter-item">
                                <h5>Select Available ID</h5>
                                <div className="selected-option open">
                                    {selectedCardId}
                                    <div className="dropdown">
                                        <div className="dd-container">
                                            <ul className="">
                                                {selectedCardTypeIds.map((i,idx)=>{return(
                                                <li key={'id'+i} onClick={()=>addSelectedIdToQueue(i)}>{i}</li>
                                                )})}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="queue row mb-2 ml-3 mr-3">
                <div className="title col-3">Request Queue</div>
                <div className="col-6">
                {requestQueueIds.map((i,idx)=>{return(
                <div className="selectedId" key={'id'+i} onClick={()=>handleSelectedIdClick(i)}>{i}</div>
                )})}
                </div>
                <div className="title col-3">
                    <button className="ml-auto mr-4" onClick={requestSelectedTokens}>Request Tokens</button>
                </div>
            </div>
        </div>}



    </>);
}

export default RequestCards;