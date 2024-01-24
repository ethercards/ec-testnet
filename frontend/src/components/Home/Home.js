import React, { useContext, useEffect, useState } from 'react';
import { SpinnerDotted } from 'spinners-react';
import { toast } from 'react-toast';

import Navigation from '../Navigation/Navigation';
import './Home.css';

import RequestCards from '../common/RequestCards';
import NftCardV2 from '../common/NftCardV2';
import CardDebugDetails from '../common/CardDebugDetails';
import { BitArray, Registry } from "@ethercards/ec-util";
import Web3Ctx from '../Context/Web3Ctx';
import { getContract, getContractAddress } from '../Utils/GetContract';
import Address from '../common/Address';
import { Zoom } from "zoom-next";

// https://heroku.ether.cards/card-embed/1000

const Home = (props) => {

    const { onboard, ethersProvider, address } = useContext(Web3Ctx);

    const [isConnected, setIsConnected] = useState(false);
    const [ecContractAddress, setEcContractAddress] = useState(null);
    const [zoomContractAddress, setZoomContractAddress] = useState(null);
    const [ecTraitContractAddress, setEcTraitContractAddress] = useState(null);
    const [networkChainId, setNetworkChainId] = useState(null);
    const [ec, setEc] = useState(null);
    const [ECTraits, setECTraits] = useState(null);
    const [zoom2, setZoom2] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [Traits, setTraits] = useState([]);
    const [cards, setCards] = useState([]);

    const [numberOfTokens, setNumberOfTokens] = useState(null);

    const [tokenId, setTokenId] = useState('');
    const [metaUri, setMetaUri] = useState('');
    const [cardArtwork, setCardArtwork] = useState('');

    useEffect(() => {
        const initContract = async () => {
            let ECContract = await getContract('EtherCards', ethersProvider);
            if (ECContract) {
                setEc(ECContract);
            } else {
                toast.error('Could not initialise NFT Contract');
            }

            let ECTraitsContract = await getContract('ECRegistryV2', ethersProvider);
            if (ECTraitsContract) {
                setECTraits(ECTraitsContract);
            } else {
                toast.error('Could not initialise Traits Contract');
            }

            let Zoom2Contract = await getContract('Zoom2', ethersProvider);
            if (Zoom2Contract) {
                setZoom2(Zoom2Contract);
            } else {
                toast.error('Could not initialise Zoom2 Contract');
            }

            let ntw = await ethersProvider.getNetwork();
            let chainId = ntw.chainId;
            if (ntw && chainId) {
                setNetworkChainId(chainId);
            } else {
                toast.error('Could not find Network Chain ID');
            }

            let contractAddress = await getContractAddress('EtherCards', chainId);
            if (contractAddress) {
                setEcContractAddress(contractAddress);
            } else {
                toast.error('Could not load NFT Contract Address');
            }

            contractAddress = await getContractAddress('Zoom2', chainId);
            if (contractAddress) {
                setZoomContractAddress(contractAddress);
            } else {
                toast.error('Could not load Zoom2 Contract Address');
            }
            

            contractAddress = await getContractAddress('ECRegistryV2', chainId);
            if (contractAddress) {
                setEcTraitContractAddress(contractAddress);
            } else {
                toast.error('Could not load Traits Contract Address');
            }
            


        }

        if (ethersProvider) {
            initContract();
        }
    }, [ethersProvider]);

    useEffect(() => {
        // console.log('try to load tokens');
        // console.log(ec, zoom2, address);

        if (ec && ECTraits && zoom2 && address) {
            // console.log('about to get tokens [ec,address]', ec, address);
            setIsConnected(true);
            getTraits();
            // getTokens();
        } else {
            // setShowExplorer(false);
            setIsConnected(false);
            // setCards([]);
        }
    }, [ec, ECTraits, zoom2, address]);

    useEffect(() => {
        if (ec && ECTraits && zoom2 && address && Traits) {
            setIsConnected(true);
            getTokens();
        } else {
            setIsConnected(false);
        }
    }, [Traits]);

    


    
    const getTraits = async () => {

        console.log("getTraits");
        
        if (!ECTraits || !zoom2) {
            toast.error('Contract not found');
            return;
        }

        setIsLoading(true);

        let traits = [];
        // ECTraits
        
        const ZoomLibraryInstance = new Zoom();
        let callNum = 0;

        // CALL 1, find out how many tokens address has.
        const existingTraitCount = await ECTraits.traitCount();

        // CALL 2, get them using batch caller
        const item_identifiers = [];

        // let methodSig = "traits(uint16) returns (name string, implementer address, traitType uint8, start uint16, end uint16)";
        for(let i = 0; i < existingTraitCount; i++) {
            
            // request the trait details
            const call = ZoomLibraryInstance.addCall(
                ECTraits,
                ["traits(uint16)", [i]],
                "traits(uint16) returns (string, address, uint8, uint16, uint16)" 
            )
            item_identifiers.push(call);
            callNum++;
        }

        // Prepare the binary call
        const ZoomQueryBinary = ZoomLibraryInstance.getZoomCall();

        console.log("======== ZOOM CALL START (traits) ============" );
        console.time('zoomCall_traits')
        const combinedResult = await zoom2.combine( ZoomQueryBinary );
        console.timeEnd('zoomCall_traits')
        console.log("======== ZOOM CALL END (traits) ==============" );
        ZoomLibraryInstance.resultsToCache( combinedResult, ZoomQueryBinary );

        for(let i = 0; i < callNum; i++) {
            let traitData = ZoomLibraryInstance.decodeCall(item_identifiers[i]);
            traits.push({
                id: i,
                name: traitData.name,
                implementer: traitData.implementer,
                traitType: traitData.traitType,
                start: traitData.start,
                end: traitData.end,
            });
        }

        setTraits(traits);
        setIsLoading(false);
    }

    const getTokens = async () => {

        console.log("getTokens");

        if (!ec || !ECTraits || !zoom2) {
            toast.error('Contract not found');
            return;
        }
        setIsLoading(true);

        const registry = new Registry();
        let tokens = [];

        const MaxResultCount = 50;

        // CALL 1, find out how many tokens address has.
        const ownedNumberOfTokens = await ec.balanceOf(address);

        if (ownedNumberOfTokens > 0) {
            
            const ZoomLibraryInstance = new Zoom();
            let callNum = 0;

            // @TODO: we should be able to get about 1500-2000 tokens per call, so implement slicing / chunking here

            // CALL 2, get them using batch caller
            // Register the number of items we want to retrieve ( ownedNumberOfTokens )
            const item_identifiers = [];

            // let methodSig = "tokenOfOwnerByIndex(address,uint256) returns (uint256)";
            for(let i = 0; i < ownedNumberOfTokens; i++) {
                
                // request the token ID
                const tokenIdCall = ZoomLibraryInstance.addMappingCountCall(
                    // the contract we're calling
                    ec,
                    // the method that is returing our ID
                    ["tokenOfOwnerByIndex", [address, i]],
                    // signature used to decode the result
                    "tokenOfOwnerByIndex(address,uint256) returns (uint256)",
                    // array of next method calls that will use the result of this current call
                    [
                        { contract: ec, mapAndParams: ["tokenURI(uint256)", [i]] },
                        { contract: ECTraits, mapAndParams: ["getTokenData(uint16)", [i]] },
                    ]
                );
                item_identifiers.push(tokenIdCall);
                callNum++;

                // request the token URI
                const tokenUriCall = ZoomLibraryInstance.addType5Call(
                    ec,
                    ["tokenURI(uint256)", [i]],
                    "tokenURI(uint256) returns (string)" 
                )
                item_identifiers.push(tokenUriCall);
                callNum++;

                // Load onChainTraits for trait as well :D
                const traitsCall = ZoomLibraryInstance.addType5Call(
                    ECTraits,
                    ["getTokenData(uint16)", [i]],
                    "getTokenData(uint16) returns (uint8[])" 
                )
                item_identifiers.push(traitsCall);
                callNum++;

            }

            // Prepare the binary call
            const ZoomQueryBinary = ZoomLibraryInstance.getZoomCall();

            // console.log(ZoomLibraryInstance.binary);
            // console.log( "binary:" );
            // ZoomLibraryInstance.binary.forEach(item => {
            //     console.log(item.toString("hex"));
            // })

            console.log("======== ZOOM CALL START ============" );
            console.time('zoomCall_tokens')
            const combinedResult = await zoom2.combine( ZoomQueryBinary );
            console.timeEnd('zoomCall_tokens')
            console.log("======== ZOOM CALL END ==============" );

            ZoomLibraryInstance.resultsToCache( combinedResult, ZoomQueryBinary );
            
            // since we're doing 3 calls per token increment by 3
            for(let i = 0; i < callNum; i = i+3) {
                const tokenId = ZoomLibraryInstance.decodeCall(item_identifiers[i]).toString();
                const tokenURI = ZoomLibraryInstance.decodeCall(item_identifiers[i+1]).toString();
                const traitData = ZoomLibraryInstance.decodeCall(item_identifiers[i+2]);

                // exclude creator cards
                if(tokenId > 9) {
                    const decodedTraits = registry.decodeTraits(traitData[0]);
                    tokens.push({
                        "id": tokenId,
                        "uri": tokenURI,
                        "traitData": traitData,
                        "traits": decodedTraits
                    });
                }
            }
        }

        // console.log("tokens", tokens);
        setCards(tokens);
        setNumberOfTokens(ownedNumberOfTokens.toNumber());
        setIsLoading(false);
    }


    // return (
    //     <>
    //         <Navigation />
    //         <div className="container mt-5 h-100 home">
    //             <div className="row">

    //                 <div className="col-md-6 mx-auto">
    //                     {address &&
    //                         <div className="mb-3">Connected as <Address address={address} blockie short /></div>
    //                     }
    //                     <div className="mb-3">Number of tokens owned {numberOfTokens}</div>
                        

    //                     <div className="form-group  dark">
    //                         <input type="text" className="form-control" id="sdsd" placeholder="token id" value={tokenId} onChange={(e) => { setTokenId(e.target.value) }} />
    //                     </div>
    //                     <button className="btn btn-peach" onClick={getTokenUri}>Get token uri</button>
    //                     {metaUri && <p className="mt-3">TokenURI: <span className="text-white">{metaUri}</span></p>}
    //                 </div>
    //             </div>

    //         </div>
    //     </>
    // );


    const handleClick = (idx) => {
        console.log('click',idx);
        // setSelectedIdx(idx);
    }

    const showImage = (imgUrl) => {
        setCardArtwork(imgUrl);
        //console.log('view image fn',imgUrl);
    }

    const getEtherscanLink = (address) => {
        return "https://sepolia.etherscan.io/address/"+address;
    }

    return (
        <>
            <Navigation />

            <div id="walletContainer" className="container">
                <div className="row padd">
                    <div className="col-lg-12 mt-5">
                        <div className="details row">
                            <div className="col-md-8 mx-auto text-left mb-3 mt-5">
                            Zoom2 Contract: <a href={getEtherscanLink(zoomContractAddress)} target="_blank">{zoomContractAddress}</a><br />
                            Token Contract: <a href={getEtherscanLink(ecContractAddress)} target="_blank">{ecContractAddress}</a><br />
                            Traits Contract: <a href={getEtherscanLink(ecTraitContractAddress)} target="_blank">{ecTraitContractAddress}</a>
                            </div>
                        </div>

                        {isConnected ? 
                            <div className="connected">
                                <div className="row">
                                    <div className="col-md-8 mx-auto text-left mb-3">
                                        {address && <div className="mb-3">Connected as <Address address={address} blockie long /></div>}
                                        <div className="mb-3">Number of tokens owned {numberOfTokens}</div>
                                    </div>
                                </div>

                                <div className="row">
                                    <RequestCards
                                        helpers={ {"ec":ec, "zoom2": zoom2, "zoomLib": Zoom, "myWalletAddress":address, "ethersProvider": ethersProvider } }
                                    />
                                </div>
                            </div>
                            :
                            <div></div>
                        }
                            
                        {isConnected ?

                            <div className="row">

                                {isLoading ?
                                    <div className="col-lg-12 mt-5 mb-5 text-center">
                                        <SpinnerDotted enabled={isLoading} size={35} thickness={160} speed={200} color="#fff" />
                                    </div>
                                    :
                                    <>
                                        {cards.map((key, i) => {
                                            // return (
                                            //     <div key={cards[i].id} className="col-md-3 mx-auto mt-5">
                                            //         <WalletCard key={'i'+i} index={i} metaUrl={cards[i].uri} handleClick={handleClick} contractAddress={ecContractAddress}/>
                                            //     </div>
                                            // );

                                            return (
                                                <div className="row col-md-12" key={cards[i].id}>
                                                    <div className="col-md-4 mt-5">
                                                        <NftCardV2
                                                            demoMode="true" 
                                                            tokenJsonUri={cards[i].uri}
                                                            cardType={cards[i].id < 10 ? 4 : cards[i].id < 100 ? 0 : cards[i].id < 1000 ? 1 : 3}
                                                            tokenImage={null}
                                                            showImage={showImage}
                                                            contractAddress={ecContractAddress}
                                                        />
                                                    </div>
                                                    <div className="col-md-8 mt-5">
                                                        <CardDebugDetails 
                                                            card={cards[i]} 
                                                            metaUrl={cards[i].uri} 
                                                            ECContract={ec} 
                                                            Traits={Traits}
                                                            tokenTraits={cards[i]}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {cards.length === 0 &&
                                            <div className="col-md-6 mx-auto mt-5 text-center">
                                                <h5>Your wallet is empty.</h5>
                                            </div>
                                        }
                                    </>
                                }
                            </div>

                            :

                            <div className="row">
                                <div className="col-md-4 mx-auto mt-5 text-center">
                                    <h5>In order to see your tokens, you need to connect your wallet</h5>

                                    <button className="btn btn-peach btn-outline round mx-auto mt-5 px-3" onClick={() => { onboard.walletSelect() }}>CONNECT</button>
                                </div>
                            </div>
                        }
                    </div>

                </div>
            </div>
        
        </>
    );
}

export default Home;