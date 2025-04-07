# CRE Agent Frontend

Next.js-based frontend for the CRE Agent platform - an AI assistant for commercial real estate professionals.

## Directory Structure

```
frontend/
├── app/                # Next.js App Router
│   ├── admin/          # Admin panel pages
│   ├── chat/           # Chat interface
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Landing page
├── components/         # Reusable components
│   ├── ui/             # UI components (buttons, inputs, etc.)
│   ├── data-display/   # Data visualization components
│   └── ...             # Feature-specific components
├── lib/                # Utility functions and API client
├── public/             # Static assets
└── ...                 # Config files
```

## Key Features

- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Responsive Design**: Works on desktop and mobile devices
- **Admin Dashboard**: Manage vector stores, files, and agent settings
- **Chat Interface**: Interactive AI assistant with real-time responses
- **Data Visualization**: Charts and displays for real estate data

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env.local` file with:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application

## Component Guide

### Core Components

- **ChatInput**: Input component for the chat interface
- **ChatMessage**: Displays AI and user messages
- **FileUpload**: Handles file uploads to the backend
- **VectorStoreForm**: Create and manage vector stores
- **DataDisplay**: Visualization components for property data

### Admin Section

The admin section (`/admin`) provides interfaces for:

- Managing vector stores for document search
- Uploading and managing files
- Configuring AI agent settings

### Chat Interface

The chat interface (`/chat`) includes:

- Real-time messaging with the AI assistant
- Tools panel for specific agent capabilities
- Context-aware responses based on uploaded data

## Customization

- Edit `globals.css` to modify the global styles
- Add new UI components in the `components/ui` directory
- Create new pages in the `app` directory following Next.js App Router conventions

## API Integration

The frontend communicates with the FastAPI backend through the API client in `lib/api-client.ts`.

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

## Deployment

Deploy the frontend to Vercel or any hosting platform that supports Next.js:

```bash
npm run build
npm run start
```

Or follow the [Next.js deployment documentation](https://nextjs.org/docs/deployment).
