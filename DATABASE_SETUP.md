# Database Setup Guide - Choose Your Option

Your AI Agent now supports **3 database options**. Pick the one that works best for you:

## Option 1: Local File-Based Database (⭐ EASIEST - Start Here)

Perfect for **quick testing & development** with zero setup.

### Setup (30 seconds)
```bash
# No setup needed! Just start the server
cd backend
npm run dev
```

### .env Configuration
```
# backend/.env
DB_TYPE=local
```

### Data Location
```
backend/
└── .local-db/
    ├── users.json
    ├── conversations.json
    └── messages.json
```

### Pros ✅
- Zero setup, works immediately
- Perfect for solo development
- No external services needed
- Easy to inspect data (just JSON files)

### Cons ❌
- Data resets when you delete files
- Not suitable for production
- No concurrent access safety

---

## Option 2: Firebase Firestore (🔥 RECOMMENDED - Best Balance)

Perfect for **scalable development** with real-time capabilities.

### Setup (5 minutes)

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Create Project"
   - Name it "ai-agent"

2. **Create Service Account**
   - Settings ⚙️ → Service Accounts
   - Click "Generate New Private Key"
   - Download JSON file

3. **Add to Project**
   ```bash
   # Copy the JSON file to your project
   cp ~/Downloads/firebase-key.json ./backend/
   ```

4. **Configure .env**
   ```
   # backend/.env
   DB_TYPE=firebase
   FIREBASE_KEY_PATH=./firebase-key.json
   ```

### Pros ✅
- Real-time capabilities
- Automatic backups
- Highly scalable
- Free tier available
- Production-ready

### Cons ❌
- Requires Firebase account
- Small learning curve for security rules
- Pay-as-you-go pricing at scale

---

## Option 3: MongoDB (Traditional Database)

Perfect for **traditional database setup** you know and trust.

### Setup (2 options)

#### Option 3A: Local MongoDB
```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB (macOS/Linux)
mongod

# Or Windows
# Run MongoDB from Services

# Configure .env
DB_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/ai-agent
```

#### Option 3B: MongoDB Atlas (Cloud)
```bash
# 1. Create account at https://www.mongodb.com/cloud/atlas
# 2. Create a cluster (free tier available)
# 3. Get connection string
# 4. Configure .env
DB_TYPE=mongodb
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-agent
```

### Pros ✅
- Familiar NoSQL pattern
- Full control if self-hosted
- Mature ecosystem

### Cons ❌
- Requires setup/management
- Hosting complexity if local

---

## Quick Comparison

| Feature | Local | Firebase | MongoDB |
|---------|-------|----------|---------|
| Setup Time | 30 sec | 5 min | 15 min |
| Cost | Free | Free tier | Free/Paid |
| Persistence | Per session | ✅ Persistent | ✅ Persistent |
| Real-time | ❌ No | ✅ Yes | ❌ No |
| Scalability | Limited | ✅ Excellent | Good |
| Best For | Testing | Production | Traditional |

---

## Starting Server with Different Databases

```bash
# 1. Local Database (default)
cd backend
npm run dev

# 2. Firebase
# First: set DB_TYPE=firebase in .env
cd backend
npm run dev

# 3. MongoDB Local
# First: start MongoDB, then:
# Set DB_TYPE=mongodb & MONGODB_URI in .env
cd backend
npm run dev

# 4. MongoDB Atlas
# Set MONGODB_URI=mongodb+srv://... in .env
cd backend
npm run dev
```

---

## Environment Variables Template

```bash
# backend/.env

# Database Type: 'local', 'firebase', or 'mongodb'
DB_TYPE=local

# MongoDB (if using mongodb)
# MONGODB_URI=mongodb://localhost:27017/ai-agent

# Firebase (if using firebase)
# FIREBASE_KEY_PATH=./firebase-key.json
# OR use environment variable approach:
# FIREBASE_KEY='{"type": "service_account", ...}'

# API Configuration
GEMINI_API_KEY=your_gemini_key_here
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

---

## Troubleshooting

### Local Database
- **Data disappears?** Check `.local-db/` folder - files might be deleted
- **Permission denied?** Ensure write permissions in backend folder

### Firebase
- **Connection refused?** Verify firebase-key.json exists and is valid
- **Authentication failed?** Check service account credentials

### MongoDB
- **Connection refused?** Make sure MongoDB is running (`mongod` on macOS/Linux)
- **Authentication failed?** Check connection string and credentials

---

## Next Steps

1. **Choose your database** (local recommended for quick start)
2. **Configure .env**
3. **Start the server**: `npm run dev`
4. **Open frontend**: http://localhost:3000

For detailed setup, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) (Firebase) or MongoDB documentation.
