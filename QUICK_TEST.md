# Quick Phase 2 Test Guide

## Quick Start

1. **Ensure .env file exists** (✅ Already exists)
2. **Start the dev server**:
   ```bash
   cd karya_react
   npm run dev
   ```
3. **Open browser**: `http://localhost:3000`

## Quick Test Checklist

### ✅ Basic Functionality
- [ ] Server starts without errors
- [ ] Login page loads at `/login`
- [ ] Form fields are visible
- [ ] No console errors on page load

### ✅ Authentication Flow
- [ ] Empty form submission shows validation errors
- [ ] Invalid credentials show error toast
- [ ] Valid admin login redirects to home
- [ ] Protected routes redirect to login when not authenticated

### ✅ Toast Notifications
- [ ] Success toast appears on successful login
- [ ] Error toast appears on failed login
- [ ] Toasts auto-dismiss after 3 seconds

## Expected Behavior

### When Not Logged In:
- Any route → Redirects to `/login`
- Login page shows form

### When Logged In (Admin):
- `/login` → Redirects to `/`
- `/` → Shows HomePage
- Protected routes → Accessible

### When Logged In (Non-Admin):
- Login attempt → Error toast
- Auto logout and reload
- Returns to login page

## Common Issues

**Issue**: "Firebase: Error (auth/invalid-api-key)"
- **Fix**: Check `.env` file has correct Firebase config

**Issue**: "Failed to fetch user details"
- **Fix**: Ensure backend server is running on port 5001

**Issue**: "Cannot find module"
- **Fix**: Run `npm install` in `karya_react` directory

## Test Credentials

Use your Firebase project test credentials:
- Admin user email/password
- Non-admin user email/password (optional)

## Next Steps

If all tests pass → Proceed to Phase 3
If issues found → Check `TESTING_PHASE2.md` for detailed troubleshooting


