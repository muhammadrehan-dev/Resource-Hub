# 🎓 DUET Resource Hub

**Official resource hub for Batch 25F Cybersecurity A2 at Dawood University of Engineering and Technology (DUET)**

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Push Notifications](#push-notifications)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

DUET Resource Hub is a centralized platform designed to provide Batch 25F Cybersecurity A2 students with easy access to:
- 📚 Subject materials and lecture notes
- 📰 Latest news and announcements
- 📅 Deadline tracking and reminders
- 🔔 Push notifications for important updates

## ✨ Features

### Core Features
- **📖 Subject Materials**: Organized resources for all courses
  - Applied Physics
  - ICT
  - Programming
  - English
  - Calculus
  - Islamiat

- **📰 News & Announcements**: Stay updated with the latest class information
  - Real-time news loading from GitHub
  - Categorized updates (General, Urgent, Exam, Assignment)
  - Automatic archiving after 30 days

- **⏰ Deadline Management**: Never miss a submission
  - Visual countdown timers
  - Priority-based organization
  - Automatic expiration tracking
  - Direct submission links

- **🔔 Push Notifications**: Powered by OneSignal
  - Deadline reminders (24 hours before due date)
  - Important news alerts
  - Cross-platform support

### UI/UX Features
- ⚡ Fast loading with skeleton loaders
- 🎨 Modern, responsive design
- 📱 Mobile-friendly interface
- 🌐 SEO optimized
- ♿ Accessible navigation
- 🎭 Smooth animations with AOS

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Custom styling with CSS variables
- **JavaScript (ES6+)**: Vanilla JS for functionality
- **AOS Library**: Scroll animations
- **Font Awesome**: Icon library
- **Marked.js**: Markdown parsing

### Backend/CMS
- **Tina CMS**: Content management
- **GitHub API**: Content delivery
- **Vercel Serverless Functions**: API endpoints

### Services
- **OneSignal**: Push notifications
- **Google Analytics**: Traffic tracking
- **Counter.dev**: Simple analytics

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/muhammadrehan-dev/Resource-Hub.git
cd Resource-Hub
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
ONESIGNAL_API_KEY=your_onesignal_api_key
ONESIGNAL_APP_ID=your_onesignal_app_id
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

## 🚀 Usage

### Running Locally

**Development mode with Tina CMS:**
```bash
npm run dev
```

**Simple HTTP server:**
```bash
npm run serve
```

### Building for Production

```bash
npm run build
```

### Deploying to Vercel

```bash
npm run deploy
```

Or connect your GitHub repository to Vercel for automatic deployments.

## 📁 Project Structure

```
Resource-Hub/
├── index.html                 # Homepage
├── styles.css                 # Global styles
├── script.js                  # Homepage functionality
├── package.json              # Dependencies
├── vercel.json               # Vercel configuration
│
├── api/
│   └── send-notification.js  # OneSignal API endpoint
│
├── content/
│   ├── news/
│   │   ├── index.html        # News page
│   │   ├── news.css          # News styles
│   │   ├── news.js           # News functionality
│   │   └── *.md              # News articles
│   │
│   └── deadlines/
│       ├── index.html        # Deadlines page
│       ├── deadlines.css     # Deadline styles
│       ├── deadlines.js      # Deadline functionality
│       └── *.md              # Deadline entries
│
├── subjects/
│   ├── applied-physics/
│   ├── ict/
│   ├── programming/
│   ├── english/
│   ├── calculus/
│   └── islamiat/
│
└── admin/                    # Tina CMS admin panel
```

## ⚙️ Configuration

### OneSignal Setup

1. Create an account at [OneSignal](https://onesignal.com)
2. Create a new web push app
3. Get your App ID and REST API Key
4. Update the following files:

**index.html (line 163):**
```javascript
await OneSignal.init({
  appId: "YOUR_ONESIGNAL_APP_ID_HERE",
});
```

**Environment variables:**
```env
ONESIGNAL_API_KEY=your_rest_api_key
ONESIGNAL_APP_ID=your_app_id
```

### Google Analytics

Replace the tracking ID in `index.html` (line 7):
```javascript
gtag('config', 'YOUR-GA-TRACKING-ID');
```

### Content Management

Content is managed through:
1. **Tina CMS**: Access via `/admin` route
2. **Direct Markdown**: Edit `.md` files in `content/` directories

## 🔔 Push Notifications

### Automatic Deadline Reminders
- Checks every hour for deadlines within 24 hours
- Sends notifications automatically via OneSignal
- Configurable in `content/deadlines/deadlines.js`

### Manual Notifications
Send via the serverless function:
```javascript
fetch('/.netlify/functions/send-notification', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Your Title',
    message: 'Your Message',
    url: 'https://your-url.com'
  })
})
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect GitHub repository**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Import your repository

2. **Configure environment variables**
   - Add `ONESIGNAL_API_KEY`
   - Add `ONESIGNAL_APP_ID`

3. **Deploy**
   - Automatic deployments on push to main branch

### Netlify

1. Connect repository
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.`
3. Add environment variables
4. Deploy

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
```bash
git checkout -b feature/AmazingFeature
```

3. **Commit your changes**
```bash
git commit -m 'Add some AmazingFeature'
```

4. **Push to the branch**
```bash
git push origin feature/AmazingFeature
```

5. **Open a Pull Request**

### Contribution Guidelines
- Follow existing code style
- Test your changes thoroughly
- Update documentation as needed
- Add meaningful commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**TH3 CUT3 V1RU5**
- GitHub: [@muhammadrehan-dev](https://github.com/muhammadrehan-dev)

## 🙏 Acknowledgments

- Dawood University of Engineering and Technology
- Batch 25F Cybersecurity A2 students
- All contributors and supporters

## 📞 Support

For support, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

## 🔗 Links

- **Live Site**: [https://25fcyber.vercel.app](https://25fcyber.vercel.app)
- **Repository**: [https://github.com/muhammadrehan-dev/Resource-Hub](https://github.com/muhammadrehan-dev/Resource-Hub)
- **DUET Website**: [https://duet.edu.pk](https://duet.edu.pk)

---

Made with ❤️ for students of A2 Cybersecurity Batch 25F

**⭐ Star this repository if you find it helpful!**
