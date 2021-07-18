import React, { useContext, useEffect, useState } from 'react';
import { SpinnerDotted } from 'spinners-react';
import { toast } from 'react-toast';

import Navigation from '../Navigation/Navigation';
import './Home.css';

import RequestCards from '../common/RequestCards';
import NftCardV2 from '../common/NftCardV2';
import CardDebugDetails from '../common/CardDebugDetails';



import Web3Ctx from '../Context/Web3Ctx';
import { getContract, getContractAddress } from '../Utils/GetContract';
import Address from '../common/Address';

import { Zoom } from "zoom-next";

// https://heroku.ether.cards/card-embed/1000

const Home = (props) => {

    const { onboard, ethersProvider, address } = useContext(Web3Ctx);

    const [isConnected, setIsConnected] = useState(false);
    const [ecContractAddress, setEcContractAddress] = useState(null);
    const [networkChainId, setNetworkChainId] = useState(null);
    const [ec, setEc] = useState(null);
    const [zoom2, setZoom2] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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


        }

        if (ethersProvider) {
            initContract();
        }
    }, [ethersProvider]);

    useEffect(() => {
        // console.log('try to load tokens');
        // console.log(ec, zoom2, address);

        if (ec && zoom2 && address) {
            // console.log('about to get tokens [ec,address]', ec, address);
            setIsConnected(true);
            getTokens();
        } else {
            // setShowExplorer(false);
            setIsConnected(false);
            setCards([]);
        }
    }, [ec, zoom2, address]);


    const getTokens = async () => {
        if (!ec || !zoom2) {
            toast.error('Contract not found');
            return;
        }
        setIsLoading(true);

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
                const tokeIdCall = ZoomLibraryInstance.addMappingCountCall(
                    // the contract we're calling
                    ec,
                    // the method that is returing our ID
                    ["tokenOfOwnerByIndex", [address, i]],
                    // signature used to decode the result
                    "tokenOfOwnerByIndex(address,uint256) returns (uint256)",
                    // next method call that will use the result of this current call
                    ["tokenURI(uint256)", [i]] 
                );
                item_identifiers.push(tokeIdCall);
                callNum++;

                // request the token URI
                const tokenUriCall = ZoomLibraryInstance.addType4Call(
                    ec,
                    ["tokenURI(uint256)", [i]],
                    "tokenURI(uint256) returns (string)" 
                )
                item_identifiers.push(tokenUriCall);
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
            console.time('zoomCall')
            const combinedResult = await zoom2.combine( ZoomQueryBinary );
            console.timeEnd('zoomCall')
            console.log("======== ZOOM CALL END ==============" );
            // console.log( "combinedResult", combinedResult.toString("hex") );

            const newDataCache = ZoomLibraryInstance.resultsToCache( combinedResult, ZoomQueryBinary );
            // console.log(newDataCache);
            
            // since we're doing 2 calls per token increment by 2
            for(let i = 0; i < callNum; i = i+2) {
                let tokenId = ZoomLibraryInstance.decodeCall(item_identifiers[i]).toString();
                let tokenURI = ZoomLibraryInstance.decodeCall(item_identifiers[i+1]).toString();

                // exclude creator cards
                if(tokenId > 9) {
                    tokens.push({ "id": tokenId, "uri": tokenURI });
                }
            }


            // Load onChainTraits for each card

            


            setCards(tokens);
        } else {
            setCards([]);
        }

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

    return (
        <>
            <Navigation />

            <div id="walletContainer" className="container">
            <div className="row padd">
                <div className="col-lg-12 mt-5">

                    {isConnected ? 
                        <div>
                            <div className="row">
                                <div className="col-md-8 mx-auto text-left mt-5 mb-3">
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