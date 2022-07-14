import React from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

interface WalletWrapperProps {
    children: React.ReactNode;
}

const network = 'http://127.0.0.1:8899' || WalletAdapterNetwork.Devnet;
const supportedWallets = [ new PhantomWalletAdapter() ];

const WalletWrapper: React.FC<WalletWrapperProps> = ({ children }) => {
    return (
        <ConnectionProvider endpoint={network}>
            <WalletProvider wallets={supportedWallets} autoConnect>
                <WalletModalProvider>
                   {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default WalletWrapper;

