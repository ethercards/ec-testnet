import './App.css';
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom';
import routes from './Routes';
import Onboard from 'bnc-onboard';
import {ethers} from 'ethers';

import { useEffect, useState } from 'react';
import { toast, ToastContainer} from 'react-toast'

import Web3Ctx from './components/Context/Web3Ctx.js'; 
import config from './config';


const DEPLOYED_NTW_NAME = config.DEPLOYED_NTW_NAME
const DEPLOYED_CHAIN_ID = config.DEPLOYED_CHAIN_ID
const INFURA_ID = config.INFURA_ID
const FORTMATIC_KEY = config.FORTMATIC_KEY
const RPC_URL = config.RPC_URL


function App(props) {

  const [onboard,setOnboard] = useState(null);
  const [address,setAddress] = useState(null);
  const [wallet,setWallet] = useState(null);
  const [ethersProvider,setEthersProvider] = useState(null);
  const [chainId, setChainId] = useState(DEPLOYED_CHAIN_ID);

  const [connecting,setConnecting] = useState(false);
  const [initDone,setInitDone] = useState(false);

  useEffect(()=>{
    console.log('app mounted');
    console.log(config);
    const initApp = async () => {
      setInitDone(false);
      try{
        const onboard = Onboard({
          // dappId: config.DAPP_ID,       // [String] The API key created by step one above
          networkId: DEPLOYED_CHAIN_ID,  // [Integer] The Ethereum network ID your Dapp uses.
          darkMode: true,
          blockPollingInterval:12000,
          walletSelect: {
            wallets:[
              { walletName: "metamask"},
              { walletName: "coinbase"},
              { walletName: "trust",rpcUrl: RPC_URL },
              { walletName: "authereum" },
              { walletName: "wallet.io", rpcUrl: RPC_URL },
              { walletName: "atoken" },
              {
                walletName: "fortmatic",
                apiKey: FORTMATIC_KEY
              },
              {
                walletName: "walletConnect",
                rpc: {
                        1: RPC_URL,
                        4: RPC_URL,
                        5: RPC_URL,
                        11155111: RPC_URL,
                     }
              },
              { walletName: "opera" },
              { walletName: "operaTouch" },
              { walletName: "torus" },
              { walletName: 'status' },
              { walletName: 'walletLink', rpcUrl: RPC_URL },
              {
                walletName: 'trezor',
                appUrl: 'ether.cards',
                email: 'info@ether.cards',
                rpcUrl: RPC_URL
              },
              {
                walletName: 'ledger',
                rpcUrl: RPC_URL
              }]
          },
          walletCheck: [
            { checkName: 'derivationPath' },
            { checkName: 'accounts' },
            { checkName: 'connect' },
            { checkName: 'network' }],
          
          subscriptions: {
            wallet: obWallet => {
             // console.log('wallet on select',obWallet)
              setWallet(obWallet);
            },
            address: obAddress => {
              setAddress(obAddress);
            },
            network: network => {
              setChainId(network);
            }
          }
        });

        const savedWallet = localStorage.getItem('selectedWallet');
        if(savedWallet){
          setConnecting(true);
          await onboard.walletSelect(savedWallet);
          const userReady = await onboard.walletCheck();
          //console.log('user ready(with saved wallet)',userReady);
        }else{
          const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
          setEthersProvider(provider);
        }

        setOnboard(onboard);

      }catch (e){
        console.log('onboard init error',e);
      }

    };

    initApp();
  },[]);

  useEffect(()=>{
    //console.log('user ready [wallet, chainId, address]',wallet, chainId, address);

    if(onboard && wallet && wallet.name && chainId ){
      const userReady =  onboard.walletCheck();
      window.localStorage.setItem('selectedWallet', wallet.name);

      setEthersProvider(new ethers.providers.Web3Provider(wallet.provider));

      // const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
      // setEthersProvider(provider);
      //console.log('wallet,chainId, address, ethersProvider',wallet,chainId, address, ethersProvider)
      setInitDone(true);
      setConnecting(false);
    }else{
      setConnecting(false);
      if(ethersProvider){
        setInitDone(true);
      }
    }

  },[wallet, chainId, onboard])

  if(!initDone){
    return (
      <>loading...</>
    );
  } 

  if(initDone && ( chainId && chainId !== DEPLOYED_CHAIN_ID)){
    return (
      <>wrong chain {''+chainId}</>
    );
  } 
  return (
    <Web3Ctx.Provider value={{onboard,wallet,address,ethersProvider,chainId,connecting}}>
      <div id="application">
          <HashRouter basename='/'>
            <Switch>
              {routes.map((route, key)=>(
                <Route key={key} path={route.path} component={route.component} exact={route.exact} />
              ))}
            </Switch>
          </HashRouter>
        <ToastContainer delay={4000}  position="bottom-right"/>
      </div>
    </Web3Ctx.Provider>
  );
}

export default App;
