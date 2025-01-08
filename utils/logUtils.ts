import * as fs from "fs/promises";
import * as path from "path";

const logsDir = path.resolve("logs"); // Directory for log files
const logFilePath = path.join(logsDir, "test-case.log");

// Ensure a directory exists; create if it doesn't
async function initializeLogFile() {
  try {
    await fs.writeFile(logFilePath, ""); // Clears the file
  } catch (err) {
    console.error("Failed to initialize log file:", err);
  }
}

// Log a message with timestamp
export async function logMessage(message: string) {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - ${message}\n`;

  try {
    await fs.appendFile(logFilePath, logEntry);
  } catch (err) {
    console.error("Failed to write to log file:", err);
  }

  console.log(message);
}

// Initialize log file on startup
(async function initialize() {
  await initializeLogFile();
})();
