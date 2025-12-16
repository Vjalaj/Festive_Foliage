<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
</p>

<h1 align="center">🎄 Festive Foliage</h1>

<p align="center">
  <strong>An interactive community Christmas tree where everyone can add decorations!</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-Active-success?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" />
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-deploy-to-vercel">Deploy</a> •
  <a href="#-admin-access">Admin</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## 🌟 What is Festive Foliage?

Festive Foliage is a **collaborative virtual Christmas tree** where visitors can add their own decorations. Perfect for:

- 🏠 **Family gatherings** — Let everyone contribute to a shared tree
- 🏢 **Office parties** — Create a virtual tree for remote teams  
- 🎉 **Community events** — Share festive cheer online
- 🎁 **Holiday cards** — Save and share your decorated tree

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 **Click to Add** | Tap any decoration to add it to the tree |
| 🖱️ **Drag to Move** | Reposition decorations anywhere on the tree |
| 📱 **Mobile Friendly** | Works perfectly on phones and tablets |
| 🎵 **Background Music** | Festive tunes to set the holiday mood |
| ❄️ **Falling Snow** | Beautiful animated snowfall effect |
| 💾 **Persistent Storage** | Decorations saved locally or to Vercel Blob |
| 🛡️ **Admin Controls** | Manage decorations and block problematic users |
| 🌙 **Beautiful Design** | Stunning gradient backgrounds with glowing lights |
| 📸 **Save Image** | Download your decorated tree as an image |
| 🔗 **Share Link** | Share your tree with friends and family |

---

## 🎄 Demo

> Add a live demo link here once deployed!

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Vjalaj/Festive_Foliage.git

# Navigate to project
cd Festive_Foliage

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your admin credentials
# ADMIN_USER=your_username
# ADMIN_PASS=your_password

# Start development server
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) and start decorating! 🎄

---

## ⚙️ Environment Variables

Create a `.env` file with:

```env
ADMIN_USER=admin
ADMIN_PASS=your_secure_password
NEXT_PUBLIC_MUSIC_FILE=/music/christmas.mp3
```

| Variable | Description | Required |
|----------|-------------|:--------:|
| `ADMIN_USER` | Admin username for /admin dashboard | ✅ |
| `ADMIN_PASS` | Admin password | ✅ |
| `NEXT_PUBLIC_MUSIC_FILE` | Path to background music file | ❌ |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (auto-set on Vercel) | ❌ |

---

## 🌐 Deploy to Vercel

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/Vjalaj/Festive_Foliage">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
</p>

### Manual Deployment Steps:

1. **Push to GitHub** — Fork or push your copy
2. **Import in Vercel** — Go to [vercel.com](https://vercel.com) and import
3. **Add Blob Store** — In Storage tab, add a new Blob Store
4. **Set Environment Variables**:
   - `ADMIN_USER` = your admin username
   - `ADMIN_PASS` = your admin password
5. **Deploy!** 🚀

> 💡 `BLOB_READ_WRITE_TOKEN` is automatically added when you attach Blob Store

---

## 🔐 Admin Access

Navigate to `/admin` to access the admin dashboard:

| Action | Description |
|--------|-------------|
| 👀 **View** | See all decorations with user info |
| 🗑️ **Remove** | Delete any decoration |
| 🚫 **Block** | Block IP addresses or sessions |

---

## 🎨 Decoration Types

| Type | Description |
|------|-------------|
| 🔴 **Ornaments** | Classic baubles in various colors |
| ⭐ **Stickers** | Stars, candy canes, gifts, and more |
| ✨ **Extras** | Special decorations like snowmen |
| 🏷️ **Name Tags** | Add your name to the tree |
| 📷 **Photos** | Upload personal images as decorations |

---

## 📁 Project Structure

```
Festive_Foliage/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx          # Main tree page
│   │   ├── admin/            # Admin dashboard
│   │   └── api/              # REST API routes
│   ├── components/
│   │   ├── festive/          # Tree, decorations, snow
│   │   └── ui/               # Reusable UI components
│   └── lib/                  # Utilities, types, constants
├── public/
│   └── music/                # Background music files
├── data/                     # Local JSON storage (dev only)
└── docs/                     # Documentation
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Storage**: Local JSON / [Vercel Blob](https://vercel.com/storage/blob)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Ideas for Contributions

- 🎨 New decoration designs
- 🌍 Internationalization (i18n)
- 🎵 More music options
- 🎭 Themes (different tree styles)
- 📊 Analytics dashboard

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💖 Acknowledgments

- Christmas SVG decorations inspired by open-source designs
- Built with love during the holiday season

---

<p align="center">
  <strong>🎄 Happy Holidays! 🎄</strong>
</p>

<p align="center">
  Made with ❤️ and lots of ☕ by <a href="https://github.com/Vjalaj">Vjalaj</a>
</p>

<p align="center">
  <sub>If you like this project, please give it a ⭐!</sub>
</p>
