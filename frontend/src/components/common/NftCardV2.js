import React, { useEffect, useRef, useState } from 'react';
import RemoteImage from './RemoteImage';
import { getIpfsGatewayUrl, getTokenURI, getTraitsFromHexString, parseRpcError, pauseFor, validateUrl } from '../Utils';
import useContainerDimensions from './useContainerDimensions';
import './NftCardV2.css';

import { toast } from 'react-toast';
import { BigNumber } from 'ethers';

import defImage from '../../assets/images/default-card-image.jpg';
import defaultImageOg from '../../assets/images/default-card-image-OG.jpg';
import defaultImageAlpha from '../../assets/images/default-card-image-ALPHA.jpg';
import defaultImageCommon from '../../assets/images/default-card-image-COMMON.jpg';
import traitIcons from '../../assets/images/nft-icons/traitIcons.png';
import ecLogo from '../../assets/images/logo-in-menu.png';
import closeX from '../../assets/images/nft-icons/close_button.svg';
import sensitiveContent from '../../assets/images/sensitive.png';
import fsIcon from '../../assets/images/fs.png';
import switchIcon from '../../assets/images/switch.png';
import layerIcon from '../../assets/images/icon_layer-explorer.png';

//TRAIT
// import ogLayerDrop from '../../assets/images/traits/icon-og-layer-drop.png';
// import alphaLayerDrop from '../../assets/images/traits/icon-alpha-layer-drop.png';
// import limitedSlot from '../../assets/images/traits/icon-limitedtraitslot.png';
// import battlePunk from '../../assets/images/traits/icon-battle-royal-punk.png';
// import battleRoyalty from '../../assets/images/traits/icon-royalty-battle.png';
// import supporter from '../../assets/images/traits/icon-supporter.png';
// import reforge from '../../assets/images/traits/small_reforge_icon.png';
// import reforgePlus from '../../assets/images/traits/small_reforge_plus_icon.png';

import PLACEHOLDER from '../../assets/images/traits/small_rplaceholder_icon.png';


const NftCardV2 = (props) => {

   const containerRef = useRef()
   const { width, height } = useContainerDimensions(containerRef);

   //enum CardType { OG, Alpha, Random, Common, Founder,  Unresolved } 

   const cardTypes = [
      { type: 'OG', cName: 'og', defImg: defaultImageOg },
      { type: 'ALPHA', cName: 'alpha', defImg: defaultImageAlpha },
      { type: 'RANDOM', cName: 'common', defImg: defImage },
      { type: 'FOUNDER', cName: 'common', defImg: defaultImageCommon },
      { type: 'CREATOR', cName: 'founder', defImg: defaultImageOg },
      { type: 'UNRESOLVED', cName: 'unresolved', defImg: defImage }
   ];

   //TRAIT
   // const traitImages = {
   //    0: ogLayerDrop,
   //    1: alphaLayerDrop,
   //    2: limitedSlot,
   //    3: battlePunk,
   //    4: battleRoyalty,
   //    5: supporter
   // }

   const [contract, setContract] = useState({ address: '' });
   const [provider, setProvider] = useState({ network: { name: '' } });
   const [tokenId, setTokenId] = useState('0x0');
   const [tokenURI, setTokenURI] = useState('');
   const [serialNr, setSerialNr] = useState(0);
   const [resolved, setResolved] = useState(false);
   const [saleActive, setSaleActive] = useState(true);
   const [initialised, setInitialised] = useState(false);
   const [cardType, setCardType] = useState(5);

   const [traitsOfToken, setTraitsOfToken] = useState([]);

   const [traitsVisible, setTraitsVisible] = useState(false);
   const [detailsVisible, setDetailsVisible] = useState(false);

   const [selectedTraitIdx, setSelectedTraitIdx] = useState(null);
   const [selectedTraitIdxDetails, setSelectedTraitIdxDetails] = useState(0);

   const [isVideoOn, setIsVideoOn] = useState(false);
   const [tokenImage, setTokenImage] = useState('');
   const [originalImage, setOriginalImage] = useState('');
   const [visibleImage, setVisibleImage] = useState('');
   const [layeredImage, setLayeredImage] = useState('');
   const [defaultImage, setDefaultImage] = useState(defImage);
   const [isSensitive, setIsSensitive] = useState(false);
   const [tokenVideo, setTokenVideo] = useState('');
   const [hasRealImage, setHasRealImage] = useState(false);
   const [artTitle, setArtTitle] = useState('Untitled');
   const [artist, setArtist] = useState('');
   const [layerArtists, setLayerArtists] = useState([]);

   const [containerSize, setContainerSize] = useState('c-xlarge');
   const [jsonUri, setJsonUri] = useState('');
   const [layeredImageDisabled, setLayeredImageDisabled] = useState(false);
   const [isMainActive, setIsMainActive] = useState(true);


   useEffect(() => {
      if (width) {
         let cSize = '';
         if (width > 500) {
            cSize = 'c-xlarge';
         } else if (width > 400) {
            cSize = 'c-large';
         } else if (width > 300) {
            cSize = 'c-medium';
         } else if (width > 240) {
            cSize = 'c-small';
         } else {
            cSize = 'c-xsmall'
         }
         setContainerSize(cSize);
      }
   }, [width])

   useEffect(() => {
      if (props.showLayerFirst) {
         switchTheImages()
         setIsSensitive(false);
      }
   }, [layeredImage])

   //TRAITS
   const setupMeta = (tokenMeta) => {
      if (!tokenMeta) {
         console.log('No metadata');
         return;
      }
      //console.log('TOKENMETA',tokenMeta);
      if (tokenMeta.image) {
         //B&V overlay
         setIsSensitive(getFlagFromProperty(tokenMeta.properties, 'sensitive'));

         //set the previous token image as bg image 
         if (tokenImage !== '') {
            setDefaultImage(validateUrl(tokenImage));
         }

         setArtist(tokenMeta.artist);
         setLayerArtists(tokenMeta.layer_artists ? tokenMeta.layer_artists : []);
         setArtTitle(tokenMeta.title ? tokenMeta.title : 'Accidental Collaboration');

         //main image
         let theTokenImage = tokenMeta.image;
         if (theTokenImage.indexOf('/ec_og.') === -1 && theTokenImage.indexOf('/ec_alpha.') === -1 && theTokenImage.indexOf('/ec_common.') === -1) {
            setHasRealImage(true);
            if (tokenMeta.layer_image) {
               setLayeredImage(tokenMeta.layer_image);
            } else {
               setLayeredImage('');
            }
         } else {
            setHasRealImage(false);
         }
         setTokenImage(theTokenImage);
         setVisibleImage(theTokenImage);
         setIsMainActive(true);

      } else {
         //external image?
         if (props.tokenImage !== null) {
            setTokenImage(props.tokenImage);
            setVisibleImage(props.tokenImage);
            setTraitsOfToken([]);
         }
         setHasRealImage(false);
      }

      //card type from id, and id
      setSerialNr(tokenMeta.id);
      setCardType(props.cardType ? props.cardType : tokenMeta.id < 10 ? 4 : tokenMeta.id < 100 ? 0 : tokenMeta.id < 1000 ? 1 : 3);

      //Set traits from  meta
      if (tokenMeta.traits && tokenMeta.traits.length > 0) {
         //let res= getTraitsFromHexString(tokenMeta.trait_bits.toString(16));
         setTraitsOfToken(tokenMeta.traits);
         // console.log(tokenMeta.traits)
      } else {
         if (props.demoMode && props.traits) {
            setTraitsOfToken(props.traits);
         } else {
            setTraitsOfToken([]);
         }
      }

      //Is there mp4? ok, this will be more interesting, since the opensea integration 
      if (tokenMeta.animation_url && tokenMeta.animation_url.endsWith('.mp4')) {
         setTokenVideo(tokenMeta.animation_url);
         setIsVideoOn(true);
      } else if (tokenMeta.original_art_url && tokenMeta.original_art_url.endsWith('.mp4')) {
         setTokenVideo(tokenMeta.original_art_url);
         setIsVideoOn(true);
      } else {
         setTokenVideo('');
         setIsVideoOn(false);
      }

      //setOriginal art if presennt
      if (tokenMeta.original_art_url) {
         setOriginalImage(tokenMeta.original_art_url);
      } else {
         setOriginalImage('');
      }
   }

   useEffect(() => {
      const setupDemo = async () => {
         if ((props.tokenJsonUri && props.tokenJsonUri !== jsonUri) && props.tokenImage === null) {
            console.log('json uri', props.tokenJsonUri);
            setJsonUri(props.tokenJsonUri);
            let tokenMeta = await getTokenURI(props.tokenJsonUri);
            setupMeta(tokenMeta);
         } else if (props.tokenJson && props.tokenJson.id !== serialNr && props.tokenImage === null) {
            setupMeta(props.tokenJson);
         }
      }

      //demo mode
      if (props.demoMode) {
         setupDemo();
         return;
      }

      //wallet mode
      if (props.provider && provider.network.name == '') {
         setProvider(props.provider);
      }

      if (props.contract && props.contract.address !== contract.address) {
         setContract(props.contract);
         //console.log('contract',props.contract);
      }

      if (props.tokenId && props.tokenId !== tokenId) {
         setSelectedTraitIdx(null);
         setSelectedTraitIdxDetails(0);
         setTokenId(props.tokenId);
      }
   }, [props]);


   useEffect(() => {
      if (tokenId !== '0x0') {
         initialiseToken();
      }
   }, [tokenId]);


   const initialiseToken = async () => {
      if (contract.address == '' || provider.network.name == '') {
         console.log('error');
         return;
      }

      let theTokenImage = '';
      setInitialised(false);

      //play nice with provier
      await pauseFor(300 * props.idx);

      let ec = await contract.connect(provider);

      let cType = await ec.cardType(tokenId);

      if (cType > -1 && cType < 6) {
         theTokenImage = cardTypes[cType].defImg;
         setHasRealImage(false);
         setCardType(cType);
      } else {
         setCardType(5); //unresolved then
      }

      let cResolved = await ec.isCardResolved(tokenId);
      if (cResolved && cType < 5) {
         let tokenMetaUri = await ec.tokenURI(tokenId);

         if (tokenMetaUri) {
            let tokenMeta = await getTokenURI(tokenMetaUri);
            console.info(tokenMeta)
            setupMeta(tokenMeta);
         } else {
            setTokenImage(theTokenImage);
            setVisibleImage(theTokenImage);
         }
      }
      setInitialised(true);
   }

   const traitSelected = (traitIndex) => {
      setSelectedTraitIdx(traitIndex);
      setSelectedTraitIdxDetails(traitIndex);
   }

   /* ANIM STUFF */

   const traitFlipEnded = () => {
      //console.log('flip ended and',traitsVisible);
   }

   const callExternalImageViewer = () => {
      if (props.showImage && typeof props.showImage === 'function') {
         console.info(isMainActive)
         console.info(tokenVideo)
         if (isMainActive) {
            if (tokenVideo !== '') {
               props.showImage({ type: 'video', media: tokenVideo });
            } else {
               props.showImage({ type: serialNr < 1000 ? 'image' : 'layered', media: originalImage ? originalImage : tokenImage });
            }
         } else {
            props.showImage({ type: 'layered', media: layeredImage });
         }
      }
   }

   const switchTheImages = () => {

      let active = isMainActive;
      if (!active) {
         if (tokenVideo) {
            setIsVideoOn(true);
            setDefaultImage(validateUrl(tokenImage));
         } else {
            setVisibleImage(tokenImage);
            setDefaultImage(validateUrl(tokenImage));
         }
      } else {
         if (tokenVideo) {
            setIsVideoOn(false);
            setVisibleImage(layeredImage);
            setDefaultImage(validateUrl(layeredImage));
         } else {
            setVisibleImage(layeredImage);
            setDefaultImage(validateUrl(layeredImage));
         }
      }
      setIsMainActive(!active);
   }

   const showTheLayers = () => {
      if (props.exploreTheLayers && typeof props.exploreTheLayers === 'function') {
         props.exploreTheLayers();
      }
   }


   const getFlagFromProperty = (propsArray, key) => {
      if (!propsArray || propsArray.length === 0) {
         return false;
      }

      for (let i = 0; i < propsArray.length; i++) {
         if (propsArray[i] === key) {
            return true;
         }
      }
      return false;
   }

   const renderTraitIcon = (trait) => {
      if (!trait) {
         trait = traitsOfToken[selectedTraitIdxDetails];
      }
      const traitIcon = `${process.env.PUBLIC_URL}/static/traits/${trait.icon}`;
      return (
         <img style={{ width: '80%' }}
            src={traitIcon}
            onError={(e) => {
               e.target.src = PLACEHOLDER;
               e.target.onerror = null;
            }}>
         </img>
      )
   }

   return (
      <>
         <div ref={containerRef} className={`nft-token ${containerSize} ${cardTypes[cardType].cName}`}>
            <div className="flip-card">
               <div className={`front-face ${!initialised ? 'init-progress' : ''} ${traitsVisible ? 'traits-on' : ''} ${detailsVisible ? 'details-on' : ''} ${cardTypes[cardType].cName}`}>
                  <div className="card-type" onClick={(e) => { if (hasRealImage) { setDetailsVisible(true) } }}>
                     {cardTypes[cardType].type}
                  </div>
                  {traitsOfToken.length > 0 && <div className="card-traits" onClick={(e) => setTraitsVisible(!traitsVisible)}>
                     {traitsOfToken.length}
                  </div>}

                  {!isSensitive && <div className="fullscreen-button">
                     <div className="fs" style={{ backgroundImage: `url(${fsIcon})` }} onClick={callExternalImageViewer}></div>
                     {(layeredImage && layeredImage !== tokenImage) &&
                        <div className="fs sw ml-3" style={{ backgroundImage: `url(${switchIcon})` }} onClick={switchTheImages}></div>}
                     {((layeredImage && layeredImage !== tokenImage && !isMainActive) || layeredImage === tokenImage) && props.exploreTheLayers &&
                        <div className="fs sw ml-3" style={{ backgroundImage: `url(${layerIcon})` }} onClick={showTheLayers}></div>}
                  </div>}

                  {hasRealImage &&
                     <div className="ec-logo">
                        <img src={ecLogo} alt="ethercards" />
                     </div>}

                  <div className="trait-slide pt-4 pb-3 px-3 text-center"
                     style={{ height: selectedTraitIdx != null ? '600px' : Math.ceil(traitsOfToken.length / 3) * (width / 4) + 60 + 'px' }}>
                     <div className="close-btn" onClick={(e) => { if (selectedTraitIdx !== null) { setSelectedTraitIdx(null) } else { setTraitsVisible(!traitsVisible) } }}>
                        <img src={closeX} alt="close" />
                     </div>

                     <div className={`trait-container ${selectedTraitIdx != null ? 'trait-selected' : ''}`}>
                        {traitsOfToken.map((trait, i) => {
                           return (
                              <div key={'trait-' + i}
                                 className={`trait`}
                                 style={{ width: width / 6, height: width / 6, margin: width / 30 + 'px' }}
                                 onClick={(e) => traitSelected(i)}>
                                 {renderTraitIcon(trait)}
                              </div>
                           )
                        })}
                     </div>
                     {traitsOfToken.length > 0 &&
                        <div className={`trait-details ${selectedTraitIdx != null ? 'trait-selected' : ''}`}>
                           <div className={`trait`}
                              style={{
                                 width: '75px',
                                 height: '75px',
                              }}> {renderTraitIcon()}
                           </div>
                           <h5 className="trait-name">{traitsOfToken[selectedTraitIdxDetails].name}</h5>
                           <p className="mt-3 px-3">{traitsOfToken[selectedTraitIdxDetails].description}</p>
                        </div>}
                  </div>

                  <div className="details-slide text-center px-2">
                     <div className="close-btn" onClick={(e) => { setDetailsVisible(false) }}>
                        <img src={closeX} alt="close" />
                     </div>
                     <div className="details-content">
                        <h3 className="mt-0 mb-0">{cardTypes[cardType].type}</h3>
                        <h5 className="mt-0 mb-4">{serialNr}</h5>
                        <div className="row">
                           <div className="col-4">
                              <p><strong>Title:</strong></p>
                           </div>
                           <div className="col-8 text-left">
                              <p className="nonclickable">{artTitle}</p>
                           </div>
                        </div>
                        {artist !== '' && <div className="row">
                           <div className="col-4">
                              <p><strong>Artist:</strong></p>
                           </div>
                           <div className="col-8 text-left">
                              <p>{artist}</p>
                           </div>
                        </div>}
                        {(layerArtists && layerArtists.length > 0) && <div className="row mt-1">
                           <div className="col-4">
                              <p><strong>Layer artists:</strong></p>
                           </div>
                           <div className="col-8 text-left">
                              {layerArtists.map((item, idx) => {
                                 return (
                                    <p key={item + idx} className="mb-0">{unescape(item)}</p>
                                 )
                              })}

                           </div>
                        </div>}
                     </div>
                  </div>

                  <div className={`token-image ${hasRealImage ? '' : 'no-scale'} ${isSensitive ? 'sensitive' : ''}`} style={{ backgroundImage: `url(${defaultImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

                     <RemoteImage src={visibleImage} />


                     <div className={`video-container ${isVideoOn ? 'playing' : ''}`} dangerouslySetInnerHTML={
                        {
                           __html: `
                                        <video
                                        loop
                                        muted
                                        autoplay
                                        playsinline
                                        src="${tokenVideo}"
                                        />`}}>
                     </div>



                     <div className="overlay">
                        <img src={sensitiveContent} alt="b n' v" />
                        <h5>Sensitive content</h5>
                        <p className="px-3">This photo contains content which some people may find offensive or disturbing.</p>
                        <hr />
                        <span onClick={() => { setIsSensitive(false) }}>See Photo</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );

}

export default NftCardV2;