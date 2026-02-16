# Government e-Marketplace Services - Tender Management System

An enterprise-grade single-domain React website with admin dashboard for Government e-Marketplace services and tender management.

## Features

### Public Website
- **Home Page**: Hero section, services overview, latest tenders, features, and call to action
- **About Us**: Company information and mission
- **Services**: Comprehensive list of GeM and tender-related services
- **Tenders**: Live tender listings with filtering and search functionality
- **Blog**: Industry news, updates, and informative articles
- **Pricing**: Service packages and pricing details
- **Testimonials**: Client feedback and success stories
- **FAQ**: Frequently asked questions
- **Contact**: Contact information and enquiry form

### Admin Dashboard
- **Authentication**: Secure JWT-based login with session persistence
- **Dashboard**: Real-time statistics and quick access to key metrics
- **Pages Management**: Edit all website pages with rich content
- **Services Management**: Add, edit, and delete services
- **Tenders Management**: Manage tender listings with complete CRUD operations
- **Blogs Management**: Create and edit blog posts with categories and tags
- **Enquiries Management**: View, assign, and track customer enquiries
- **Users Management**: Manage user accounts and access levels
- **Settings**: Configure website settings, contact information, and preferences

### Tender Module (Paid Access)
- **Limited Preview**: Free users see limited tender information
- **Full Access**: Paid users get complete tender details and access to documents
- **Payment Integration**: Secure payment gateway integration
- **Download Options**: Download tender documents and specifications

## Technology Stack

### Frontend
- **React 18**: Modern React with hooks
- **React Router**: Client-side routing with nested routes
- **Axios**: HTTP client for API calls
- **Lucide React**: Modern icon library
- **CSS3**: Custom styling with responsive design

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ORM
- **JWT**: JSON Web Token for authentication
- **Bcrypt**: Password hashing and security

### Development Tools
- **Nodemon**: Auto-restart server during development
- **Concurrently**: Run multiple commands simultaneously
- **CORS**: Cross-origin resource sharing

## Project Structure

```
.
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context for state management
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── index.css      # Global styles
│   └── package.json
├── server/                # Node.js backend
│   ├── config/            # Configuration files
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── server.js          # Server entry point
├── package.json           # Project dependencies
└── .env                   # Environment variables
```

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd tender-management-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   cd client
   npm install
   cd ..
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env`
   - Update the variables with your configuration

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Public website: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin/login

## Environment Variables

### Required Variables
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `PORT`: Server port (default: 5000)

### Optional Variables
- `NODEMAILER_USER`: Email for notifications
- `NODEMAILER_PASS`: Email password
- `RAZORPAY_KEY_ID`: Razorpay payment gateway key
- `RAZORPAY_KEY_SECRET`: Razorpay payment gateway secret

## Database Models

### Core Models
- **Admin**: Admin user information
- **User**: Customer/user profiles
- **Page**: Website pages content
- **Service**: Service listings
- **Tender**: Tender information
- **Blog**: Blog posts and articles
- **Enquiry**: Customer enquiries
- **Payment**: Payment transactions
- **Settings**: Global website settings

## API Endpoints

### Auth Endpoints
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/admin/profile` - Get admin profile
- `PUT /api/auth/admin/profile` - Update admin profile
- `PUT /api/auth/admin/change-password` - Change password

### Pages Endpoints
- `GET /api/pages` - Get all active pages
- `GET /api/pages/:pageType` - Get page by type
- `GET /api/pages/admin/all` - Get all pages (admin)
- `POST /api/pages` - Create or update page (admin)
- `PUT /api/pages/:pageType` - Update page (admin)
- `DELETE /api/pages/:pageType` - Delete page (admin)

### Services Endpoints
- `GET /api/services` - Get all active services
- `GET /api/services/slug/:slug` - Get service by slug
- `GET /api/services/admin/all` - Get all services (admin)
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Tenders Endpoints
- `GET /api/tenders` - Get all active tenders
- `GET /api/tenders/:id` - Get tender by ID
- `GET /api/tenders/admin/all` - Get all tenders (admin)
- `POST /api/tenders` - Create tender (admin)
- `PUT /api/tenders/:id` - Update tender (admin)
- `DELETE /api/tenders/:id` - Delete tender (admin)

### Blogs Endpoints
- `GET /api/blogs` - Get all published blogs
- `GET /api/blogs/slug/:slug` - Get blog by slug
- `GET /api/blogs/admin/all` - Get all blogs (admin)
- `POST /api/blogs` - Create blog (admin)
- `PUT /api/blogs/:id` - Update blog (admin)
- `DELETE /api/blogs/:id` - Delete blog (admin)

### Enquiries Endpoints
- `POST /api/enquiries` - Create enquiry (public)
- `GET /api/enquiries` - Get all enquiries (admin)
- `GET /api/enquiries/:id` - Get enquiry by ID (admin)
- `PUT /api/enquiries/:id/status` - Update enquiry status (admin)
- `POST /api/enquiries/:id/notes` - Add note to enquiry (admin)
- `DELETE /api/enquiries/:id` - Delete enquiry (admin)
- `GET /api/enquiries/export/csv` - Export enquiries to CSV (admin)

### Users Endpoints
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID (admin)
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)

## Deployment

### Production Deployment
1. **Build the frontend**:
   ```bash
   cd client
   npm run build
   ```

2. **Set environment variables** for production:
   - Update `.env` file with production values
   - Ensure MongoDB connection string is valid
   - Set appropriate JWT secret

3. **Start the server**:
   ```bash
   npm start
   ```

### Deployment Options
- **Heroku**: Deploy directly from GitHub
- **AWS EC2**: Deploy on Amazon EC2 instance
- **DigitalOcean**: Deploy on DigitalOcean Droplet
- **Vercel**: Frontend deployment with API routes
- **Netlify**: Static site deployment with serverless functions

## Security Considerations

- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Sanitize and validate all user inputs
- **Password Hashing**: Bcrypt for secure password storage
- **CORS Configuration**: Restrict API access to trusted domains
- **Rate Limiting**: Prevent brute force attacks
- **HTTPS**: Always use secure HTTPS connections

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact:
- Email: info@example.com
- Phone: +91 9876543210
- WhatsApp: +91 9876543210