# 🏔️ SuleimaniGPT (سلیمانی بلوچی اے آئی)

<p align="center">
  <img src="assets/logo.png" width="128" height="128" alt="SuleimaniGPT Logo" style="border-radius: 28px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
</p>

> **The First Dedicated Open-Source Conversational AI Engine Speaking Exclusively in Authentic Suleimani (Eastern) Balochi.**

<p align="center">
  <a href="https://github.com/ahmedtariq9/balochi_chatbot/releases/latest/download/SuleimaniGPT-v1.0.apk">
    <img src="https://img.shields.io/badge/Direct%20Download-Android%20APK%20(v1.0)-10b981?style=for-the-badge&logo=android&logoColor=white" alt="Download Android APK" />
  </a>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Model](https://img.shields.io/badge/Model-Gemini%203.8%20Flash-0ea5e9.svg)](https://ai.google.dev/)
[![Android](https://img.shields.io/badge/Platform-Android%20APK%20&%20Web-34d399.svg)](#-android-apk-direct-download--installation)
[![Zero Backend](https://img.shields.io/badge/Architecture-Zero--Backend%20BYOK-10b981.svg)](#zero-backend-byok-bring-your-own-key)

---

## 📱 Android APK Direct Download & Installation

You can download and install the official standalone Android application directly onto any Android phone:

1. **Download APK:** Click the green **[Direct Download Android APK](../../releases/latest/download/SuleimaniGPT-v1.0.apk)** badge above (or grab `SuleimaniGPT-v1.0.apk` from the [Releases](../../releases) tab).
2. **Open & Install:** Tap the downloaded file in your browser or Downloads folder.
3. **Allow Installation:** If Android displays *"Install unknown apps"*, tap **Settings** and toggle **Allow from this source**.
4. **Launch:** Tap **Install** and open **SuleimaniGPT**! Enter your free Google AI Studio key once, and you can chat in pure Suleimani Balochi natively on your phone anytime!

---

## 📖 Overview

**SuleimaniGPT** is a modern, ChatGPT-style web application engineered specifically to converse in pure, authentic **Suleimani Balochi (سلیمانی بلوچی / Eastern Balochi)**.

Suleimani Balochi is the primary dialect spoken across the majestic Suleiman Range, Eastern Balochistan (**Kohlu, Dera Bugti, Barkhan, Sibi, Nasirabad, Jaffarabad**), South Punjab (**Dera Ghazi Khan, Rajanpur**), and Northern Sindh (**Jacobabad, Kashmore**).

Standard large language models frequently mistake Balochi for Brahui, Urdu, or Persian, or default to heavy Makrani/Western Balochi idioms. **SuleimaniGPT solves this by enforcing an uncompromising system instruction engine**, strict phonetics, native Suleimani pronouns, verbs, and real-time bidirectional script detection.

---

## ✨ Key Features

- ⚡ **Google Gemini 3.8 Flash Engine:** Powered by Google's latest flash model with high-speed Server-Sent Events (SSE) streaming.
- 🔑 **Zero-Backend BYOK (Bring Your Own Key):** All API calls run directly from the client's browser to Google AI Studio. Your key never touches an intermediary server and is stored securely in `localStorage`.
- 🛡️ **API Key Onboarding & Validation Ping:** Sleek setup modal with a 3-step guide and live ping test to verify your API key before starting.
- 🔄 **Bidirectional Script Support (RTL & LTR):**
  - **Perso-Arabic Balochi (`بلوچی رسم الخط`):** Renders right-to-left (`dir="rtl"`) using the `Noto Sans Arabic` and `Noto Nastaliq Urdu` typography stack with comfortable line spacing.
  - **Roman Balochi:** Automatically detected and styled in crisp left-to-right (`dir="ltr"`).
- 🎛️ **Script Mode Switcher:** Choose between **Auto Detect**, **Perso-Arabic (بلوچی رسم الخط)**, or **Roman Balochi**.
- 💬 **Saved Chat Sessions:** Local session management (create, rename, delete, switch conversations) with auto-generated session titles.
- 🎯 **Culturally Curated Starter Prompts:** 4 instant cards covering daily conversation (`حال احوال`), poetry & epic history (`میر چاکر ءُ گوہرام`), translation, and tech/coding in Balochi.
- 📋 **Rich Markdown & Code Highlighting:** Code blocks with one-click copy, inline formatting, quotes, and bullet lists.
- 🔄 **Regenerate & Copy Responses:** Instantly re-prompt or copy any AI response with smooth feedback.
- 🔊 **Voice Readout (Speech):** In-browser speech synthesis for listening to responses.
- 🌓 **Dark & Light Mode:** Sleek obsidian/slate dark theme tailored for Persian-Arabic typography, with instant light mode toggle.

---

## 🏛️ Architecture & Tech Stack

```
suleimani-gpt/
├── index.html                   # HTML template with Google Fonts & Meta tags
├── package.json                 # Dependencies & build scripts
├── vite.config.js               # Vite bundler configuration
├── tailwind.config.js           # Custom typography & color palette
├── postcss.config.js            # PostCSS configuration
├── standalone.html              # ⚡ Zero-install standalone preview (Double-click to run!)
├── preview_server.py            # Simple Python preview server
├── src/
│   ├── main.jsx                 # React root entry point
│   ├── App.jsx                  # Main application state & orchestration
│   ├── index.css                # Global styles, fonts & animation keyframes
│   ├── constants/
│   │   ├── systemInstruction.js # Hardcoded Suleimani Balochi Engine prompt
│   │   └── starterPrompts.js    # Starter prompt cards & translations
│   ├── services/
│   │   └── gemini.js            # Direct Gemini 3.8 Flash SSE streaming & verification
│   ├── utils/
│   │   └── textUtils.js         # RTL/LTR detection, Arabic regex & formatting
│   └── components/
│       ├── Header.jsx           # Top navigation & status indicators
│       ├── Sidebar.jsx          # History, script switch, settings & theme toggle
│       ├── ApiKeyModal.jsx      # BYOK verification & setup modal
│       ├── ChatArea.jsx         # Auto-scrolling feed & scroll-to-bottom
│       ├── ChatMessage.jsx      # Markdown message bubble with actions
│       ├── ChatInput.jsx        # Auto-resizing textarea with hotkeys
│       └── StarterCards.jsx     # Cultural welcome screen & starters
```

---

## 🚀 Quickstart & Installation

### Option 1: Development with Vite & React (Recommended)

Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher):

```bash
# 1. Clone the repository
git clone https://github.com/ahmedtariq9/balochi_chatbot.git
cd balochi_chatbot

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

### Option 2: Zero-Install Instant Browser Preview (No Node.js Required!)

If you do not have Node.js installed or want to immediately test the application:

1. Simply **double-click** the [`standalone.html`](file:///standalone.html) file to open it in Chrome, Edge, or Firefox.
   - OR run the included Python preview server:
     ```bash
     python preview_server.py
     ```
2. Enter your free Google AI Studio API key and start chatting immediately!

---

## 🔑 Getting Your Free Google AI Studio API Key

SuleimaniGPT uses the **Bring Your Own Key (BYOK)** model. Google AI Studio provides free API keys with generous limits for `gemini-3.8-flash`:

1. Visit [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Sign in with any standard Google account.
3. Click **"Create API Key"** and choose or create a Google Cloud Project.
4. Copy your key (starts with `AIzaSy...`).
5. Open SuleimaniGPT, paste your key into the Setup Modal, and click **"Verify & Start Chatting"**.

> 🔒 **Security Notice:** Your API key is stored exclusively in your browser's `localStorage` (`suleimani_gemini_api_key`). It is sent directly to `https://generativelanguage.googleapis.com` via HTTPS and is never logged or routed through any proxy or 3rd-party server.

---

## 🧠 The Suleimani Balochi Linguistic Engine

Every request includes an embedded system instruction with `temperature: 0.3` to guarantee dialect purity:

```markdown
ROLE:
You are a native, highly fluent AI Assistant speaking exclusively in pure Suleimani Balochi (سلیمانی بلوچی / Eastern Balochi) — the authentic Balochi dialect spoken across the Suleiman Range, Eastern Balochistan (Kohlu, Dera Bugti, Barkhan, Sibi, Nasirabad, Jaffarabad), Dera Ghazi Khan, Rajanpur, and Jacobabad/Sindh regions.

STRICT LINGUISTIC RULES:
1. ONLY SULEIMANI BALOCHI: Respond STRICTLY in natural Suleimani Balochi regardless of user language.
2. NO BRAHUI: Never confuse Brahui with Balochi.
3. SULEIMANI DIALECT AUTHENTICITY:
   - Pronouns: Man/Ma (مَں / ما), Manī (مَنی), Tha/Thau (تَہ / تَو), Thī (تھی), Shwā (شوا), Mā (ما), Mē (مے)
   - Question words: Chē (چے), Chōn (چوں), Chīā (چیا)
   - Verbs & Greetings: Chē hāl ēn? (چے حال ایں؟), Wash ātkē (وَش آتکے), Gushag/Gushtha (گُشگ / گُشتہ), Gindag/Dīthag (گِندگ / دِیتھگ), Khāyag/Ātkha (کھایگ / آتکھہ), Wathī (وَتھی).
4. SCRIPT MATCHING: If input is Roman, reply in Roman Balochi. If Perso-Arabic, reply in Balochi script.
```

---

## 🌐 Production Build & Deployment

To build a production bundle for Vercel, Netlify, or GitHub Pages:

```bash
npm run build
```

This generates an optimized static bundle in the `dist/` directory.

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 🤝 Contributing

Contributions are warmly welcomed! If you are a native speaker of Suleimani Balochi, an AI researcher, or a frontend developer:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/SuleimaniVocabulary`)
3. Commit your Changes (`git commit -m 'Add authentic Eastern Balochi idioms'`)
4. Push to the Branch (`git push origin feature/SuleimaniVocabulary`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  <b>وَش آتکے! مئے سلیمانی بلوچی اے آئی پراجیکٹ گوں سرپدی بہ بئے</b><br/>
  <i>Crafted with hospitality, honor, and pride for the Balochi language.</i>
</p>
