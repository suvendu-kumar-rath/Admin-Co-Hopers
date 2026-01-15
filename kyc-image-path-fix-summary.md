# KYC Image Path Fix Summary

## Problem
KYC images were not displaying because the backend was returning full server paths like:
```
/home/ubuntu/cohopers.backend/uploads/kyc/1767685324514-889403130.png
```

The frontend cannot access files using the server's absolute file system path. It needs a URL that the web server exposes, like:
```
https://api.boldtribe.in/uploads/kyc/1767685324514-889403130.png
```

## Solution
Created a utility function to sanitize image paths from the backend by:
1. Removing the server root path prefix (`/home/ubuntu/cohopers.backend`)
2. Formatting the path as a proper URL with the base API URL

## Changes Made

### 1. Created Utility File
**File:** `src/utils/imagePath.js`

This file contains two utility functions:
- `sanitizeImagePath(path)` - Removes the server root path prefix
- `formatDocumentUrl(path, baseUrl)` - Sanitizes the path and formats it as a complete URL

### 2. Updated Components

#### KycApproval.jsx
- Imported `formatDocumentUrl` from the utility
- Replaced the local `formatDocumentUrl` function with the imported utility
- All document links now automatically sanitize paths

#### Active members.jsx
- Imported `formatDocumentUrl` from the utility
- Updated all KYC document links to use the utility function:
  - ID Front
  - ID Back
  - PAN
  - Photo
  - Payment Screenshot
  - Company PAN
  - Certificate of Incorporation
  - Director PAN
  - Director Photo
  - Director ID Front
  - Director ID Back
  - Director Payment Proof

## How It Works

### Before (Not Working)
```javascript
// Backend returns: /home/ubuntu/cohopers.backend/uploads/kyc/image.png
<a href={`https://api.boldtribe.in${kyc.idFront}`}>View</a>
// Results in: https://api.boldtribe.in/home/ubuntu/cohopers.backend/uploads/kyc/image.png ❌
```

### After (Working)
```javascript
// Backend returns: /home/ubuntu/cohopers.backend/uploads/kyc/image.png
<a href={formatDocumentUrl(kyc.idFront)}>View</a>
// Results in: https://api.boldtribe.in/uploads/kyc/image.png ✅
```

## Usage

To use the utility in other components:
```javascript
import { formatDocumentUrl, sanitizeImagePath } from '../utils/imagePath';

// For complete URLs
const imageUrl = formatDocumentUrl(imagePath);

// For just removing the server path
const cleanPath = sanitizeImagePath(imagePath);
```

## Testing
After these changes:
1. Navigate to Active Members, Past Members, or KYC Approval
2. Click on "KYC Details" for any member
3. All document/image links should now display properly
4. Images that previously showed "not found" errors should now load correctly

## Notes
- The utility automatically detects if a path already starts with `http://` or `https://` and returns it as-is
- The default base URL is `https://api.boldtribe.in` but can be customized if needed
- The function is null-safe and returns `null` if the input path is null or undefined
