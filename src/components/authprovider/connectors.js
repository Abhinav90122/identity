import { InjectedConnector } from '@web3-react/injected-connector';
import { UAuthConnector } from '@uauth/web3-react';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

export const MetaMask = new InjectedConnector({ supportedChainIds: [80001] });

const walletconnect = new WalletConnectConnector({
  qrcode: true,
});

export const uauth = new UAuthConnector({
  clientID: '6ee8b44e-1060-4976-9693-b7f5f113c238',
  redirectUri:
    process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000',
  scope: 'openid wallet',
  connectors: { injected: MetaMask, walletconnect },
});
