# Phase 2 Testing Guide

## Pre-Testing Checklist

### 1. Environment Setup
- [ ] Create `.env` file in `karya_react/` directory
- [ ] Verify Firebase configuration is correct
- [ ] Verify server URL is correct
- [ ] Check that all dependencies are installed

### 2. Environment Variables Required

Create a `.env` file with the following:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyDZx5QoB_YLcoVBqUdViMkdrKiyQKSqCBE
VITE_FIREBASE_AUTH_DOMAIN=karya-migration.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=karya-migration
VITE_FIREBASE_STORAGE_BUCKET=karya-migration.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=612655557637
VITE_FIREBASE_APP_ID=1:612655557637:web:8f992c273a09be078e806c

# Server Configuration
VITE_SERVER_URL=http://localhost:5001

# Environment
VITE_USE_EMULATORS=false
```

## Testing Steps

### Step 1: Start the Development Server

```bash
cd karya_react
npm run dev
```

Expected: Server should start on `http://localhost:3000`

### Step 2: Test Unauthenticated Access

1. Open browser to `http://localhost:3000`
2. **Expected**: Should redirect to `/login`
3. **Expected**: Login page should display with email and password fields
4. **Expected**: No console errors

### Step 3: Test Login Page

1. Navigate directly to `http://localhost:3000/login`
2. **Expected**: Login form should be visible
3. **Expected**: Form validation should work:
   - Try submitting empty form → Should show error messages
   - Enter email only → Should show password required
   - Enter password only → Should show email required

### Step 4: Test Invalid Login

1. Enter invalid credentials (e.g., `test@test.com` / `wrongpassword`)
2. Click "Login" button
3. **Expected**: 
   - Button should show "Logging in..." state
   - Error toast notification should appear
   - Error message should be displayed
   - Form should remain on login page

### Step 5: Test Valid Login (Admin User)

1. Enter valid admin credentials
2. Click "Login" button
3. **Expected**:
   - Button should show loading state
   - Success toast notification should appear
   - Should redirect to `/` (home page)
   - Should see HomePage component

### Step 6: Test Valid Login (Non-Admin User)

1. Enter valid non-admin credentials
2. Click "Login" button
3. **Expected**:
   - Should attempt login
   - Error toast: "This account is not allowed to access the admin portal"
   - Should logout and reload page
   - Should return to login page

### Step 7: Test Protected Routes (After Login)

1. After successful admin login, try accessing:
   - `http://localhost:3000/` → Should work
   - `http://localhost:3000/dashboard` → Should work (if route exists)
   - `http://localhost:3000/users` → Should work (if route exists)

2. **Expected**: All protected routes should be accessible

### Step 8: Test Route Protection

1. Open a new incognito/private window
2. Try accessing `http://localhost:3000/` directly
3. **Expected**: Should redirect to `/login`

### Step 9: Test Onboarding Flow

1. If you have a user without username/details:
   - Login with that user
   - **Expected**: Should redirect to `/onboarding`

### Step 10: Test Restricted Route

1. Login as non-admin user (if available)
2. **Expected**: Should redirect to `/restricted`
3. **Expected**: Should see "Restricted Access" message

### Step 11: Test Toast Notifications

1. Trigger various actions:
   - Successful login → Success toast
   - Failed login → Error toast
   - Invalid credentials → Error toast
2. **Expected**: 
   - Toasts appear in top-right corner
   - Auto-dismiss after 3 seconds
   - Can be manually closed
   - Multiple toasts stack properly

### Step 12: Test Navigation

1. After login, check browser console
2. **Expected**: No errors related to:
   - Firebase initialization
   - Route navigation
   - Auth state changes

### Step 13: Test Logout (If Implemented)

1. If logout functionality exists, test it
2. **Expected**: Should logout and redirect to login

## Common Issues & Solutions

### Issue: "Firebase: Error (auth/invalid-api-key)"
**Solution**: Check `.env` file has correct Firebase API key

### Issue: "Cannot find module 'react-toastify'"
**Solution**: Run `npm install` in `karya_react` directory

### Issue: "Failed to fetch user details"
**Solution**: 
- Check `VITE_SERVER_URL` in `.env`
- Verify backend server is running on port 5001
- Check browser console for API errors

### Issue: "Redirect loop"
**Solution**: 
- Check ProtectedRoute logic
- Verify user details are being fetched correctly
- Check browser console for errors

### Issue: "Toast notifications not appearing"
**Solution**:
- Verify `ToastContainer` is in `App.tsx`
- Check `react-toastify` CSS is imported
- Check browser console for errors

## Browser Console Checks

Open browser DevTools (F12) and check:

1. **No Firebase Errors**: 
   - Should see Firebase initialized successfully
   - No auth errors

2. **No Route Errors**:
   - No React Router warnings
   - Routes resolve correctly

3. **No API Errors** (after login):
   - Check Network tab for API calls
   - Verify Authorization header is present
   - Check response status codes

4. **No React Errors**:
   - No component errors
   - No hook errors
   - No state management errors

## Manual Test Cases

### Test Case 1: Unauthenticated User Flow
```
1. Navigate to http://localhost:3000
2. Expected: Redirect to /login
3. Expected: Login form visible
```

### Test Case 2: Login Validation
```
1. Click Login without entering credentials
2. Expected: Error messages appear
3. Enter only email
4. Expected: Password required error
5. Enter only password
6. Expected: Email required error
```

### Test Case 3: Invalid Credentials
```
1. Enter invalid email/password
2. Click Login
3. Expected: Error toast appears
4. Expected: Stay on login page
```

### Test Case 4: Valid Admin Login
```
1. Enter valid admin credentials
2. Click Login
3. Expected: Loading state on button
4. Expected: Success toast
5. Expected: Redirect to home page
6. Expected: User details loaded
```

### Test Case 5: Protected Route Access
```
1. Login as admin
2. Navigate to protected route
3. Expected: Route accessible
4. Open new incognito window
5. Navigate to same route
6. Expected: Redirect to login
```

### Test Case 6: Non-Admin User
```
1. Login as non-admin user
2. Expected: Error toast about admin access
3. Expected: Logout and reload
4. Expected: Return to login page
```

## Automated Testing (Optional)

You can also run the test suite:

```bash
cd karya_react
npm test
```

## Success Criteria

Phase 2 is successful if:

✅ Login page displays correctly
✅ Form validation works
✅ Invalid login shows error toast
✅ Valid admin login redirects to home
✅ Non-admin users are blocked
✅ Protected routes require authentication
✅ Toast notifications work correctly
✅ No console errors
✅ Firebase authentication works
✅ User details are fetched after login

## Next Steps After Testing

If all tests pass:
- Proceed to Phase 3 (Layout & Navigation)

If issues are found:
- Document issues
- Fix critical bugs
- Re-test affected areas

## Debugging Tips

1. **Check Network Tab**: Verify API calls are being made
2. **Check Application Tab**: Verify Firebase auth state
3. **Check Console**: Look for errors or warnings
4. **Check Redux/Zustand DevTools**: Verify state updates
5. **Use React DevTools**: Inspect component state

## Test Data

You'll need:
- Valid admin user credentials
- Valid non-admin user credentials (optional)
- Invalid test credentials

**Note**: Use test credentials from your Firebase project or backend.


