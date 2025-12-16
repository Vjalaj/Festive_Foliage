<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
</p>

<h1 align="center">🎄 FestiveFoliage</h1>

<p align="center">
  <strong>A beautiful interactive Christmas tree decoration app</strong><br/>
  Let visitors add ornaments, stickers, and more to a shared virtual tree!
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-deploy-to-vercel">Deploy</a> •
  <a href="#-admin-access">Admin</a>
</p>

---

## ✨ Features

- 🎨 **Drag & Drop** — Intuitive decoration placement
- 📱 **Mobile First** — Phone-optimized layout that works everywhere
- 🎵 **Background Music** — Festive tunes to set the mood
- 💾 **Persistent Storage** — Local files or Vercel Blob
- 🛡️ **Admin Controls** — Remove decorations & block users
- ❄️ **Falling Snow** — Animated snowfall effect
- 🌟 **Beautiful Tree** — SVG Christmas tree with lights

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Vjalaj/Festive_Foliage.git

# Navigate to project
cd Festive_Foliage

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) 🎄

---

## ⚙️ Environment Variables

Edit `.env` with your values:

| Variable | Description | Required |
|----------|-------------|----------|
| `ADMIN_USER` | Admin username for decoration management | ✅ |
| `ADMIN_PASS` | Admin password | ✅ |
| `NEXT_PUBLIC_MUSIC_FILE` | Path to music file (e.g., `/music/christmas.mp3`) | ❌ |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (auto-set on Vercel) | ❌ |

---

## 🌐 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Vjalaj/Festive_Foliage)

**Manual deployment:**

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add a **Blob Store** from Storage tab
4. Set `ADMIN_USER` and `ADMIN_PASS` in Environment Variables
5. Deploy! 🚀

> `BLOB_READ_WRITE_TOKEN` is automatically added when you attach Blob Store

---

## 🔐 Admin Access

Visit `/admin` to manage decorations:

- 👀 View all decorations with metadata
- 🗑️ Remove any decoration  
- 🚫 Block IPs or sessions

---

## 📁 Project Structure

```
├── src/
│   ├── app/              # Next.js app router
│   │   ├── page.tsx      # Main tree page
│   │   ├── admin/        # Admin dashboard
│   │   └── api/          # API routes
│   ├── components/
│   │   ├── festive/      # Tree, decorations, snow
│   │   └── ui/           # UI components
│   └── lib/              # Utilities & types
├── public/
│   └── music/            # Background music files
└── data/                 # Local JSON storage (dev only)
```

---

## 📜 License

MIT © [Vjalaj](https://github.com/Vjalaj)

---

<p align="center">
  Made with ❤️ and ☕
</p>
