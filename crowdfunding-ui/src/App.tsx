import React from 'react';
import './App.css';
import WalletWrapper from './wrappers/wallet-wrapper';

interface AppProps {

}

const App: React.FC<AppProps> = () => {
    return (
        <WalletWrapper>
            <div></div>
        </WalletWrapper>
    );
}

export default App;
