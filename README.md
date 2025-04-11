## 🧪 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/rishpalthind/nodeAssignment.git
cd mining-app
# ⛏️ Virtual Coin Mining System

npm install
npm run dev
npm start
npm run lint

A backend application built using **Node.js**, **Express.js**, and **Socket.IO** to simulate a **virtual mining system**. Users can earn coins by staying online and pinging the server periodically. Coins can later be claimed through a secure API.

---

## 🚀 Features

- ⛏️ **Earn Coins by Activity** – Users mine coins every hour when online and active.
- 🧮 **Mining Cap** – Maximum of 100 coins can be mined per UTC day.
- ⌛ **Inactivity Handling** – User is considered offline if no ping for 5 minutes.
- 🪙 **Claim Coins API** – Users can claim mined coins (up to 10 per request).
- 🔁 **Mining Time Persistence** – Partial hours are preserved and accumulated.
- ⚡ **WebSocket Support** – Real-time ping using Socket.IO.
- ✅ **Validation** – API input is validated using Joi.

---

## 🧱 Tech Stack

- **Node.js**
- **Express.js**
- **Sequelize + SQLite**
- **Socket.IO**
- **Luxon** – for date/time
- **Joi** – for request validation

---

## 📦 Dependencies & Purpose

| Package           | Purpose                                    |
|-------------------|--------------------------------------------|
| `express`         | Web framework for routing and middleware   |
| `socket.io`       | WebSocket-based real-time mining pinging   |
| `sequelize`       | ORM for DB modeling                        |
| `sqlite3`         | Database for storing user/mining data      |
| `luxon`           | UTC date/time tracking and comparisons     |
| `bcrypt`          | Password hashing                          |
| `dotenv`          | Environment variable management            |
| `joi`             | Schema validation for input (claim API)    |
| `jsonwebtoken`    | (Optional) Token-based auth if added later |

### Dev Dependencies

| Package              | Purpose                                     |
|----------------------|---------------------------------------------|
| `nodemon`            | Live-reloading for development              |
| `eslint`             | Code linting                                |
| `eslint-config-airbnb` | Airbnb JS style guide                     |
| `eslint-plugin-import`, `jsx-a11y` | ESLint rules/plugins         |

---


---

## 📡 WebSocket Event: Mining Ping

Clients must emit `ping` events periodically (recommended every 1 minute for testing, every 5 minutes for production) to keep mining.

```js
socket.emit("ping");
📡 WebSocket Usage

const socket = io("http://localhost:3000", {
  query: { userId: 1 }
});
setInterval(() => {
  socket.emit("ping");
}, 60000); // 1 minute
