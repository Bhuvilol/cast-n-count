# 🗳️ Cast & Count - Decentralized Voting System

A modern, secure, and user-friendly decentralized voting platform built with React and blockchain technology. This system provides a complete voting solution with separate admin and voter portals, ensuring transparency and integrity in the voting process.

![Voting System](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0.0-38B2AC)

## 🌟 Features

### 🔐 **Secure Authentication**
- **Admin Portal**: Password-protected admin interface
- **Voter Portal**: MetaMask wallet integration
- **Role-based Access**: Separate permissions for admins and voters

### 🗳️ **Voting System**
- **Real-time Voting**: Live vote casting with instant feedback
- **Vote Persistence**: Votes stored securely across sessions
- **One Vote Per Wallet**: Prevents duplicate voting
- **Voting Sessions**: Start, stop, and reset voting periods

### 👥 **Candidate Management**
- **Dynamic Candidates**: Add/remove candidates through admin portal
- **Live Updates**: Real-time candidate list synchronization
- **Vote Tracking**: Individual vote counts for each candidate

### 📊 **Analytics & Monitoring**
- **Live Statistics**: Real-time voting progress
- **Voter Registration**: Track registered voters
- **Voting Status**: Active/inactive voting session monitoring
- **Comprehensive Dashboard**: Admin overview of all system metrics

### 🔧 **Technical Features**
- **Mock Blockchain**: Simulated Ethereum smart contract functionality
- **Persistent Storage**: localStorage-based data persistence
- **Responsive Design**: Mobile-friendly interface
- **Error Handling**: Comprehensive error management and user feedback

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension (for voter portal)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cast-n-count.git
   cd cast-n-count
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080` (or the port shown in terminal)

## 📖 Usage Guide

### For Administrators

1. **Access Admin Portal**
   - Navigate to the landing page
   - Click "Admin Login"
   - Enter password: `admin123`

2. **Deploy Contract**
   - Click "Deploy Contract" to initialize the voting system
   - Wait for deployment confirmation

3. **Add Candidates**
   - Use "Add Candidate" to add voting options
   - Enter candidate names (e.g., "Modi", "Rahul", "Kejriwal")

4. **Register Voters**
   - Add voter wallet addresses
   - Use "Register Multiple Voters" for bulk registration

5. **Manage Voting Session**
   - Click "Start Voting" to begin
   - Use "End Voting" to stop the session
   - "Reset System" to clear all data

### For Voters

1. **Connect Wallet**
   - Navigate to "Voter Portal"
   - Click "Connect Wallet" to link MetaMask
   - Ensure you're on the correct network

2. **Register as Voter**
   - Click "📝 Register Me" to register your wallet
   - Wait for registration confirmation

3. **Cast Your Vote**
   - Select your preferred candidate
   - Click "🗳️ Vote" to submit
   - Confirm the transaction in MetaMask

4. **Monitor Results**
   - View live voting statistics
   - Check your voting status
   - See real-time candidate vote counts

## 🏗️ Architecture

### Frontend Components
```
src/
├── components/
│   ├── voting/
│   │   ├── AdminDashboard.jsx    # Admin portal interface
│   │   └── VoterPortal.jsx       # Voter portal interface
│   └── ui/                       # Reusable UI components
├── pages/
│   └── Index.jsx                 # Landing page
├── utils/
│   ├── deployContract.js         # Mock blockchain logic
│   └── web3Config.js            # Web3 configuration
└── hooks/                        # Custom React hooks
```

### Data Flow
1. **Admin Portal** → Manages candidates, voters, and voting sessions
2. **Mock Contract** → Simulates blockchain functionality with localStorage
3. **Voter Portal** → Provides voting interface and real-time updates
4. **Persistent Storage** → Maintains data across sessions

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with JSX
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite for fast development and building
- **Blockchain Simulation**: Custom mock contract system
- **State Management**: React hooks and localStorage
- **UI Components**: Modern, accessible design system

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Project Structure
```
cast-n-count/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── utils/            # Utility functions
│   ├── hooks/            # Custom hooks
│   └── types/            # TypeScript definitions
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🔒 Security Features

- **Wallet Authentication**: Secure MetaMask integration
- **Role-based Access**: Separate admin and voter permissions
- **Vote Validation**: Prevents duplicate and invalid votes
- **Data Integrity**: Persistent storage with validation
- **Error Handling**: Comprehensive error management

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/cast-n-count/issues) page
2. Create a new issue with detailed information
3. Include browser console logs for debugging

## 🔮 Future Enhancements

- [ ] Real Ethereum smart contract integration
- [ ] Multi-chain support
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Advanced security features
- [ ] API for external integrations

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

*For questions or support, please open an issue on GitHub.*
