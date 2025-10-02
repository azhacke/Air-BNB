# Airbnb Clone

A full-stack web application that replicates the core functionalities of Airbnb, allowing users to browse property listings, view detailed information, and book accommodations.

![Project Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📋 Features

- **Property Listings** - Browse a wide variety of properties with images, location, pricing, and amenities
- **Advanced Search & Filters** - Find the perfect property using powerful search and filtering options
- **Detailed Property Pages** - View comprehensive information including maps and host details
- **Booking System** - Select dates and book properties with clear cost breakdowns
- **User Authentication** - Secure registration and login system to manage bookings and profiles

---

## 🛠️ Technologies Used

### Frontend
- **React** - UI library for building interactive interfaces
- **React Router** - Client-side routing and navigation
- **Bootstrap CSS** - Responsive design and styling

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling tool

### Authentication
- **JWT** (JSON Web Tokens) - Secure user authentication

---

## 🚀 Getting Started

### Prerequisites

Before running this project, ensure you have:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Atlas account or local instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/azhacke/Air-BNB.git
   cd Air-BNB
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   ```bash
   # Initialize the database with seed data
   cd init
   node index.js
   cd ..
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

5. **Start the development server**
   ```bash
   # Using nodemon for auto-restart
   nodemon app.js
   
   # Or using standard node
   node app.js
   ```

6. **Access the application**
   
   Open your browser and navigate to `http://localhost:5001`

---

## 📁 Project Structure

```
Air-BNB/
├── init/              # Database initialization scripts
├── models/            # Mongoose schemas
├── routes/            # API routes
├── controllers/       # Route controllers
├── middleware/        # Custom middleware
├── public/            # Static files
├── views/             # Frontend views
├── app.js             # Main application file
└── package.json       # Project dependencies
```

---

## 🔮 Future Enhancements

- [ ] Complete React frontend implementation
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Deploy backend to Render/Railway
- [ ] Add payment integration (Stripe)
- [ ] Implement reviews and ratings system
- [ ] Add real-time messaging between hosts and guests
- [ ] Integrate Google Maps API for better location features

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

**Abdul Azeez**

- LinkedIn: [azhacke](https://linkedin.com/in/azhacked)
- GitHub: [azhacke](https://github.com/azhacke)
- Email: Feel free to reach out for questions or collaboration opportunities

---

## 🙏 Acknowledgments

- Inspired by [Airbnb](https://www.airbnb.com/)
- Built as a learning project to demonstrate full-stack development skills

---

**Note:** This project is for educational purposes and is not affiliated with Airbnb, Inc.