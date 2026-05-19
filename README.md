# 🧭 Wanderlust — Travel Listing Platform

A full-stack travel listing web application inspired by Airbnb, built with Node.js, Express.js, MongoDB, and EJS.  
Users can explore, create, and manage travel property listings with image uploads, interactive maps, reviews, and real-time search.

🔗 **Live Demo:** [(https://majorproject-wanderlust-2-vb82.onrender.com/listings)]  
📁 **GitHub:** [https://github.com/SudarshanLande123/MajorProject-Wanderlust](https://github.com/SudarshanLande123/MajorProject-Wanderlust)

---

## ✨ Features

### 🏠 Listings
- Browse all travel property listings on a responsive grid
- Create new listings with title, description, price, location, country, and image
- Edit and update your own listings
- Delete listings (owner only)
- Category filters — Trending, Rooms, Iconic City, Castle, Mountains, Pool, Camping, Beach, Forest, Arctic, Lakefront, Luxury, and more

### 🔍 Search
- Live autocomplete search bar in the navbar
- Suggestions appear instantly as you type
- Works on both desktop and mobile

### 🗺️ Maps
- Interactive map on every listing's show page powered by **MapLibre GL** and **Nominatim geocoding**
- Automatically geocodes the listing's location to place a map marker
- Map displays listing title and location on a popup

### 🖼️ Image Upload
- Upload property images directly from your device
- Images stored securely on **Cloudinary**
- Optimized image preview on the edit page

### ⭐ Reviews
- Logged-in users can leave a star rating (1–5) and written comment
- Interactive star rating UI with hover and click animations
- Only the review author can delete their own review
- Avatar initials shown for each reviewer

### 👤 Authentication & Authorization
- User signup and login with **Passport.js** (local strategy)
- Session-based authentication
- Only listing owners can edit or delete their listings
- Only review authors can delete their reviews
- Protected routes redirect unauthenticated users

### 💰 Tax Display
- Toggle to show/hide +18% GST on listing prices
- Off by default, users opt in to see the total

### 📱 Responsive Design
- Mobile-first layout using Bootstrap 5
- Search bar stays visible at top of navbar on mobile
- Filter icons scroll horizontally on small screens
- Review cards stack vertically on mobile

---

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5
- EJS (Embedded JavaScript Templates)
- MapLibre GL JS
- Font Awesome Icons
- Plus Jakarta Sans (Google Fonts)

### Backend
- Node.js
- Express.js
- Passport.js (Authentication)
- Multer (File Uploads)
- connect-flash (Flash Messages)
- express-session (Sessions)
- method-override (PUT/DELETE support)

### Database
- MongoDB Atlas (Cloud)
- Mongoose ODM

### Cloud & APIs
- Cloudinary (Image Storage)
- Nominatim / OpenStreetMap (Geocoding)
- MapLibre GL (Interactive Maps)

### Tools
- Git & GitHub
- VS Code
- Render (Deployment)

---

## 🗂️ Project Structure

```
MajorProject-Wanderlust/
├── controllers/
│   ├── listings.js       # Listing CRUD + geocoding logic
│   └── reviews.js        # Review create/delete logic
├── models/
│   ├── listing.js        # Listing schema
│   ├── review.js         # Review schema
│   └── user.js           # User schema
├── routes/
│   ├── listing.js        # Listing routes
│   ├── review.js         # Review routes
│   └── user.js           # Auth routes
├── views/
│   ├── layouts/
│   │   └── boilerplate.ejs
│   ├── includes/
│   │   ├── navbar.ejs
│   │   └── footer.ejs
│   └── listings/
│       ├── index.ejs     # All listings
│       ├── show.ejs      # Single listing
│       ├── new.ejs       # Create listing form
│       └── edit.ejs      # Edit listing form
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── map.js
├── utils/
│   └── wrapAsync.js
├── middleware.js
├── cloudConfig.js
└── app.js
```

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the repo
```bash
git clone https://github.com/SudarshanLande123/MajorProject-Wanderlust.git
cd MajorProject-Wanderlust
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create a `.env` file in the root directory
```env
ATLASDB_URL=your_mongodb_atlas_connection_string
SECRET=your_session_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAPTILER_API_KEY=your_maptiler_api_key
```

### 4. Run the app
```bash
nodemon app.js
```

Visit `http://localhost:3000`

---


## 🙋‍♂️ Author

**Sudarshan Lande**  
Full Stack Web Development — Major Project  
Dr. D.Y. Patil Institute of Technology, Pune
