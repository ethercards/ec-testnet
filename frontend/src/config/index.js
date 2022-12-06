const dev = {
    DEPLOYED_NTW_NAME: 'rinkeby',
    DEPLOYED_CHAIN_ID: 5,
    INFURA_ID: 'faa9a13f92b545b198a36965fa6d4c76',
    FORTMATIC_KEY: 'pk_test_DD2BBA8AAA1D4FED',
    RPC_URL: 'https://goerli.infura.io/v3/faa9a13f92b545b198a36965fa6d4c76',
    BASE_CID: 'https://ec-serverapp-staging.herokuapp.com/card',
    BASE_OPENSEA: 'https://testnets.opensea.io/assets/goerli/goerli/',
    BASE_ETHERSCAN: 'https://goerli.etherscan.io/token/'
};

const prod = {
    DEPLOYED_NTW_NAME: 'mainnet',
    DEPLOYED_CHAIN_ID: 1,
    INFURA_ID: 'faa9a13f92b545b198a36965fa6d4c76',
    FORTMATIC_KEY: 'pk_live_FBFF1F05F2879F29',
    RPC_URL: 'https://goerli.infura.io/v3/faa9a13f92b545b198a36965fa6d4c76',
    BASE_CID: 'https://heroku.ether.cards/card',
    BASE_OPENSEA: 'https://opensea.io/assets/',
    BASE_ETHERSCAN: 'https://etherscan.io/token/'
};

const common = {
    // DAPP_ID: '3c7b6054-6292-481f-bd3a-af5687425e98',
    LAYERS_BASE_URL: 'https://ether-cards.mypinata.cloud/ipfs/Qmcm7BjsmhwWVA611EZSGkxcqt3JmsbF9m37kPNhDLoy4o',
}

// if use npm/yarn start,  NODE_ENV = "development"
// if use npm/yarn build,  NODE_ENV = "production"
let envConfig = dev // process.env.NODE_ENV === "development" ? dev : prod
let config = { ...envConfig, ...common }

export default config;


// pointless comment for test commit
