import React, { useEffect, useState } from 'react';
import { Web3Auth } from '@web3auth-mpc/web3auth';
import { OpenloginAdapter } from '@web3auth-mpc/openlogin-adapter';
import { SafeEventEmitterProvider } from '@web3auth-mpc/base';
import RPC from '../lib/ethersRPC';
import {
  tssDataCallback,
  tssGetPublic,
  tssSign,
  generatePrecompute,
} from 'torus-mpc';
const web3authClientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '';

function W3Auth() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  useEffect(() => {
    if (!web3authClientId) return;
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId: web3authClientId, // Client ID from your Web3Auth Dashboard
          // Additional uiConfig for Whitelabeling can be passed here
          uiConfig: {
            // appLogo: 'https://images.web3auth.io/web3auth-logo-w.svg',
            theme: 'light',
            loginMethodsOrder: ['twitter', 'google'],
          },
          chainConfig: {
            chainNamespace: 'eip155',
            chainId: '0x5',
            rpcTarget: 'https://rpc.ankr.com/eth_goerli',
            displayName: 'Goerli Testnet',
            blockExplorer: 'https://goerli.etherscan.io/',
            ticker: 'ETH',
            tickerName: 'Ethereum',
          },
          enableLogging: true,
        });

        // const openloginAdapter = new OpenloginAdapter({
        //   // Multi Factor Authentication has to be mandatory
        //   loginSettings: {
        //     mfaLevel: 'optional',
        //   },
        //   // TSS Settings needed for TSS implementation
        //   tssSettings: {
        //     useTSS: true,
        //     tssGetPublic,
        //     tssSign,
        //     tssDataCallback,
        //   },
        //   adapterSettings: {
        //     // points to the beta mpc network containing TSS implementation
        //     _iframeUrl: 'https://mpc-beta.openlogin.com',
        //     // network has to be development
        //     network: 'development',
        //     clientId: web3authClientId, // Client ID from your Web3Auth Dashboard
        //   },
        // });
        // web3auth.configureAdapter(openloginAdapter);
        // config to remove the external wallet adapters
        await web3auth.initModal({
          modalConfig: {
            'torus-evm': {
              label: 'Torus Wallet',
              showOnModal: false,
            },
            metamask: {
              label: 'Metamask',
              showOnModal: false,
            },
            'wallet-connect-v1': {
              label: 'Wallet Connect',
              showOnModal: false,
            },
          },
        });
        setWeb3auth(web3auth);

        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log('web3auth not initialized yet');
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    // generatePrecompute(); // <-- So one precompute would be available to your users.
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      console.log('web3auth not initialized yet');
      return;
    }
    const idToken = await web3auth.authenticateUser();
    console.log(idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log('web3auth not initialized yet');
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log(user);
  };

  const logout = async () => {
    if (!web3auth) {
      console.log('web3auth not initialized yet');
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const getChainId = async () => {
    if (!provider) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    console.log(chainId);
  };
  const getAccounts = async () => {
    if (!provider) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    console.log(address);
  };

  const getBalance = async () => {
    if (!provider) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    console.log(balance);
  };

  const sendTransaction = async () => {
    if (!provider) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction();
    console.log(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage();
    console.log(signedMessage);
  };

  const getPrivateKey = async () => {
    if (!provider) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    console.log(privateKey);
  };

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={authenticateUser} className="card">
            Get ID Token
          </button>
        </div>
        <div>
          <button onClick={getChainId} className="card">
            Get Chain ID
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={getPrivateKey} className="card">
            Get Private Key
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>

      <div id="console" style={{ whiteSpace: 'pre-line' }}>
        <p style={{ whiteSpace: 'pre-line' }}>Logged in Successfully!</p>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
          Web3Auth
        </a>
        & NextJS Example
      </h1>

      <div className="grid">{provider ? loggedInView : unloggedInView}</div>
    </div>
  );
}

export default W3Auth;
