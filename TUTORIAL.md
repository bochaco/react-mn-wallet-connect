# Building a React Wallet Connector with Midnight DApp API

This tutorial will guide you through creating a React application that connects to a wallet using the Midnight DApp Connector API.

## Project Setup

First, create a new project directory and initialize it:

```bash
mkdir react-mn-wallet-connect
cd react-mn-wallet-connect
npm create vite@latest
```

When prompted, provide these answers:
- Project name: `react-mn-wallet-connect`
- Select a framework: `React`
- Select a variant: `TypeScript`
- Use rolldown-vite (Experimental)?: `No`
- Install with npm and start now?: `Yes`

You can open the application in your browser: `http://localhost:5173/`

## Step 1: Define TypeScript Interfaces

Create a new file `src/types.ts`:

```typescript
import type { ReactNode } from 'react';

export interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

export interface WalletCardProps {
  isConnected: boolean;
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}
```

## Step 2: Create Button Component

Create `src/components/Button.tsx`:

```typescript
import React from 'react';
import type { ButtonProps } from '../types';

const Button: React.FC<ButtonProps> = ({ onClick, children, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-3 
        font-semibold text-white 
        rounded-lg 
        shadow-md 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
        transition-all duration-300 ease-in-out
        transform hover:-translate-y-1 hover:shadow-lg
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
```

## Step 3: Create WalletCard Component

Create `src/components/WalletCard.tsx`:

```typescript
import React from 'react';
import Button from './Button';
import type { WalletCardProps } from '../types';

const WalletCard: React.FC<WalletCardProps> = ({ isConnected, walletAddress, onConnect, onDisconnect }) => {
  return (
    <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-purple-500/10 border border-gray-700 p-8 transform transition-all duration-500 hover:scale-105">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-100">Connection Status</h2>
        <div className={`flex items-center space-x-2 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
          <span className="text-sm font-medium">{isConnected ? 'Connected' : 'Disconnected'}</span>
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 min-h-[120px] flex flex-col justify-center items-center text-center">
        {isConnected && walletAddress ? (
          <>
            <p className="text-sm text-gray-400 mb-2">Wallet Address:</p>
            <p className="text-lg font-mono break-all text-purple-300" title={walletAddress}>
              {walletAddress}
            </p>
          </>
        ) : (
          <p className="text-gray-400">Please connect your wallet to proceed.</p>
        )}
      </div>

      <div className="mt-8">
        {isConnected ? (
          <Button
            onClick={onDisconnect}
            className="w-full bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            Disconnect Wallet
          </Button>
        ) : (
          <Button
            onClick={onConnect}
            className="w-full bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
          >
            Connect Wallet
          </Button>
        )}
      </div>
    </div>
  );
};

export default WalletCard;
```

## Step 4: Create Main App Component

Create `src/App.tsx`:

```typescript
import React, { useState, useCallback } from 'react';
import WalletCard from './components/WalletCard';

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleConnect = useCallback(() => {
    // This is a simulation of a wallet connection.
    // We will replace it to use the Midnight DApp connector API.
    const fakeAddress = `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    setWalletAddress(fakeAddress);
    setIsConnected(true);
  }, []);

  const handleDisconnect = useCallback(() => {
    setWalletAddress(null);
    setIsConnected(false);
  }, []);

  return (
    <div className="bg-gray-900 flex flex-col items-center justify-center p-4 font-sans">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Wallet Connector
        </h1>
        <p className="text-gray-400 mt-2">A simple and elegant interface for wallet interactions.</p>
      </header>
      <main>
        <WalletCard
          isConnected={isConnected}
          walletAddress={walletAddress}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
      </main>
      <footer className="absolute bottom-4 text-gray-500 text-sm">
        <p>Built with React, TypeScript, and Tailwind CSS</p>
      </footer>
    </div>
  );
};

export default App;
```

## Step 5: Create Entry Point

Create `src/main.tsx`:

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

## Step 6: Configure HTML and Tailwind

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <link rel="stylesheet" href="/index.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Wallet Connector</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-gray-900 text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Your application should now be displaying some random address. Next step is to inegrate it with the Midnight DApp Connector.

## Step 7: Install Midnight DApp Connector

Install the required package:

```bash
npm install @midnight-ntwrk/dapp-connector-api
```

## Step 8: Integrate Midnight DApp Connector

Let's now replace `handleConnect` function body in `src/App.tsx` with a real implementation using the DApp Connector API:

```typescript
  const handleConnect = useCallback(async () => {
    try {
      const connectorAPI = await window.midnight?.mnLace.enable();

      const isEnabled = await window.midnight?.mnLace.isEnabled();
      if (isEnabled) {
        console.log("Connected to the wallet:", connectorAPI);
        setIsConnected(true);
        const state = await connectorAPI.state();
        setWalletAddress(state.address);
      } else {
        setIsConnected(false);
        setWalletAddress(null);
      }
    } catch (error) {
      console.log("An error occurred:", error);
      setIsConnected(false);
      setWalletAddress(null);
    }
  }, []);
```

Your application should now be running with the Midnight DApp Connector integration!