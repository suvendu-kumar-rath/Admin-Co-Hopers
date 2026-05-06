# Quick Implementation Guide - Real-Time Sync for Admin Components

## 🚀 How to Add Real-Time Sync to Any Admin Component

### Step 1: Import the Manager
```javascript
import { realtimeSyncManager } from '../utils/realtimeSync';
```

### Step 2: Set Up Polling in useEffect
```javascript
useEffect(() => {
  // Start real-time synchronization
  const unsubscribe = realtimeSyncManager.startPolling(
    'unique-data-key',      // Must be unique per component
    fetchYourData,          // Your async fetch function
    5000,                   // Poll every 5 seconds (adjustable)
    (newData) => {
      // Callback when data changes
      setYourData(newData);
      console.log('Data updated from polling');
    }
  );
  
  // Initial fetch
  fetchYourData();
  
  // Subscribe to manual updates
  const dataUnsubscribe = realtimeSyncManager.subscribe('unique-data-key', (data) => {
    setYourData(data);
    console.log('Real-time update received');
  });
  
  // Cleanup on unmount
  return () => {
    unsubscribe();
    dataUnsubscribe();
    realtimeSyncManager.stopPolling('unique-data-key');
  };
}, []);
```

### Step 3: Update Your Fetch Function
Make sure it returns data:
```javascript
const fetchYourData = async () => {
  try {
    const response = await api.fetchData();
    const data = response.data || [];
    setYourData(data);
    return data; // Important: return the data for polling
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};
```

### Step 4: Notify Other Devices After Actions
```javascript
const handleApproveAction = async (id) => {
  try {
    await api.approve(id);
    
    // Update local state
    setYourData(prevData => 
      prevData.map(item => 
        item.id === id ? { ...item, status: 'Approved' } : item
      )
    );
    
    // Notify other devices
    realtimeSyncManager.triggerUpdate('unique-data-key', yourData);
    
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 📋 Complete Example

```javascript
import React, { useState, useEffect } from 'react';
import { realtimeSyncManager } from '../utils/realtimeSync';
import { requestsApi } from '../api';

const RequestsAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch function
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestsApi.getAll();
      const data = response.data || [];
      setRequests(data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Setup real-time sync
  useEffect(() => {
    const unsubscribe = realtimeSyncManager.startPolling(
      'admin-requests',
      fetchRequests,
      5000,
      (newData) => setRequests(newData)
    );

    const dataUnsubscribe = realtimeSyncManager.subscribe('admin-requests', (data) => {
      setRequests(data);
    });

    fetchRequests();

    return () => {
      unsubscribe();
      dataUnsubscribe();
      realtimeSyncManager.stopPolling('admin-requests');
    };
  }, []);

  // Action handler
  const handleApprove = async (requestId) => {
    try {
      await requestsApi.approve(requestId);
      
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: 'Approved' } : req
        )
      );
      
      // Notify other devices
      realtimeSyncManager.triggerUpdate('admin-requests', requests);
      
    } catch (error) {
      console.error('Approve error:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Admin Requests</h2>
      {requests.map(req => (
        <div key={req.id}>
          <h3>{req.title}</h3>
          <button onClick={() => handleApprove(req.id)}>
            Approve
          </button>
        </div>
      ))}
    </div>
  );
};

export default RequestsAdmin;
```

---

## 🔑 Key Configuration Values

| Parameter | Default | Range | Purpose |
|-----------|---------|-------|---------|
| `pollInterval` | 5000ms | 1000-60000 | How often to fetch fresh data |
| `dataKey` | N/A | String | Unique identifier for this data stream |

---

## 🐛 Common Issues & Solutions

### Issue: Data not updating
**Solution**: Make sure your fetch function returns the data
```javascript
// ❌ Wrong
const fetchData = async () => {
  const response = await api.get();
  setData(response.data);
  // Missing return!
};

// ✅ Correct
const fetchData = async () => {
  const response = await api.get();
  setData(response.data);
  return response.data; // Return the data
};
```

### Issue: Memory leak warning
**Solution**: Always cleanup in useEffect return
```javascript
useEffect(() => {
  const unsubscribe = realtimeSyncManager.startPolling(...);
  const dataUnsubscribe = realtimeSyncManager.subscribe(...);
  
  return () => {
    unsubscribe();          // Required
    dataUnsubscribe();      // Required
  };
}, []);
```

### Issue: Multiple rapid updates
**Solution**: Increase poll interval to reduce API calls
```javascript
// Poll every 10 seconds instead of 5
realtimeSyncManager.startPolling('key', fetchFn, 10000, callback);
```

---

## 📊 Best Practices

1. **Unique Data Keys**: Use descriptive keys
   ```javascript
   'kyc-approval-pending'      // ✅ Good
   'data1'                     // ❌ Bad
   ```

2. **Error Handling**: Always handle fetch errors
   ```javascript
   try {
     const data = await fetch();
     return data;
   } catch (error) {
     console.error('Fetch failed:', error);
     return []; // Return empty array on error
   }
   ```

3. **Performance**: Adjust poll interval based on needs
   - High priority data: 3000ms
   - Medium priority: 5000ms
   - Low priority: 10000ms

4. **Testing**: Test with multiple browser tabs/windows

---

## 🎯 Implementation Checklist

- [ ] Imported `realtimeSyncManager`
- [ ] Created unique data key
- [ ] Setup useEffect with polling
- [ ] Fetch function returns data
- [ ] Cleanup function properly implemented
- [ ] Action handlers trigger `triggerUpdate()`
- [ ] Tested with multiple devices/tabs
- [ ] Verified no console errors
- [ ] Console logs show polling working

---

## 🆘 Support

For issues or questions:
1. Check browser console for error messages (look for 🔄, 📱, ✅ emojis)
2. Verify fetch function is working
3. Check that data key is unique
4. Ensure cleanup functions are called

Visit the main documentation: `REALTIME_SYNC_FIX.md`
