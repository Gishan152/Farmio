# Farmer Waste Requests - Quick Start Guide

## 🎯 What Changed?

Farmers now have a **Waste Requests** feature identical to the warehouse owner's waste request management system!

## 📍 Where to Find It?

### Navigation Path
```
Farmer Dashboard → Sidebar → Waste Management → Waste Requests
```

### URL
```
http://localhost:5173/farmer/waste-requests
```

### Before vs After

**BEFORE** (Single menu item):
```
♻️ Waste Management  →  /farmer/wastemanagement
```

**AFTER** (Submenu with two options):
```
♻️ Waste Management
   ├── 👥 Waste Agents        →  /farmer/wastemanagement
   └── 📋 Waste Requests      →  /farmer/waste-requests  ⭐ NEW!
```

## 🚀 Quick Test

### 1. Access the Feature
1. Start frontend: `npm run dev` (in frontend folder)
2. Login as a farmer
3. Click **Waste Management** in sidebar
4. Click **Waste Requests** (new option)

### 2. Create Your First Request
1. Click green **"Create New Request"** button
2. Fill in the form:
   - **Location**: Select your district (e.g., "Colombo")
   - **Waste Type**: Choose from dropdown or select "Other"
   - **Quantity**: Enter amount (e.g., 100)
   - **Unit**: Select "kg"
   - **Pickup Date**: Choose a future date
   - **Description**: Optional details
   - **Price**: Optional price per unit
3. Click **"Create Request"**
4. ✅ Success toast appears
5. ✅ New request appears in table with **Pending** status

### 3. View Request Details
1. Find your request in the table
2. Click the **⋮** (three dots) menu
3. Select **"View Details"**
4. See complete request information
5. Close modal with X or click outside

### 4. Test Filters
1. **Filter by Waste Type**: Type in the search box
2. **Filter by Location**: Use the location dropdown
3. **Filter by Status**: Select status from dropdown
4. All three filters work together!

### 5. Status Updates (requires agent interaction)
- **Pending** → Agent hasn't accepted yet (Yellow)
- **Accepted** → Agent accepted request (Green ✅)
- **In Progress** → Agent collecting waste (Blue 🔄 spinning)
- **Completed** → Collection finished (Purple ✅)
- **Payment Pending** → Payment initiated (Orange 💲)
- **Paid** → Payment confirmed (Emerald 💵)

## 🎨 UI Features

### Table View
```
┌───────────────────────────────────────────────────────────────────────────┐
│  ID  │  Details      │  Location  │  Quantity  │  Pricing  │  Status     │
├───────────────────────────────────────────────────────────────────────────┤
│  1   │  Organic      │  Colombo   │  50 kg     │  Rs. 500  │  🟢 Accepted│
│  2   │  Plastic      │  Kandy     │  25 kg     │  Rs. 125  │  🟡 Pending │
│  3   │  Metal        │  Galle     │  100 kg    │  Rs. 1000 │  🔵 In Prog │
└───────────────────────────────────────────────────────────────────────────┘
```

### Status Color Guide
- 🟡 **Pending** - Yellow badge
- 🟢 **Accepted** - Green badge with checkmark
- 🔵 **In Progress** - Blue badge with spinning icon
- 🟣 **Completed** - Purple badge with checkmark
- 🟠 **Payment Pending** - Orange badge with dollar sign
- 💚 **Paid** - Emerald badge with banknote icon
- 🔴 **Rejected** - Red badge with X

### Filters
```
┌─────────────────────────────────────────────────────────────┐
│  🔍 Waste Type: [_______________]                           │
│  📍 Location:   [Select District ▼]                         │
│  📊 Status:     [All Statuses ▼]                            │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Technical Details

### Files Created/Modified

✅ **Created**:
- `frontend/src/Pages/Farmer/Sections/FarmerWasteRequest.jsx` (979 lines)

✅ **Modified**:
- `frontend/src/Routes/FarmerRoutes.js` (added route + import)
- `frontend/src/Pages/Farmer/Sidebar/Sidebar.jsx` (updated menu structure)

### Route Configuration
```javascript
// FarmerRoutes.js
{
    path: 'waste-requests',
    Component: FarmerWasteRequest
}
```

### API Endpoints
All endpoints work with farmer authentication:
- `GET /api/waste/requests/my-requests` - Get farmer's requests
- `POST /api/waste/requests` - Create new request
- `DELETE /api/waste/requests/{id}` - Cancel request

## ✅ Features Checklist

### Create & Manage
- ✅ Create waste collection requests
- ✅ View all your requests
- ✅ Filter by waste type, location, status
- ✅ View detailed request information
- ✅ Cancel pending requests

### Status Tracking
- ✅ Real-time status updates
- ✅ Color-coded badges
- ✅ Animated icons for active states
- ✅ Agent information display

### UI/UX
- ✅ Professional table layout
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Animated price displays
- ✅ Searchable location dropdown
- ✅ Skeleton loading states

## 🐛 Troubleshooting

### Issue: Can't see "Waste Requests" option
**Solution**: 
- Clear browser cache
- Refresh page (Ctrl+F5)
- Check if logged in as farmer (not warehouse owner)

### Issue: "Create Request" fails
**Solution**:
- Check all required fields are filled
- Ensure pickup date is in the future
- Verify quantity is a positive number
- Check network tab for API errors

### Issue: Status not updating
**Solution**:
- Refresh the page
- Check if agent actually updated the listing
- Verify backend status sync is working
- See `TESTING_STATUS_SYNC.md` for detailed debugging

### Issue: Filters not working
**Solution**:
- Try clearing filters (set all to default)
- Check if requests exist matching filter criteria
- Refresh page

## 📞 Need Help?

### Documentation
- **Full Feature Docs**: `docs/FARMER_WASTE_REQUESTS_FEATURE.md`
- **Status Sync Guide**: `backend/waste-service/REQUEST_STATUS_SYNC_IMPLEMENTATION.md`
- **Testing Guide**: `docs/TESTING_STATUS_SYNC.md`

### Common Questions

**Q: Is this the same as warehouse waste requests?**
A: Yes! It's the exact same functionality, just for farmers.

**Q: Can I edit a request after creating it?**
A: Not yet - currently you can only cancel pending requests. Edit functionality coming soon.

**Q: Why don't I see agent information?**
A: Agent info only appears after the request is accepted by a waste agent.

**Q: How do I know when payment is complete?**
A: The status will change to "Paid" (emerald green) with a banknote icon.

**Q: Can I create recurring requests?**
A: Not yet - each request must be created individually. Recurring requests are a planned feature.

## 🎓 Best Practices

### Creating Effective Requests
1. **Be Specific**: Choose accurate waste type
2. **Add Details**: Use description field for special instructions
3. **Set Realistic Pickup**: Give agents adequate time
4. **Fair Pricing**: Research market rates for your waste type
5. **Location Accuracy**: Select correct district

### Managing Requests
1. **Regular Monitoring**: Check status updates daily
2. **Quick Response**: Cancel unwanted requests promptly
3. **Use Filters**: Organize requests by status
4. **Track Payments**: Monitor payment status closely

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Menu has "Waste Management" with two subitems
- ✅ Clicking "Waste Requests" shows the table page
- ✅ "Create New Request" button appears (green, top-right)
- ✅ Form validation works (required fields, date restrictions)
- ✅ New requests appear in table immediately
- ✅ Status badges have correct colors
- ✅ "In Progress" icon spins
- ✅ Filters reduce visible requests
- ✅ Toast notifications appear on actions

## 📊 Expected Behavior

### Lifecycle Example
```
Day 1, 9:00 AM  → Farmer creates request (Pending)
Day 1, 10:30 AM → Agent accepts (Accepted) ✅
Day 2, 8:00 AM  → Agent starts collection (In Progress) 🔄
Day 2, 11:00 AM → Agent completes (Completed) ✅
Day 2, 2:00 PM  → Agent initiates payment (Payment Pending) 💲
Day 3, 9:00 AM  → Payment confirmed (Paid) 💵
```

## 🚦 Status Flow Diagram

```
┌─────────┐
│ Pending │ 🟡
└────┬────┘
     │
     ├─── Rejected 🔴 (Agent declines)
     │
     ↓
┌──────────┐
│ Accepted │ 🟢 (Agent accepts)
└────┬─────┘
     ↓
┌─────────────┐
│ In Progress │ 🔵 (Agent collecting)
└──────┬──────┘
       ↓
┌───────────┐
│ Completed │ 🟣 (Collection done)
└─────┬─────┘
      ↓
┌─────────────────┐
│ Payment Pending │ 🟠 (Payment initiated)
└────────┬────────┘
         ↓
┌──────┐
│ Paid │ 💚 (Transaction complete)
└──────┘
```

## 🎯 Next Steps

1. **Test the feature** thoroughly
2. **Coordinate with team** on any refinements needed
3. **Review documentation** for implementation details
4. **Plan enhancements** (edit, recurring requests, analytics)
5. **Gather user feedback** from farmers

---

**Ready to Go!** 🚀

The feature is fully implemented and ready to use. Just navigate to **Waste Management → Waste Requests** in the farmer dashboard and start creating waste collection requests!
