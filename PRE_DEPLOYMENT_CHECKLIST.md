# Pre-Deployment Checklist

## Before Pushing to GitHub

### 1. Install Node.js (if not already installed)
- [ ] Download from https://nodejs.org/
- [ ] Install LTS version
- [ ] Restart terminal/VSCode
- [ ] Verify: `node --version`
- [ ] Verify: `npm --version`

### 2. Install Project Dependencies
```powershell
cd "V:\Downloads\IS2102\Wireframe\IS2102-group-project\laundrydash-app"
npm install
```
- [ ] Installation completes without errors
- [ ] `node_modules` folder created

### 3. Test Development Build
```powershell
npm run dev
```
- [ ] Server starts at http://localhost:5173
- [ ] No console errors in terminal
- [ ] Home page loads correctly

### 4. Test Customer App Functionality
Visit http://localhost:5173

#### Home Page
- [ ] Both "Customer App" and "Driver App" buttons visible
- [ ] Both experience cards clickable
- [ ] Customer card shows new features list

#### Customer App - Home Tab
- [ ] 4 service cards display correctly (icons, text, pricing)
- [ ] Service cards are clickable
- [ ] Active order alert shows at bottom
- [ ] Clicking service opens scheduling form

#### Customer App - Scheduling Form
- [ ] Address field pre-filled
- [ ] Date picker works and validates (no past dates)
- [ ] Time dropdown populated
- [ ] Special instructions textarea works
- [ ] Form summary updates with selections
- [ ] "Confirm Pickup" validates required fields
- [ ] "Cancel" button returns to service selection

#### Customer App - Track Order Tab
- [ ] Order details card displays
- [ ] Driver info card shows
- [ ] 6-stage timeline displays with proper styling
- [ ] Google Maps embed loads
- [ ] All buttons present (even if non-functional)
- [ ] Empty state shows when no active order (test by clearing seed data)

#### Customer App - Orders Tab
- [ ] Active order section shows
- [ ] Past orders list displays (2 orders)
- [ ] "Reorder" button shows alert
- [ ] "View Receipt" button present
- [ ] Order cards show all details

#### Customer App - Profile Tab
- [ ] Profile header with avatar and info
- [ ] Saved address card displays
- [ ] Payment card displays
- [ ] Notification switches work
- [ ] SMS toggle works
- [ ] All buttons present
- [ ] Sign out button styled correctly (red)

#### Navigation & Responsive
- [ ] Tab switching works smoothly
- [ ] "Home" button returns to landing page
- [ ] Back/forward browser navigation works
- [ ] Mobile view (resize to 375px width) looks good
- [ ] Desktop view looks good
- [ ] No horizontal scroll issues

#### Visual Consistency
- [ ] Colors match Driver app
- [ ] Font sizes consistent
- [ ] Spacing/padding consistent
- [ ] Border radius consistent
- [ ] Box shadows consistent
- [ ] Button styles match
- [ ] No visual glitches or overlapping elements

### 5. Build for Production
```powershell
npm run build
```
- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] `dist` folder created

### 6. Test Production Build
```powershell
npm run preview
```
- [ ] Preview starts at http://localhost:4173
- [ ] All functionality works same as dev
- [ ] No console errors
- [ ] Performance feels good

### 7. Verify Build Output
- [ ] Check `dist` folder exists
- [ ] Check `dist/index.html` exists
- [ ] Check `dist/assets` folder has JS/CSS files
- [ ] File sizes reasonable (not too large)

### 8. Git Commit
```powershell
# Check status
git status

# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: implement complete Customer Mobile App

- Add service selection with 4 service types
- Implement pickup scheduling with date/time pickers
- Add real-time order tracking with timeline
- Create order history with reorder functionality
- Build profile management for addresses and payments
- Align design system with existing Driver app
- Add comprehensive responsive styles
- Update documentation and README files"

# Push to GitHub
git push origin main
```

- [ ] Git commit successful
- [ ] Git push successful
- [ ] Changes visible on GitHub

### 9. Verify Vercel Deployment
Wait 2-3 minutes after pushing, then:
- [ ] Visit your Vercel dashboard
- [ ] New deployment started automatically
- [ ] Build completes successfully
- [ ] No deployment errors
- [ ] Visit deployed URL
- [ ] Test all functionality on live site
- [ ] Test on mobile device if possible

### 10. Final Production Checks
On your live Vercel URL:
- [ ] Customer app loads
- [ ] Driver app still works
- [ ] Navigation between apps works
- [ ] No console errors in browser DevTools
- [ ] Maps load correctly
- [ ] All interactive elements work
- [ ] Responsive design works on mobile
- [ ] Page loads reasonably fast

## If Issues Occur

### Build Errors
1. Check terminal for specific error messages
2. Fix TypeScript/ESLint errors shown
3. Run `npm run build` again
4. Don't push until build succeeds

### Vercel Deployment Errors
1. Check Vercel deployment logs
2. Verify `vercel.json` configuration
3. Ensure `package.json` scripts are correct
4. Try redeploying from Vercel dashboard

### Visual Issues
1. Clear browser cache
2. Check CSS specificity conflicts
3. Test in different browsers
4. Check responsive breakpoints

### Functionality Issues
1. Check browser console for errors
2. Verify data structures match types
3. Test user flow step by step
4. Add console.logs for debugging

## Success! 🎉

When all items are checked:
- ✅ Customer app fully functional
- ✅ Design matches Driver app
- ✅ Production build works
- ✅ Deployed to Vercel
- ✅ No errors in production

Your LaundryDash platform now has both Customer and Driver apps ready for users!
