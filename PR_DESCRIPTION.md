## 🔧 Fixes Google OAuth Callback Issues

This PR fixes two critical issues preventing Google OAuth from working correctly:

### 🐛 Problems Fixed:

1. **Missing /GoogleCallback route** - Backend redirects to /GoogleCallback but frontend only had /auth/google/callback
2. **Incorrect admin verification** - Frontend was checking user.role but backend uses user.user_type

### 📝 Changes Made:

#### 1. Added /GoogleCallback Route (src/pages/index.jsx)
- Added route to match backend redirect URL
- Now both /auth/google/callback and /GoogleCallback work

#### 2. Fixed Admin Verification (src/pages/GoogleCallback.jsx)
- Changed from user.role to user.user_type
- Backend model uses user_type where 1 = admin
- This fixes the 401 Unauthorized errors

### 🔍 Root Causes:

**Error 1: No routes matched location**
- Backend was redirecting to: https://www.joltcab.com/GoogleCallback?token=...
- Frontend only had route: /auth/google/callback
- Result: Page showed empty with header/footer only

**Error 2: 401 Unauthorized on /api/v1/auth/me**
- Frontend checked: user.role
- Backend returns: user.user_type = 1 (for admin)
- Result: Token was valid but verification failed

### ✅ Expected Behavior After Fix:

1. User clicks Sign in with Google
2. Google authenticates user
3. Backend redirects to: /GoogleCallback?token=...
4. Frontend matches route and loads GoogleCallback component
5. Component extracts token from URL
6. Token saved to localStorage
7. API call to /auth/me succeeds (user_type = 1 verified)
8. User redirected to /AdminPanel

### 🧪 Testing:

After merging and deploying:
1. Go to https://www.joltcab.com
2. Click Sign in with Google
3. Authenticate with Google
4. Should redirect to AdminPanel successfully
5. No more 401 errors or empty pages

### 📋 Related:

- Backend PR: https://github.com/joltcab/backend/pull/1
- Both PRs needed for complete fix