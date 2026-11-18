# 📱 SuleimaniGPT Mobile (سلیمانی بلوچی اے آئی)

> **Complete Native Mobile Application (Android & iOS) for Pure Suleimani Balochi AI powered by Google Gemini 3.8 Flash.**

Built with **React Native (Expo)**, **AsyncStorage (BYOK)**, and bidirectional typography support.

---

## 🚀 How to Run on Your Mobile Phone in 2 Minutes

### Method 1: Instant Test on your Phone via Expo Go (No APK required!)
1. Download **Expo Go** from Google Play Store (Android) or Apple App Store (iOS).
2. Open terminal in the `mobile/` directory:
   ```bash
   cd mobile
   npm install
   npx expo start
   ```
3. A QR code will appear in your terminal.
4. Scan the QR code using the **Expo Go** app on Android or the Camera app on iPhone.
5. The **SuleimaniGPT** mobile app will launch natively on your phone immediately!

---

### Method 2: Build an Android APK file (.apk)

To build a standalone installable APK file for Android:

```bash
# 1. Install EAS CLI globally
npm install -g eas-cli

# 2. Log in or create free Expo account
eas login

# 3. Build APK
eas build -p android --profile preview
```
EAS will generate a direct download link for the `.apk` file that you can install directly on any Android smartphone.

---

## 🔑 Features in Mobile App

- 📱 **Pure Native Mobile UI:** Designed with bottom sheets, native haptic feedback, safe area insets, and smooth scrolling.
- ⚡ **Gemini 3.8 Flash Engine:** Ultra-fast responses speaking strictly in authentic Eastern Balochi.
- 🔒 **Zero-Backend BYOK:** Securely stores your Google AI Studio API key in `AsyncStorage`.
- 🔄 **Bidirectional (RTL / LTR) Text Support:** Automatic text alignment for Balochi Perso-Arabic script and Roman Balochi.
- 🔊 **Voice Readout (Speech):** In-app text-to-speech engine to listen to Balochi responses aloud.
- 📋 **One-Tap Clipboard Copy:** Copy any message directly to the device clipboard.
