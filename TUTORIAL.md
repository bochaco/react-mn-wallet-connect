# Building a React Wallet Connector with Midnight DApp API

This tutorial will guide you through creating a React application that connects to a wallet using the Midnight DApp Connector API.

The code examples in this tutorial intentionally omit CSS and visual styling to keep the examples focused and easy to read. The actual example code includes full styling (Tailwind classes and additional CSS) so the components are displayed with a polished, user-friendly appearance.

Also, the code in this tutorial is framework-agnostic and can be used with any React framework. You can drop these components and logic into projects created with Vite, Create React App, Next.js, Remix, Gatsby, or custom setups — you may only need to adjust the entry file (e.g. src/main.tsx vs src/index.tsx), routing, or build configuration to match your chosen scaffold.

## Step 1: Define TypeScript Interfaces

Let's first define a couple of interfaces for the props passed between the components we are going to create. Their main purpose is to provide type safety and clear contracts for components.

Button enforces an onClick and children payload, while WalletCard describes the connection state and callbacks used by the app to trigger connect/disconnect actions.

The actual implementation of the interfaces shown below can be found in the example app at [src/types.ts](src/types.ts).

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

We now define a Button component: it receives an onClick handler, content, and optional styling. Its purpose is to centralize button behavior/markup so other components (like WalletCard) can remain focused on logic rather than repetitive element structure.

The implementation used in the example app is available at [src/components/Button.tsx](src/components/Button.tsx).

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

The WalletCard aggregates UI and actions related to the wallet connection: it shows status, displays the address when available, and exposes connect/disconnect actions via the Button component. 

Its main role in the app is to be the single visible component that reflects the wallet connection state and triggers the logic handled by the App component.

The WalletCard component as implemented in the example app can be found at [src/components/WalletCard.tsx](src/components/WalletCard.tsx).

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

We need one last component, the App component, which manages state and business logic: it holds connection state and the current wallet address, and provides callbacks to child components to change that state. 

To begin with, the connect handler is a stub producing a dummy wallet address; later on we will call the Midnight DApp Connector. App wires UI (WalletCard) to the connector logic and is the central coordinator for the application.

The App component shown below is implemented in the example app at [src/App.tsx](src/App.tsx).

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

At this point we are ready to bootstrap the React application into the DOM. We can now mount the App component and ensure React runs in StrictMode during development.

In the implemented example it also pulls in Tailwind-generated CSS so the UI renders with the intended styling, this can be found at [src/main.tsx](src/main.tsx).

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

## Step 6: Configure HTML and Tailwind

Lastly, we create the HTML file providing the hosting page for the single-page app and links the global stylesheet. Its role is simple but essential: it includes the root element where React mounts and ensures the app's CSS is loaded so the components from the example app display with the intended polished appearance.

The HTML used by the example app is available at [index.html](index.html).

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

Your application should now be displaying a dummy address, so now we are ready to add the last piece to integrate it with the Midnight DApp Connector, to retrieve the actual wallet's address.

## Step 7: Install Midnight DApp Connector

Install the required package:

```bash
npm install @midnight-ntwrk/dapp-connector-api
```

## Step 8: Integrate Midnight DApp Connector

Let's now replace `handleConnect` function body in the App component with a real implementation using the DApp Connector API.

This code demonstrates how to call the Midnight DApp Connector API to enable the wallet, check whether it's enabled, and retrieve the current wallet state (including the address). With this code, the App's state reflects the actual wallet and the WalletCard displays the real address and connection status:

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