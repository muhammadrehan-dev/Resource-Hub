# 🎓 DUET Resource Hub - Batch 25F Cyber A2

[![Netlify Status](https://img.shields.io/badge/netlify-deployed-success?style=flat-square)](https://25fcyber.netlify.app/)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=flat-square)](https://25fcyber.netlify.app/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

A centralized resource hub for **Batch 25F Cybersecurity A2** students at Dawood University of Engineering and Technology (DUET). Access all your course materials, lecture notes, and study resources in one beautiful, organized platform.

## ✨ Features

- 🎨 **Modern UI/UX** - Clean, responsive design with smooth animations
- 📱 **Mobile First** - Fully responsive across all devices
- 🚀 **Fast Loading** - Optimized performance with CDN resources
- 🔍 **SEO Optimized** - Comprehensive meta tags and structured data
- ♿ **Accessible** - ARIA labels and semantic HTML
- 🎯 **Direct Links** - Quick access to Google Drive folders for each subject

## 📚 Available Subjects

- ⚛️ Applied Physics
- 💻 ICT (Information and Communication Technology)
- 👨‍💻 Programming
- 📖 English
- ➗ Calculus
- 🕌 Islamiat

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript** - Interactive functionality
- **AOS Library** - Scroll animations
- **Font Awesome** - Icons
- **Google Fonts** - Poppins typography

## 🚀 Getting Started

### Prerequisites

- A modern web browser
- Internet connection (for CDN resources)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/muhammadrehan-dev/resource-hub.git
   cd resource-hub
   ```

2. **Update Google Drive Links**
   
   Open `script.js` and update the `googleDriveLinks` object with your folder URLs:
   ```javascript
   const googleDriveLinks = {
       'Applied Physics': 'YOUR_DRIVE_LINK_HERE',
       'ICT': 'YOUR_DRIVE_LINK_HERE',
       // ... update other subjects
   };
   ```

3. **Deploy**
   
   Simply upload to any static hosting service:
   - Netlify (recommended)
   - GitHub Pages
   - Vercel
   - Or open `index.html` locally

## 📁 Project Structure

```
resource-hub/
├── index.html          # Main HTML file
├── styles.css          # Stylesheet
├── script.js           # JavaScript functionality
├── logo.png           # University logo
├── sitemap.xml        # SEO sitemap
├── robots.txt         # Search engine instructions
├── site.webmanifest   # PWA manifest
├── _headers           # Security headers (Netlify)
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## 🎨 Customization

### Changing Colors

Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #00bcd4;
    --primary-dark: #0097a7;
    --primary-light: #b2ebf2;
}
```

### Adding New Subjects

1. Add a new card in `index.html`
2. Update the `googleDriveLinks` object in `script.js`
3. Choose an icon from [Font Awesome](https://fontawesome.com/icons)

## 📊 Analytics

The site includes:
- Google Analytics (G-J9BSZY0FVR)
- Counter.dev visitor tracking

Update tracking IDs in `index.html` as needed.

## 🔒 Security

Security headers are configured in `_headers`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy restrictions

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 To-Do

- [ ] Add dark mode toggle
- [ ] Implement search/filter functionality
- [ ] Add PWA offline support
- [ ] Create admin panel for easy link updates
- [ ] Add assignment deadline tracker
- [ ] Include exam schedule

## 👨‍💻 Developer

**Muhammad Rehan** (TH3 CUT3 V1RU5)

- 📧 Email: muhammadrehan78633@gmail.com
- 📱 WhatsApp: +92 322 968 0603
- 🌐 Website: [25fcyber.netlify.app](https://25fcyber.netlify.app)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Dawood University of Engineering and Technology
- Batch 25F Cybersecurity A2 students
- All contributors and supporters

## 📞 Support

For any issues or questions:
- Open an issue on GitHub
- Contact via email or WhatsApp
- Join our batch group discussions

---

<div align="center">
Made with ❤️ for A2 Cybersecurity Batch 25F

⭐ Star this repo if you found it helpful!
</div>
