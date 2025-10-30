## Fix Country Management Issues

This PR fixes three critical issues with Country Management:

### Problems Fixed:

1. **Missing Delete Functionality**
   - No way to delete countries
   - Added Delete button next to Edit button
   - Added confirmation dialog before deletion

2. **Country Names Not Displaying**
   - Only flags were showing, no country names
   - Issue: Existing data uses `name` field, new code expects `countryname`
   - Added fallback: `country.countryname || country.name || 'Unknown'`

3. **Auto-creation Issue**
   - This should be resolved with proper API access from previous PR

### Changes Made:

1. **Added deleteMutation**
   - Calls `joltcab.countries.delete(id)`
   - Shows success/error toast
   - Invalidates query to refresh list

2. **Added handleDelete function**
   - Confirmation dialog before deletion
   - Supports both `countryname` and `name` fields

3. **Added Delete button**
   - Red destructive button
   - Placed next to Edit button
   - 80px width to match Edit button

4. **Fixed country name display**
   - Fallback chain: `countryname || name || 'Unknown'`
   - Applied to display name and alt text
   - Backwards compatible with existing data

### UI Changes:

Before:
- Only Edit button
- Country names missing (only flags)

After:
- Edit and Delete buttons side by side
- Country names display correctly
- Confirmation before deletion

### Testing:

After deployment:
1. Country names should display correctly
2. Click Delete button on any country
3. Should see confirmation dialog
4. Confirm deletion
5. Country should be removed and list refreshed