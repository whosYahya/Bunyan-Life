<div align="center">

<img src="./assets/icon.png" alt="Bunyan Logo" width="180"/>

# Bunyan (بنيان)
### *Your Modern Deen & Lifestyle Companion*

> **"Build Yourself. Strengthen the Ummah."**

[![Build Status](https://img.shields.io/badge/build-passing-success?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)](#)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white&style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge)

*A modern Islamic lifestyle platform that helps Muslims build consistency in worship, health, knowledge, and personal growth—one day at a time.*

</div>

---

# 🌙 About Bunyan

**Bunyan (بنيان)** is an Islamic lifestyle and habit-tracking application inspired by the prophetic vision of believers supporting one another like the bricks of a strong building.

The word **"Bunyan"** literally means:

> **Structure • Building • Foundation**

It is inspired by the famous hadith:

> **"The believer to another believer is like a building whose different parts support each other."**
>
> *Then the Prophet ﷺ interlocked his fingers.*
>
> **— Sahih al-Bukhari & Sahih Muslim**

Our goal is simple:

> Help Muslims become more consistent in their worship, health, knowledge, and character while encouraging sincere self-improvement rather than unhealthy comparison.

---

# 🤲 Built Upon Intentions

> ### إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ
>
> **"Actions are but by intentions, and every person shall have only what they intended."**
>
> **— Sahih al-Bukhari & Sahih Muslim**

### Reflection

Bunyan is designed to encourage **Ikhlāṣ (Sincerity)** over perfection.

The app is not about competing with others.

It is about becoming **slightly better than yesterday** for the sake of Allah.

---

# ✨ Core Features

## 🏠 Daily Dashboard

Your personal command center.

Features include:

- 👋 Personalized Islamic greeting
- 📅 Gregorian & Hijri Calendar
- 📊 Daily Ihsan Score
- 📈 Daily Progress Overview
- 🎯 Today's Goals
- 🔥 Habit Streaks
- ⚡ Quick Actions

---

## 🕌 Next Prayer Card

Never miss a prayer again.

Track all five daily prayers:

- 🌅 Fajr
- ☀️ Dhuhr
- 🌤 Asr
- 🌇 Maghrib
- 🌙 Isha

Features:

- Dynamic prayer countdown
- Reminder toggles
- Upcoming prayer display
- Local prayer time support
- Prayer completion tracking

---

## 📖 Spiritual Habit Hub

Strengthen both your **Deen** and **Dunya**.

### Deen

- 📖 Quran Reading Goals
- 📚 Islamic Reading Tracker
- 🤲 Daily Dhikr
- 🕌 Salah Consistency
- 📅 Weekly Reflection

### Health

- 💧 Water Intake
- 🏋️ Workout Tracking
- 😴 Sleep Monitoring
- 🚶 Daily Steps
- ❤️ Healthy Habit Metrics

---

## 💡 Wisdom of the Day

Every day begins with authentic Islamic reminders.

Includes:

- 📜 Authentic Hadith
- 🌿 Daily Reflection
- ❤️ Motivational Insights
- ☀️ Positive Daily Mindset

---

## 📊 Progress & Analytics

Measure consistency instead of perfection.

Features include:

- 📅 Weekly Progress Reports
- 📈 Habit Analytics
- 🏆 Achievement Badges
- 📄 Beautiful PDF Progress Export
- 📊 Personal Statistics
- 🔥 Streak Tracking

---

# 🧱 Why Bunyan?

Unlike traditional habit trackers,

**Bunyan combines:**

- 🕌 Spiritual Growth
- 💪 Physical Wellbeing
- 📚 Knowledge
- 🧠 Discipline
- ❤️ Character Development

into one beautiful experience.

---

# 🛠 Tech Stack

| Layer | Technology |
|--------|------------|
| **Frontend** | React + TypeScript |
| **Mobile** | React Native + Expo |
| **UI Components** | Tailwind CSS + NativeWind |
| **Validation** | Zod |
| **Database ORM** | Drizzle ORM |
| **Database** | PostgreSQL |
| **Package Manager** | pnpm Workspaces |
| **State Management** | Zustand |
| **Authentication** | Supabase Auth |
| **Backend** | Supabase |
| **Storage** | Supabase Storage |
| **Charts** | Victory Native |
| **Icons** | Lucide React |
| **PDF Reports** | Expo Print / PDF |
| **Deployment** | Expo EAS |

---

# 🏗 Architecture

The project follows a scalable **Monorepo Architecture**.

```text
bunyan/

├── apps/
│   ├── mobile/
│   ├── web/
│   └── docs/
│
├── lib/
│   ├── api/
│   ├── api-zod/
│   ├── auth/
│   ├── components/
│   ├── constants/
│   ├── db/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── themes/
│   ├── types/
│   └── utils/
│
├── scripts/
│
├── assets/
│   ├── icons/
│   ├── images/
│   ├── fonts/
│   └── illustrations/
│
├── packages/
│
├── .github/
│
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

---

# 🚀 Getting Started

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/bunyan.git

cd bunyan
```

---

## 2️⃣ Install Dependencies

```bash
pnpm install
```

---

## 3️⃣ Configure Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL=

SUPABASE_URL=

SUPABASE_ANON_KEY=

EXPO_PUBLIC_API_URL=
```

---

## 4️⃣ Run Development

### Mobile

```bash
pnpm mobile
```

or

```bash
cd apps/mobile

pnpm start
```

---

### Web

```bash
pnpm web
```

---

## 5️⃣ Run Database Migrations

```bash
pnpm db:generate

pnpm db:migrate
```

---

## 6️⃣ Build Production

```bash
pnpm build
```

---

# 📱 Screens

- Splash Screen
- Authentication
- Onboarding
- Home Dashboard
- Prayer Tracker
- Quran Tracker
- Health Dashboard
- Goals
- Progress Analytics
- Wisdom of the Day
- Profile
- Settings

---

# 🤝 Contributing

Contributions are always welcome!

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes

```bash
git commit -m "Add amazing feature"
```

4. Push your branch

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

---

# 📌 Roadmap

- [ ] Prayer Time API Integration
- [ ] Ramadan Mode
- [ ] Daily Adhkar
- [ ] AI Reflection Assistant
- [ ] Community Accountability Groups
- [ ] Monthly Reports
- [ ] Apple Health Integration
- [ ] Google Fit Integration
- [ ] Offline Mode
- [ ] Push Notifications
- [ ] Multi-language Support
- [ ] Widget Support

---

# ❤️ Philosophy

> **Consistency is beloved to Allah, even if the deeds are small.**

Bunyan exists to help Muslims cultivate habits that endure—through sincerity, discipline, and reliance upon Allah.

---

<div align="center">

### 🌙 May Allah make this project beneficial for the Ummah.

**Built with ❤️, ☕, and Du'a.**

If you found this project helpful, consider giving it a ⭐ on GitHub.

</div>
