# Building a React Wallet Connector with Midnight DApp API

This tutorial will guide you through creating a React application that connects to a wallet using the Midnight DApp Connector API.

Note: the code examples in this tutorial intentionally omit CSS and visual styling to keep the examples focused and easy to read. The actual example code includes full styling (Tailwind classes and additional CSS) so the components are displayed with a polished, user-friendly appearance.

## Step 1: Define TypeScript Interfaces

The actual implementation of the interfaces shown below can be found in the example app at `src/types.ts`:

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

The implementation used in the example app is available at `src/components/Button.tsx`:

```typescript
import React from "react";
import type { ButtonProps } from "../types";

const Button: React.FC<ButtonProps> = ({onClick, children, className = ""}) => {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};
```

## Step 3: Create WalletCard Component

The WalletCard component as implemented in the example app can be found at `src/components/WalletCard.tsx`:

```typescript
import React from "react";
import Button from "./Button";
import type { WalletCardProps } from "../types";

const WalletCard: React.FC<WalletCardProps> = ({
  isConnected,
  walletAddress,
  onConnect,
  onDisconnect,
}) => {
  return (
    <div>
      <div>
        <h2>Connection Status</h2>
        <div className={isConnected ? "text-green-400" : "text-red-400"}>
          {isConnected ? "Connected" : "Disconnected"}
        </div>
      </div>

      <div>
        {isConnected && walletAddress ? (
          <>
            <p>Wallet Address:</p>
            <p title={walletAddress}>{walletAddress}</p>
          </>
        ) : (
          <p>Please connect your wallet to proceed.</p>
        )}
      </div>

      <div>
        {isConnected ? (
          <Button onClick={onDisconnect}>Disconnect Wallet</Button>
        ) : (
          <Button onClick={onConnect}>Connect Wallet</Button>
        )}
      </div>
    </div>
  );
};
```

## Step 4: Create Main App Component

The App component shown below is implemented in the example app at `src/App.tsx`:

```typescript
import React, { useState, useCallback } from 'react';
import WalletCard from './components/WalletCard';

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleConnect = useCallback(() => {
    // We will replace this to actually use the Midnight DApp connector API.
    const fakeAddress = `0x${Array(40).fill(0).join("")}`;
    setWalletAddress(fakeAddress);
    setIsConnected(true);
  }, []);

  const handleDisconnect = useCallback(() => {
    setWalletAddress(null);
    setIsConnected(false);
  }, []);

  return (
    <div>
      <header>
        <h1>Midnight Wallet Connector</h1>
      </header>
      <main>
        <WalletCard
          isConnected={isConnected}
          walletAddress={walletAddress}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
      </main>
    </div>
  );
};
```

## Step 5: Create Entry Point

The entry point used in the example app is at `src/main.tsx`:

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

The HTML used by the example app is available at `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="/index.css">
    <title>React Midnight Wallet Connector</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Your application should now be displaying a dummy address. Next step is to inegrate it with the Midnight DApp Connector to retrieve the actual wallet's address.

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