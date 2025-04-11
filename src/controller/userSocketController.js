import { DateTime } from "luxon";
import { User } from "../models/users.js";

const COINS_PER_INTERVAL = process.env.COINS_PER_INTERVAL || 5;
const MINING_INTERVAL_MINUTES = process.env.MINING_INTERVAL_MINUTES || 60;
const MAX_DAILY_COINS = process.env.MAX_DAILY_COINS || 100;
const OFFLINE_THRESHOLD_MINUTES = process.env.OFFLINE_THRESHOLD_MINUTES || 5;

export default function (io, socket) {
  socket.on("ping", async () => {
    try {
      const userId = socket.handshake?.query?.userId;
      if (!userId) return socket.emit("error", { message: "Unauthorized" });

      const user = await User.findByPk(userId);
      if (!user) return socket.emit("error", { message: "User not found" });

      const now = DateTime.utc();

      // Reset minedToday if it's a new UTC day
      const lastMinedAt = user.lastMinedAt
        ? DateTime.fromJSDate(user.lastMinedAt).toUTC()
        : null;

      if (!lastMinedAt || now.startOf("day") > lastMinedAt.startOf("day")) {
        user.minedToday = 0;
      }

      const lastPingAt = user.lastPingAt
        ? DateTime.fromJSDate(user.lastPingAt).toUTC()
        : null;

      // If no ping before or offline > 5 mins, reset sessionStartAt
      const isNewSession =
        !lastPingAt ||
        now.diff(lastPingAt, "minutes").minutes > OFFLINE_THRESHOLD_MINUTES;

      if (isNewSession) {
        user.sessionStartAt = now.toJSDate();
        user.lastPingAt = now.toJSDate();
        await user.save();

        return socket.emit("mining-update", {
          minedToday: user.minedToday,
          newCoins: 0,
          message: "⛏️ New mining session started",
        });
      }

      // Calculate mining interval
      const sessionStart = DateTime.fromJSDate(user.sessionStartAt).toUTC();
      const onlineMinutes = now.diff(sessionStart, "minutes").minutes;

      let leftoverMinutes = 0;

      if (lastMinedAt) {
        const minedUntil = lastMinedAt;
        const prevSessionEnd = user.prevSessionEndAt
          ? DateTime.fromJSDate(user.prevSessionEndAt).toUTC()
          : minedUntil;

        leftoverMinutes = Math.max(
          0,
          prevSessionEnd.diff(minedUntil, "minutes").minutes
        );
      }

      const totalMiningMinutes = onlineMinutes + leftoverMinutes;
      const intervals = Math.floor(totalMiningMinutes / MINING_INTERVAL_MINUTES);
      const coinsToAdd = Math.min(
        intervals * COINS_PER_INTERVAL,
        MAX_DAILY_COINS - user.minedToday
      );

      // Save progress
      if (coinsToAdd > 0) {
        user.balance += coinsToAdd;
        user.minedToday += coinsToAdd;

        const usedMiningTime = intervals * MINING_INTERVAL_MINUTES;
        user.lastMinedAt = now
          .minus({ minutes: totalMiningMinutes - usedMiningTime })
          .toJSDate();

        user.prevSessionEndAt = now.toJSDate();
        user.sessionStartAt = now.toJSDate(); // restart session
      }

      // Always update last ping time
      user.lastPingAt = now.toJSDate();
      await user.save();

      socket.emit("mining-update", {
        minedToday: user.minedToday,
        newCoins: coinsToAdd,
        message:
          coinsToAdd > 0
            ? `✅ Mined ${coinsToAdd} coin(s)!`
            : "⏳ Keep going! Not enough time passed yet.",
      });
    } catch (err) {
      console.error("Mining error:", err);
      socket.emit("error", { message: "Mining failed", error: err.message });
    }
  });
}
