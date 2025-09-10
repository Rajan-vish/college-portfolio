# College Event Management Portal

A comprehensive MERN stack web application for managing college events with real-time notifications and admin dashboard.

## 🚀 Features

### Student Features
- **Event Discovery**: Browse and search upcoming college events
- **Easy Registration**: One-click event registration with form validation
- **Real-time Updates**: Instant notifications for event changes
- **Personal Dashboard**: View registered events and attendance history
- **Responsive Design**: Mobile-first design for all devices

### Admin Features
- **Event Management**: Create, edit, delete, and manage events
- **Registration Analytics**: Track registration statistics and trends
- **User Management**: Manage student accounts and permissions
- **Real-time Dashboard**: Live updates on event registrations
- **Bulk Operations**: Export data and send bulk notifications

### Technical Features
- **Secure Authentication**: JWT-based auth with role-based access control
- **Real-time Communication**: Socket.io for instant updates
- **Responsive UI**: Modern, mobile-first design
- **Cloud Database**: MongoDB Atlas integration
- **Fast Performance**: Optimized API endpoints and caching
- **Scalable Architecture**: Microservices-ready structure

## 🛠️ Tech Stack

### Frontend
- **React 18**: Latest React with hooks and context
- **Material-UI**: Modern component library
- **React Router v6**: Client-side routing
- **Axios**: HTTP client for API calls
- **Socket.io Client**: Real-time communication
- **React Hook Form**: Form handling and validation

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication tokens
- **Socket.io**: Real-time communication
- **Bcrypt**: Password hashing
- **Multer**: File upload handling

## 🏗️ Project Structure

```
college-event-portal/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (provided)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rajan-vish/college-event-portal.git
   cd college-event-portal
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   Create `.env` files in both backend and frontend directories with required configurations.

5. **Start Development Servers**
   ```bash
   # Backend (from backend directory)
   npm run dev
   
   # Frontend (from frontend directory)
   npm start
   ```

## 🔧 Configuration

### Environment Variables
Create `.env` file in backend directory:
```
MONGODB_URI=mongodb+srv://rajanvish2005:Ay2b3vylXNW53ghv@cluster1.4yireiy.mongodb.net/
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
```

## 📱 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Event Endpoints
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event (Admin only)
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)

### Registration Endpoints
- `POST /api/registrations` - Register for event
- `GET /api/registrations/user/:userId` - Get user registrations
- `GET /api/registrations/event/:eventId` - Get event registrations (Admin only)

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Dark/Light Mode**: Theme switching capability
- **Accessibility**: WCAG compliant design
- **Progressive Web App**: PWA capabilities for mobile
- **Optimistic UI**: Instant feedback for user actions

## 🚀 Deployment

### Docker Deployment
```bash
docker-compose up --build
```

### Manual Deployment
1. Build frontend: `npm run build`
2. Deploy to hosting service (Heroku, Vercel, etc.)
3. Configure environment variables
4. Set up MongoDB Atlas connection

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Rajan Vish
- **GitHub**: [@Rajan-vish](https://github.com/Rajan-vish)

## 🔮 Future Enhancements

- Mobile app development
- AI-powered event recommendations
- Integration with calendar applications
- Advanced analytics and reporting
- Multi-language support
- Payment integration for paid events

---

**Made with ❤️ for college communities**
