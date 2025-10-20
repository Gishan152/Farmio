# Unit Selector Feature - Waste Request

## Overview
Added a unit selector to the Waste Request form, allowing users to specify the measurement unit for their waste quantity.

## Available Units

| Unit | Label | Common Use Case |
|------|-------|-----------------|
| **kg** | Kilograms (kg) | Default unit, most common for waste |
| **ton** | Tons (ton) | Large quantities of waste |
| **lbs** | Pounds (lbs) | Alternative measurement system |
| **quintal** | Quintals (quintal) | Agricultural waste (100 kg) |

## Implementation Details

### 1. Form State
```javascript
const [formData, setFormData] = useState({
    // ... other fields
    quantity: '',      // Numeric value only
    unit: 'kg',       // Default unit
    // ... other fields
});
```

### 2. Units Configuration
```javascript
const units = [
    { value: "kg", label: "Kilograms (kg)" },
    { value: "ton", label: "Tons (ton)" },
    { value: "lbs", label: "Pounds (lbs)" },
    { value: "quintal", label: "Quintals (quintal)" },
];
```

### 3. UI Layout
The quantity field is split into a 3-column grid:
- **Column 1-2**: Numeric quantity input (type="number")
- **Column 3**: Unit selector (shadcn/ui Select dropdown)

```jsx
<div className="grid grid-cols-3 gap-4">
    <div className="col-span-2">
        <Input type="number" /> // Quantity
    </div>
    <div>
        <Select /> // Unit
    </div>
</div>
```

### 4. Auto-calculation
The total offer calculation works with the numeric quantity value:

**Formula**: `Total Offer = Quantity (numeric) × Price per Unit`

Example:
- Quantity: 280
- Unit: kg
- Price per kg: Rs 25.00
- Total Offer: Rs 7,000.00

### 5. Data Submission
When submitting the request, quantity and unit are combined:

```javascript
quantity: `${formData.quantity.replace(/[^0-9.]/g, '')} ${formData.unit}`
// Result: "280 kg" or "2 ton"
```

### 6. Dynamic Label
The price field label changes based on selected unit:
- If unit = "kg" → "Price per kg (Rs) *"
- If unit = "ton" → "Price per ton (Rs) *"
- If unit = "lbs" → "Price per lbs (Rs) *"
- If unit = "quintal" → "Price per quintal (Rs) *"

## User Experience Flow

1. User enters **numeric quantity** (e.g., 280)
2. User selects **unit** from dropdown (e.g., kg)
3. System displays **"Price per kg (Rs)"** label
4. User enters **price per unit** (e.g., 25.00)
5. System **auto-calculates** total: 280 × 25 = Rs 7,000.00
6. On submit, backend receives: `"280 kg"`

## Validation

### Quantity Validation
```javascript
if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
    errors.quantity = 'Valid quantity is required';
}
```

**Rules**:
- Must be a number
- Must be greater than 0
- Decimal values allowed (e.g., 2.5)

### Unit Validation
- Unit is always set (defaults to 'kg')
- No validation needed as it's a controlled dropdown

## Benefits

✅ **Flexibility**: Users can choose their preferred measurement unit
✅ **Clarity**: Clear separation between numeric value and unit
✅ **Accuracy**: Auto-calculation works with pure numeric values
✅ **User-Friendly**: Common units for agricultural/industrial waste
✅ **Consistency**: Follows the same pattern as WasteListings
✅ **International**: Supports multiple measurement systems

## Example Usage Scenarios

### Scenario 1: Small Organic Waste
- Quantity: 280
- Unit: kg
- Price: Rs 25/kg
- Total: Rs 7,000

### Scenario 2: Large Farm Waste
- Quantity: 5
- Unit: ton
- Price: Rs 5,000/ton
- Total: Rs 25,000

### Scenario 3: Recyclable Materials
- Quantity: 150
- Unit: quintal
- Price: Rs 100/quintal
- Total: Rs 15,000

### Scenario 4: Alternative System
- Quantity: 500
- Unit: lbs
- Price: Rs 10/lbs
- Total: Rs 5,000

## Backend Compatibility

The backend receives the quantity as a string in format: `"{number} {unit}"`

Examples:
- `"280 kg"`
- `"5 ton"`
- `"150 quintal"`
- `"500 lbs"`

This matches the existing backend format which already handles quantity strings like "280 kg".

## Future Enhancements

1. **Unit Conversion**: Add helper text showing quantity in other units
   - Example: "280 kg = 0.28 tons"

2. **Smart Defaults**: Auto-suggest unit based on waste type
   - Organic Waste → kg
   - Industrial Waste → ton

3. **Custom Units**: Allow users to add custom units

4. **Price Suggestions**: Show average price per unit for selected waste type

5. **Validation Rules**: Add min/max limits per unit type
   - kg: 1-10,000
   - ton: 0.1-100

6. **Unit Grouping**: Categorize units (Metric, Imperial, Agricultural)

## Testing Checklist

- [ ] Default unit is 'kg'
- [ ] All 4 units are selectable
- [ ] Quantity accepts decimal values
- [ ] Quantity validation works (must be > 0)
- [ ] Auto-calculation works with all units
- [ ] Price label updates when unit changes
- [ ] Form submission includes unit in quantity string
- [ ] Reset form sets unit back to 'kg'
- [ ] Unit dropdown is responsive on mobile
- [ ] Unit selector matches shadcn/ui design

## Technical Notes

### Number Input Handling
```javascript
// Extract only numeric value for calculation
const qty = formData.quantity.replace(/[^0-9.]/g, '');
```

This ensures that even if there are any non-numeric characters, we extract only the number for calculations.

### State Management
Unit is stored separately from quantity in form state, but combined when submitting to backend. This provides:
- Clean separation of concerns
- Easy calculation logic
- Flexible UI layout
- Simple validation

### Responsive Design
The 3-column grid automatically adjusts on smaller screens:
- Desktop: Quantity (66%) | Unit (33%)
- Mobile: Both fields stack vertically

## Accessibility

- All dropdowns have proper labels
- Keyboard navigation supported
- Screen reader announces unit selection
- Clear visual feedback on selection
- Error messages are descriptive
