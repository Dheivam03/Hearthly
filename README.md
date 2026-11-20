# Hearthly 🌿
No build step. ES modules need http(s), so serve the folder:
- `python -m http.server 8000` then open http://localhost:8000  (or VS Code "Live Server")
- Or deploy free: `firebase init hosting` → `firebase deploy` (gives HTTPS for phone install + notifications)

## Firebase setup (console)
1. Build → Authentication → Sign-in method → enable **Google**
2. Build → Firestore Database → create → paste `firestore.rules` in Rules tab → Publish
3. Auth → Settings → Authorized domains: add your hosting domain (localhost is already allowed)

## Notes
- Data lives at `users/{uid}/{items,meals,plans,expenses,logs,settings}`; Google sign-in keeps phone + laptop in sync.
- Expiry alerts (2 days / 1 day / expired) fire as notifications whenever the app is open or running in the background.
  Alerts while the app is fully closed need server push (FCM + a scheduled Cloud Function, Blaze plan).
