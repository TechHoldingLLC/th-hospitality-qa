import * as fs from "fs/promises";
import * as path from "path";

const logsDir = path.resolve("logs"); // Directory for log files
const logFilePath = path.join(logsDir, "test-case.log");
const screenshotsDir = path.resolve("screenshots");

// Ensure a directory exists; create if it doesn't
async function ensureDirectoryExists(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (err) {
    console.error(`Failed to create directory ${dirPath}:`, err);
  }
}

// Create logs directory if it doesn't exist
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

// Clear all files in the screenshots directory
export async function clearScreenshots() {
  try {
    const files = await fs.readdir(screenshotsDir);
    for (const file of files) {
      const filePath = path.join(screenshotsDir, file);
      await fs.unlink(filePath);
    }
  } catch (err) {
    console.error("Failed to clear screenshots directory:", err);
  }
}

// Initialize directories and log file on startup
(async function initialize() {
  await ensureDirectoryExists(logsDir);
  await ensureDirectoryExists(screenshotsDir);
  await initializeLogFile();
})();
