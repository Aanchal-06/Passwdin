# Passwdin - Advanced Password Strength Analyzer

Passwdin is a modern, real-time password analysis tool designed to help users create highly secure passwords. It goes beyond simple character counting by analyzing mathematical entropy and detecting common patterns used in dictionary attacks.

## 🚀 Key Features

- **Real-time Entropy Calculation:** Measures the mathematical unpredictability of your password in bits.
- **Visual Strength Meter:** A dynamic, color-coded bar that changes from Red (Weak) to Green (Very Strong) as you type.
- **Smart Pattern Detection:** Flags common security risks including:
  - Dictionary words (e.g., "admin", "password").
  - Keyboard walks (e.g., "qwerty", "asdfgh").
  - Repeated character sequences (e.g., "aaa").
  - Sequential numbers and years.
- **Security Penalty Logic:** Automatically slashes the entropy score if a common pattern is detected, providing a realistic "Crack Time" estimate against dictionary attacks.
- **Composition Breakdown:** Live tracking of uppercase letters, lowercase letters, digits, and symbols.
- **Password Generator:** A cryptographically secure generator that creates 18-character high-entropy passwords.
- **Breach Checker:** Integration with HaveIBeenPwned (via K-Anonymity) to check if your password has appeared in known data breaches without ever sending your actual password to the server.
- **UX Polish:** Includes a "Show/Hide" toggle and a "Copy to Clipboard" feature with an offline fallback.

## 🛠️ Technical Architecture

- **Frontend:** Built with modern HTML5, Vanilla CSS, and JavaScript. Uses [Tabler Icons](https://tabler-icons.io/) for a clean, professional UI.
- **Backend:** Powered by **Python (FastAPI)**. While the primary logic is currently handled client-side for speed, the backend provides an extensible API for deeper analysis.
- **Security:** Uses `crypto.getRandomValues` for generation and `SHA-1` hashing for breach checking.

## 📂 Project Structure

```text
Passwdin/
├── backend/
│   ├── main.py             # FastAPI Server & API Logic
│   ├── requirements.txt    # Python Dependencies
│   └── venv/               # Virtual Environment
└── frontend/
    ├── index.html          # UI Layout & Structure
    ├── style.css           # Modern, Responsive Styling
    └── script.js           # Core Logic & Real-time Interaction
```

## 🚥 How to Run

### 1. Prerequisites
- Python 3.x installed.

### 2. Setup the Backend
Open your terminal (if using **Fish shell**, follow these commands):
```fish
cd Passwdin
source backend/venv/bin/activate.fish
python backend/main.py
```
*The server will start at `http://localhost:8000`.*

### 3. Run the Frontend
Open a **new** terminal window:
```fish
cd Passwdin
python3 -m http.server 8080 --directory frontend
```
*Access the app at **`http://localhost:8080`**.*

## 🧪 Security Logic Note
Passwdin uses the formula: `Entropy = Length × log2(Pool Size)`. 
However, if a **Dictionary Pattern** is detected, the entropy score is penalized by **75%**. This reflects the reality that hackers do not just brute-force; they use smart lists to crack common passwords in seconds.

---
*Created as a secure-by-default open source project.*
