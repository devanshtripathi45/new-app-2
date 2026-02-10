# Quick Start Guide - New Features

## Getting Started

### 1. First Time Setup
```bash
# Install dependencies (if not already done)
npm install

# Push database migrations
npm run db:push

# Build the project
npm run build
```

### 2. Running the Application
```bash
# Set environment variable (Windows PowerShell)
$env:NODE_ENV='development'

# Run dev server
npm run dev
```

Then navigate to: `http://localhost:5000`

---

## Testing the Features

### 3. Login with Default Admin Account
1. Click "Log In" in navbar
2. Select "Login" tab
3. Enter credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
4. Click "Log In"

**Note**: Once logged in as admin, you'll see an "Admin" button in the navbar.

---

## Admin Panel Walkthrough

### 4. Manage Settings (Logo & Branding)
1. Go to Admin Dashboard
2. Click "Settings" in the sidebar
3. Upload your website logo
4. Edit site name
5. Edit home page hero title and subtitle
6. Add social media links
7. Click "Save Settings"

**Immediate Effects**:
- Logo appears in navbar and footer
- Site name updates across all pages
- Hero section on home page reflects changes

---

### 5. Manage About Me Page
1. Go to Admin Dashboard
2. Click "About Me" in the sidebar
3. **Upload Profile Photo**: Click file input to select image
4. **Edit Bio**: Write your introduction
5. **Add Sections**: Click "Add Section" button

#### Section Types:

**Skills Section**
- Format: One skill per line with • bullet
- Example:
  ```
  • Network Design & Architecture
  • Cisco IOS Configuration
  • BGP & OSPF Routing
  ```

**Experience Section**
- Format: Job title/company, then description, separate with blank line
- Example:
  ```
  Senior Network Engineer at TechCorp (2020-Present)
  Designed and implemented network infrastructure for 50+ locations
  
  Network Engineer at NetSolutions (2017-2020)
  Managed core and edge network infrastructure
  ```

**Certifications Section**
- Format: One certification per line with • bullet
- Example:
  ```
  • CCNA Routing & Switching - 2022
  • CCNP Enterprise - In Progress
  • AWS Certified Cloud Practitioner - 2023
  ```

6. Click "Save About Me"

**View Your About Page**: Go to `/about` to see the published portfolio

---

## View New Pages

### Public Pages Added:
- **`/about`** - Your professional portfolio page
- **`/admin/about-me`** - Manage about me content
- **`/admin/settings`** - Manage site branding and social links

### Updated Navigation:
- Navbar now includes "About" link
- Footer displays social media links from settings

---

## Testing Registration

1. Click "Log Out" if logged in
2. Go to Auth page
3. Select "Register" tab
4. Fill in:
   - Username (must be unique)
   - Password
   - Full Name
5. Click "Create Account"
6. You'll be redirected to login
7. Log in with your new credentials

---

## API Testing (Optional)

### Fetch About Me
```bash
curl http://localhost:5000/api/about-me
```

### Fetch Settings
```bash
curl http://localhost:5000/api/settings/siteName
curl http://localhost:5000/api/settings/logoUrl
curl http://localhost:5000/api/settings/socialLinks
```

### Update About Me (Requires Authentication)
```bash
curl -X PATCH http://localhost:5000/api/about-me \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Your bio here",
    "sections": []
  }'
```

---

## Troubleshooting

### "DATABASE_URL must be set" Error
```bash
# Set the database URL in your environment
# Windows PowerShell:
$env:DATABASE_URL='postgresql://user:password@localhost:5432/dbname'

# Then run:
npm run dev
```

### Port Already in Use
If port 5000 is already in use, the dev server will try the next available port.

### Database Migrations Not Applied
```bash
npm run db:push
```

---

## Feature Highlights

### About Me Page Design
- ✨ Modern gradient hero section
- 📸 Circular profile photo with glow effect
- 📋 Professional sections with icons
- 🔗 Social media links
- 📱 Fully responsive design

### Settings Management
- 🎨 Upload custom logo
- ⚙️ Global site branding
- 📝 Dynamic home page content
- 🔗 Social media integration
- 🔒 Admin-only access

### Authentication
- 🔐 Secure password hashing
- 💾 Session-based auth
- 👤 Role-based access (Admin/User)
- 🚀 Persistent login

---

## Key Files to Know

```
client/src/
├── pages/
│   ├── AboutMe.tsx                 # Public about page
│   ├── Home.tsx                    # Updated with dynamic content
│   └── admin/
│       ├── ManageAboutMe.tsx       # About me admin panel
│       ├── Settings.tsx            # Settings admin panel
│       └── Dashboard.tsx           # Admin overview
├── components/
│   └── Layout.tsx                  # Navbar, Footer, AdminSidebar
└── App.tsx                         # Routes

server/
├── routes.ts                       # All API endpoints
├── storage.ts                      # Database operations
└── auth.ts                         # Authentication logic

shared/
├── schema.ts                       # Database schema & types
└── routes.ts                       # API definitions
```

---

## Production Deployment

Before deploying to production:

1. **Update Admin Password**
   - Log in as admin
   - Change password (add this feature if needed)

2. **Set Secure Environment Variables**
   ```
   DATABASE_URL=postgresql://prod-user:secure-password@prod-host/dbname
   SESSION_SECRET=generate-long-random-string-here
   NODE_ENV=production
   ```

3. **Upload Professional Content**
   - Profile photo
   - About me content
   - Custom logo
   - Social media links

4. **Test Production Build**
   ```bash
   npm run build
   npm start
   ```

---

## Support & Customization

### Add More Sections to About Page
Edit `ManageAboutMe.tsx` to add new section types to the select dropdown.

### Change Logo Size
Edit `Layout.tsx` navbar logo image dimensions.

### Customize Colors
Edit `tailwind.config.ts` or override in component classes.

### Add More Settings
1. Update seed in `routes.ts`
2. Add API endpoint in `routes.ts`
3. Create admin UI in `Settings.tsx`

---

## Next: Upload Content!

Now that everything is set up:
1. Log in as admin
2. Go to Settings → Upload your logo
3. Go to About Me → Add your profile info
4. Visit `/about` to see your new portfolio page
5. Share with the world! 🚀

Enjoy your new portfolio features!
