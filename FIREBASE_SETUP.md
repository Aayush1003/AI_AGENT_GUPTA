# Firebase Setup Guide

Follow these steps to use Firebase Firestore instead of MongoDB:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project" (or use existing)
3. Give it a name (e.g., "ai-agent")
4. Continue through the setup (disable Google Analytics is fine)

## Step 2: Create a Service Account

1. In Firebase Console, go to **Settings** ⚙️ (top-left)
2. Click **Service Accounts** tab
3. Click **Generate New Private Key**
4. Save the JSON file - this is your `firebase-key.json`

## Step 3: Add to Your Project

### Option A: Using Downloaded JSON file
```bash
# Copy firebase-key.json to backend folder
cp /path/to/firebase-key.json ./backend/firebase-key.json
```

### Option B: Using Environment Variable
1. Open the downloaded JSON file in a text editor
2. Copy the entire content
3. In your `.env` file:
```
DB_TYPE=firebase
FIREBASE_KEY='<paste entire json here>'
```

## Step 4: Update .env

```bash
# backend/.env
DB_TYPE=firebase
GEMINI_API_KEY=your_gemini_key_here
PORT=5000
```

## Step 5: Start the Server

```bash
cd backend
npm run dev
```

You should see:
```
🔥 Using Firebase Firestore
✅ Firebase Firestore connected successfully
🚀 Server running at http://localhost:5000
```

## Switching Between Databases

### To use MongoDB:
```bash
# .env
DB_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/ai-agent
# or just run: npm run dev (will auto-connect to local)
```

### To use Firebase:
```bash
# .env
DB_TYPE=firebase
FIREBASE_KEY=<json-content> # or use firebase-key.json file
```

## File Structure

```
backend/
├── src/
│   └── db/
│       ├── connection.ts          # Handles both DB types
│       ├── firebaseConnection.ts  # Firebase init
│       ├── firebaseModels.ts      # Firebase adapters
│       ├── User.ts                # Mongoose schema (for MongoDB)
│       ├── Conversation.ts        # Mongoose schema (for MongoDB)
│       └── Message.ts             # Mongoose schema (for MongoDB)
└── firebase-key.json              # (Optional) Firebase service account
```

## Firestore Collections

Firebase Firestore auto-creates these collections:

- **users**: User accounts
- **conversations**: Chat sessions
- **messages**: Messages within conversations

## Advantages of Using Firebase:

✅ No local MongoDB needed
✅ Real-time capabilities
✅ Automatic backups
✅ Scalable (pay-as-you-go)
✅ Real-time security rules available

## Best Practices

1. **Never commit firebase-key.json** - Add to .gitignore
2. **Use environment variables** - Store sensitive keys in `.env`
3. **Enable security rules** in Firebase Console for production
