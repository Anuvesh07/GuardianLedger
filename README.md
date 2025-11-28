# Expense Tracker

Track your spending, understand your habits, and take control of your finances. Built with Next.js and Firebase.

## Why This App?

Most expense trackers are either too complicated or too basic. This one hits the sweet spot - powerful enough to give you real insights, simple enough to actually use every day.

## What Makes It Different

### 💡 Smart Calculator Built-In
No need to pull out your phone's calculator. Just type math directly in the amount field:
- Split a bill? Type `85.50/2` and hit enter
- Multiple items? Type `12.99+8.50+5.75` 
- Bought 3 of something? Type `15.99*3`
- Future : will be adding option to scan the recipt 

It calculates instantly. No extra steps, no switching apps.

### 🌍 Your Currency, Your Way
Choose from 20+ currencies and see everything formatted the way you're used to. Whether you use dollars, euros, rupees, or yen - it just works.

### 📊 Actually Useful Analytics
Not just pretty charts. Get real insights:
- See where your money actually goes
- Compare this month to last month
- Spot spending patterns you didn't know you had
- Get personalized tips based on your habits

### 👥 Learn from Others
Ever wonder how your spending compares? Search for other users and see their expense patterns. It's like having accountability partners for your budget.

### 🌙 Easy on the Eyes
Dark mode that actually looks good. Switch between light and dark themes with one click.

## Features

- **Quick Expense Entry** - Add expenses in seconds with smart categories
- **Multi-Currency Support** - 20+ currencies with proper formatting
- **Smart Search & Filters** - Find any expense instantly
- **Monthly Trends** - See your spending patterns over time
- **Category Breakdown** - Know exactly where your money goes
- **Social Features** - View and learn from other users' spending habits
- **Share Your Profile** - Share your expense journey with one click
- **Responsive Design** - Works perfectly on phone, tablet, or desktop

## Quick Start

### What You Need

- Node.js 18 or newer
- A Firebase account (free tier is fine)

### Get It Running

1. **Clone and install**
```bash
git clone <your-repo-url>
cd expense-tracker
npm install
```

2. **Set up Firebase**

Head to [Firebase Console](https://console.firebase.google.com/) and:
- Create a new project
- Enable Email/Password and Google authentication
- Create a Firestore database
- Grab your config from Project Settings

3. **Add your Firebase config**

Create a `.env` file:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. **Deploy the security rules**
```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

5. **Start it up**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're good to go.

## Using the Smart Calculator

This is probably the coolest feature. When adding or editing an expense:

**Split a restaurant bill:**
```
Amount: 127.50/3
Result: 42.50
```

**Add up multiple items:**
```
Amount: 15.99+8.50+12.75
Result: 37.24
```

**Calculate with tax:**
```
Amount: 50*1.08
Result: 54.00
```

Just type the math and press Enter or Tab. It calculates automatically.

## Tech Stack

Built with modern tools that make development a joy:
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety throughout
- **Firebase** - Authentication and database
- **TailwindCSS** - Styling that doesn't get in the way
- **Radix UI** - Accessible components out of the box
- **Framer Motion** - Smooth animations

## Project Structure

```
├── app/                    # Pages and routes
│   ├── auth/              # Login, signup, etc.
│   ├── dashboard/         # Main app
│   └── user/[username]/   # User profiles
├── components/            # Reusable components
├── contexts/              # Auth, theme, currency
├── lib/                   # Firebase, utilities, types
└── firestore.rules        # Database security
```

## Troubleshooting

**Expenses not showing up?**

Usually means the Firestore rules aren't deployed:
```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

Then hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R).

**Can't sign in?**

Check that your Firebase authorized domains include `localhost` for development and your production domain for deployment.

**Build errors?**

Clear everything and start fresh:
```bash
rm -rf .next node_modules
npm install
npm run build
```

## Deploying

Ready to share it with the world? Check out [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions on deploying to Vercel.

## Contributing

Found a bug? Have an idea? Contributions are welcome! Check out [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - use it however you want. See [LICENSE](LICENSE) for details.

---

Built with ❤️ by developers who actually track their expenses
