# 🚨 500 Error Debug Guide

## Current Status: 500 Internal Server Error on POST /spaces/spaces

### 🔍 **What I've Added to Debug:**

#### 1. **Enhanced API with Multiple Approaches**
- **JSON payload** (tries first) - simpler data format
- **FormData payload** (fallback) - original multipart approach
- **Detailed logging** for both success and failure cases

#### 2. **API Tester Component** 
- **Visual debugging tool** added to Inventory page
- **Multiple test scenarios** to isolate the issue
- **Real-time results** showing exactly what fails

#### 3. **Comprehensive Logging**
- **Input data logging** - shows what you're trying to send
- **FormData entries** - shows exact multipart data
- **Error response details** - shows server error messages

### 🧪 **How to Use the Debug Tools:**

#### **Step 1: Open Inventory Page**
1. Go to your Inventory page
2. You'll see an orange "Debug 500 Error" accordion at the top
3. Click to expand it

#### **Step 2: Run Tests in Order**
1. **Test Endpoint Check** - Verifies the endpoint exists
2. **Test Fetch Spaces** - Checks if GET works (should work)
3. **Test Minimal Create** - Tries creating with minimal data
4. **Test Full Create** - Tries with complete data structure

#### **Step 3: Check Console Logs**
Open browser console (F12) and look for:
```
Creating space with data: {...}
JSON payload: {...}
✅ JSON approach successful: {...}
OR
JSON approach failed, trying FormData...
FormData entries: space_name: Test Room...
```

### 📊 **Common 500 Error Scenarios & Solutions:**

#### **Scenario 1: Field Name Mismatch**
```
Server expects: "name" 
We send: "space_name"
Solution: Update field names in API
```

#### **Scenario 2: Data Type Issues**
```
Server expects: seater as integer
We send: seater as string "4"
Solution: Parse to integer (already implemented)
```

#### **Scenario 3: Missing Required Fields**
```
Server requires: description, location
We don't send: these fields
Solution: Add required fields
```

#### **Scenario 4: Authentication Issues**
```
Token expired or invalid format
Solution: Check token in localStorage
```

### 🔧 **What Each Test Does:**

| Test | Purpose | Expected Result |
|------|---------|-----------------|
| Endpoint Check | Verifies /spaces/spaces exists | GET should return 200 |
| Fetch Spaces | Tests if endpoint works at all | Should return existing data |
| Minimal Create | Tests with basic required fields | Identifies minimum working data |
| Full Create | Tests complete data structure | Shows which extra fields break it |

### 🎯 **Next Steps Based on Results:**

#### **If Endpoint Check Fails:**
- API endpoint doesn't exist
- Check if it should be `/api/spaces` instead
- Verify backend server is running

#### **If Fetch Spaces Works but Create Fails:**
- GET works, POST has issues
- Check required fields on server side
- Verify POST method is allowed

#### **If Minimal Create Works but Full Create Fails:**
- Extra fields are causing issues
- Remove problematic fields one by one
- Check server validation rules

#### **If All Tests Fail:**
- Authentication issue
- Server completely down
- Wrong API base URL

### 📝 **Current API Attempts:**

**Approach 1 (JSON):**
```json
POST /spaces/spaces
Content-Type: application/json
{
  "space_name": "Meeting Room A",
  "seater": 8,
  "price": 1500,
  "availability": "AVAILABLE"
}
```

**Approach 2 (FormData):**
```
POST /spaces/spaces
Content-Type: multipart/form-data
space_name: Meeting Room A
seater: 8
price: 1500
availability: AVAILABLE
```

### 🚀 **Quick Fix Attempts:**

Run these in browser console:
```javascript
// Test 1: Check authentication
console.log('Token:', localStorage.getItem('authToken'));

// Test 2: Test endpoint directly
fetch('https://api.boldtribe.in/api/spaces/spaces', {
  method: 'GET',
  headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
}).then(r => console.log('GET status:', r.status));

// Test 3: Minimal POST test
fetch('https://api.boldtribe.in/api/spaces/spaces', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('authToken')}`
  },
  body: JSON.stringify({ space_name: 'Test', seater: 1, price: 100 })
}).then(r => r.text()).then(console.log);
```

### 🎉 **Success Indicators:**

✅ **Fixed when you see:**
- "JSON approach successful" in console
- Test results show green checkmarks
- No more 500 errors in Network tab
- Data appears in table after form submission

The debug tools will help identify the exact cause! 🔍