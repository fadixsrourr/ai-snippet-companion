import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import "./styles/globals.css";
import { router } from './app/router';
import { Providers } from './app/providers';


const root = createRoot(document.getElementById('root')!);
const queryClient = new QueryClient();


root.render(
<StrictMode>
<QueryClientProvider client={queryClient}>
<Providers>
<RouterProvider router={router} />
</Providers>
</QueryClientProvider>
</StrictMode>
);