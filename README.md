# 🗳️ Cast & Count - Decentralized Voting System

A modern, secure decentralized voting platform built with React and blockchain technology. Features separate admin and voter portals with real-time voting capabilities.

**🌐 Live Demo:** [https://cast-n-count.vercel.app/](https://cast-n-count.vercel.app/)

![React](https://img.shields.io/badge/React-18.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0.0-38B2AC)

## ✨ Features

- **🔐 Secure Authentication** - Admin portal with password protection, voter portal with MetaMask
- **🗳️ Real-time Voting** - Live vote casting with instant feedback and persistence
- **👥 Dynamic Candidates** - Add/remove candidates through admin portal
- **📊 Live Analytics** - Real-time voting statistics and progress monitoring
- **🔧 Mock Blockchain** - Simulated Ethereum smart contract functionality
- **📱 Responsive Design** - Mobile-friendly interface

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MetaMask browser extension

### Installation
```bash
git clone https://github.com/yourusername/cast-n-count.git
cd cast-n-count
npm install
npm run dev
```

## 📖 Usage

### For Administrators
1. **Access Admin Portal** → Enter password: `admin123`
2. **Deploy Contract** → Initialize the voting system
3. **Add Candidates** → Enter candidate names (e.g., "Modi", "Rahul")
4. **Register Voters** → Add wallet addresses or use bulk registration
5. **Manage Voting** → Start/stop voting sessions

### For Voters
1. **Connect Wallet** → Link MetaMask to the voter portal
2. **Register** → Click "📝 Register Me" to register your wallet
3. **Vote** → Select candidate and click "🗳️ Vote"
4. **Monitor** → View live statistics and voting progress

## 🏗️ Architecture

```
src/
├── components/voting/
│   ├── AdminDashboard.jsx    # Admin portal interface
│   └── VoterPortal.jsx       # Voter portal interface
├── utils/
│   ├── deployContract.js     # Mock blockchain logic
│   └── web3Config.js        # Web3 configuration
└── pages/Index.jsx          # Landing page
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Build Tool**: Vite
- **Blockchain**: Custom mock contract system
- **Storage**: localStorage for persistence

## 🔧 Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🔒 Security Features

- Wallet authentication via MetaMask
- Role-based access control
- Vote validation and duplicate prevention
- Persistent data storage with validation

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repo to Vercel
2. Build Command: `npm run build`
3. Output Directory: `dist`

### Manual
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

## 🔮 Roadmap

- [ ] Real Ethereum smart contract integration
- [ ] Multi-chain support
- [ ] Advanced analytics dashboard
- [ ] Mobile app version

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

*For questions or support, please open an issue on GitHub.*
