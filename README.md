# 📝 Nootverse

A decentralized note-taking application built on the Internet Computer. Nootverse empowers users to take control of their notes with true ownership, privacy, and the power of blockchain technology.

## ✨ Features

- **📝 Rich Note Taking**: Create notes with title, content, and tags for perfect organization
- **🎨 Markdown Support**: Full markdown rendering with live preview in edit mode
- **🔍 Powerful Search**: Search through titles, content, and tags with real-time filtering
- **🔒 Complete Privacy**: Your notes are completely private and isolated from other users
- **⚡ Lightning Fast**: Built on Internet Computer for instant loading and real-time synchronization
- **🛡️ Secure Authentication**: Internet Identity integration with popup-based authentication
- **📱 Modern UI/UX**: Beautiful Material Design 3 interface with smooth animations
- **🏷️ Tag System**: Organize notes with color-coded tags for easy categorization
- **👁️ Read Mode**: Click any note card to view in a beautiful, readable format
- **✏️ Edit Mode**: Seamless editing with markdown preview and syntax highlighting

## 🏗️ Architecture

### Backend (Motoko)
- **Canister**: `Nootverse_backend` - Core note management logic
- **Authentication**: Principal-based user isolation for complete privacy
- **Storage**: Stable storage for data persistence across upgrades
- **Features**: CRUD operations, search functionality, tag management

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5 with Material Design 3 principles
- **Markdown**: ReactMarkdown with GitHub-flavored markdown support
- **Animations**: Framer Motion for smooth transitions and interactions
- **State Management**: React Context for authentication and app state
- **Authentication**: Internet Identity with popup window integration

## 🚀 Getting Started

### Prerequisites

- [DFX SDK](https://internetcomputer.org/docs/current/developer-docs/setup/install/) (version 0.15.0 or later)
- [Node.js](https://nodejs.org/) (version 16 or later)
- [npm](https://www.npmjs.com/) (version 7 or later)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Nootverse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the local IC replica**
   ```bash
   dfx start --background
   ```

4. **Deploy the canisters**
   ```bash
   dfx deploy
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## 🛠️ Development Commands

### DFX Commands
```bash
# Start local replica
dfx start --background

# Deploy all canisters
dfx deploy

# Deploy specific canister
dfx deploy Nootverse_backend
dfx deploy Nootverse_frontend

# Generate Candid interfaces
dfx generate

# Check canister status
dfx canister status Nootverse_backend

# Stop local replica
dfx stop
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Format code
npm run format
```

### Backend Testing
```bash
# Call backend methods directly
dfx canister call Nootverse_backend addNote '("note-1", "My First Note", "This is the content of my note", vec { "personal"; "test" })'

dfx canister call Nootverse_backend getAllOwnedNotes '()'
dfx canister call Nootverse_backend searchNotes '("personal")'
dfx canister call Nootverse_backend whoami '()'
```

## 📁 Project Structure

```
Nootverse/
├── README.md                          # This file
├── dfx.json                          # DFX configuration
├── mops.toml                         # Motoko package manager config
├── package.json                      # Root package.json
├── src/
│   ├── Nootverse_backend/
│   │   └── main.mo                   # Motoko backend canister
│   └── Nootverse_frontend/
│       ├── package.json              # Frontend dependencies
│       ├── index.html                # HTML entry point
│       ├── src/
│       │   ├── App.tsx               # Main App component
│       │   ├── main.jsx              # Entry point
│       │   ├── components/           # React components
│       │   │   ├── AuthButton.tsx    # Authentication button
│       │   │   ├── Navigation.tsx    # Navigation sidebar
│       │   │   ├── NoteDialog.tsx    # Note creation/editing dialog
│       │   │   ├── NoteViewDialog.tsx # Read-only note view dialog
│       │   │   └── ConfirmDialog.tsx # Custom confirmation dialog
│       │   ├── contexts/             # React contexts
│       │   │   └── AuthContext.tsx   # Authentication context
│       │   ├── pages/                # Application pages
│       │   │   ├── Notes.tsx         # Main notes management page
│       │   │   └── About.tsx         # About page
│       │   ├── theme/                # Material-UI theme
│       │   │   └── theme.ts          # Custom theme configuration
│       │   ├── types/                # TypeScript types
│       │   │   └── index.ts          # Type definitions
│       │   └── utils/                # Utility functions
│       │       └── backend.ts        # Backend integration
│       └── vite.config.js            # Vite configuration
└── tsconfig.json                     # TypeScript configuration
```

## 🔧 Backend API

### Types
```motoko
type Note = {
  id: Text;
  title: Text;
  content: Text;
  tags: [Text];
};
```

### Methods
- `addNote(id: Text, title: Text, content: Text, tags: [Text]): async ()` - Create a new note
- `getAllOwnedNotes(): async [Note]` - Get all user's notes
- `updateNote(keyId: Nat, id: Text, title: Text, content: Text, tags: [Text]): async ()` - Update existing note
- `deleteNote(index: Nat): async ()` - Delete note by index
- `searchNotes(queryString: Text): async [Note]` - Search notes by title, content, or tags
- `whoami(): async Principal` - Get current user's principal

## 💡 User Experience

### Note Management Workflow
1. **Browse Notes**: View all notes in a responsive grid with markdown-rendered previews
2. **Quick Read**: Click any note card to open in read-only view with beautiful formatting
3. **Create Notes**: Use the floating action button (+) to create new notes
4. **Edit Notes**: Click the edit button to modify notes with live markdown preview
5. **Organize**: Add tags to categorize and organize notes
6. **Search**: Use the search bar to find notes by title, content, or tags
7. **Delete**: Custom confirmation dialog ensures safe deletion

### Note Cards Features
- **Title Display**: Prominent note titles for easy identification
- **Markdown Preview**: Rendered markdown content for better scanning
- **Tag Display**: Color-coded chips showing note categories
- **Action Buttons**: Edit and delete buttons with hover effects
- **Responsive Design**: Perfect layout on all screen sizes

### Dialogs & Interactions
- **Note View Dialog**: Read-only view with proper padding and typography
- **Note Edit Dialog**: Tabbed interface (Edit/Preview) with markdown support
- **Tag Management**: Easy add/remove tags with chip-based interface
- **Custom Confirmations**: Material Design 3 confirmation dialogs
- **Smooth Animations**: Framer Motion animations throughout

## 🎨 Design System

### Color Palette
- **Primary**: Gradient from Indigo (#6366f1) to Purple (#8b5cf6)
- **Note Cards**: Material Design 3 elevated surfaces with proper contrast
- **Tags**: Primary color chips with outlined variants
- **Background**: Clean, minimal backgrounds for better readability

### Typography
- **Headings**: Inter font family with gradient text effects
- **Content**: Optimized for readability with proper line heights
- **Code**: Monaco/Menlo monospace fonts for code blocks
- **Markdown**: Full typography scale for headers, lists, and formatting

### Components
- **Note Cards**: Material Design 3 elevated cards with hover effects
- **Dialogs**: Rounded corners, proper spacing, and smooth animations
- **Buttons**: Gradient primary buttons with hover states
- **Search**: Integrated search bar with clear functionality
- **Navigation**: Minimal sidebar with easy access to features

## 🔒 Security & Privacy Features

- **Internet Identity**: Secure authentication without passwords
- **Principal-based Isolation**: Each user's notes are completely isolated
- **No Social Features**: Pure personal productivity focus
- **Stable Storage**: Data persists across canister upgrades
- **Input Validation**: Proper validation for all user inputs
- **Client-side Encryption**: Notes are private by design

## 🚀 Deployment

### Local Deployment
Follow the installation steps above for local development.

### IC Mainnet Deployment
```bash
# Deploy to IC mainnet
dfx deploy --network ic

# Check deployment status
dfx canister --network ic status Nootverse_backend
```

## 🧪 Testing

### Manual Testing
1. Start local replica with `dfx start --background`
2. Deploy canisters with `dfx deploy`
3. Open `http://localhost:3000` in browser
4. Test authentication flow with Internet Identity
5. Create notes with titles, content, and tags
6. Test markdown rendering in both preview and view modes
7. Test search functionality across all note fields
8. Test edit and delete operations

### Backend Testing
Use the DFX CLI to test backend methods directly:
```bash
# Test creating a note
dfx canister call Nootverse_backend addNote '("test-id", "My Test Note", "# Hello World\n\nThis is **markdown** content!", vec { "test"; "markdown" })'

# Test searching notes
dfx canister call Nootverse_backend searchNotes '("markdown")'
```

## 📚 Dependencies

### Backend
- `motoko-hash-map`: Efficient hash map implementation
- `StableBuffer`: Stable buffer for persistent storage
- `base`: Motoko base library (Text, Principal, etc.)

### Frontend
- `react`: UI framework (v18)
- `@mui/material`: Material-UI components (v5)
- `react-markdown`: Markdown rendering with GitHub flavored markdown
- `remark-gfm`: GitHub flavored markdown plugin
- `framer-motion`: Animation library
- `@dfinity/auth-client`: Internet Identity integration
- `@dfinity/agent`: IC agent for canister communication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Internet Computer](https://internetcomputer.org/)
- [DFX SDK Documentation](https://internetcomputer.org/docs/current/developer-docs/setup/install/)
- [Motoko Documentation](https://internetcomputer.org/docs/current/developer-docs/backend/motoko/)
- [Material-UI Documentation](https://mui.com/)
- [ReactMarkdown Documentation](https://github.com/remarkjs/react-markdown)

## 🙏 Acknowledgments

- Built on the Internet Computer blockchain
- Inspired by the "Your notes, your control" philosophy
- Uses Internet Identity for secure, passwordless authentication
- Material Design 3 for beautiful, accessible user interfaces
- Based on the original NootedNet concept

---

**📝 Welcome to Nootverse - Your notes, your control!**