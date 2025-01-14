import { execSync } from "child_process";
import { logMessage } from "./logUtils";
import * as fs from "fs/promises";
import * as path from "path";

// Command-line arguments
const args = process.argv.slice(2);
const isHeaded = args.includes("--headed");
const filteredArgs = args.filter((arg) => arg !== "--headed");
const headedMode = isHeaded ? "--headed" : "";
const testFiles = filteredArgs.join(" ");

// Environments Variables
const environments = {
  dev: {
    environmentName: "Development Environment",
    platform: "Web",
  },
  qa: {
    environmentName: "QA Environment",
    platform: "Web",
  },
};

// Validate environment
const ENV = process.env.ENV || "qa";
if (!Object.keys(environments).includes(ENV)) {
  console.error(
    `Invalid environment: ${ENV}. Supported environments are: dev, qa.`
  );
  process.exit(1);
}

const currentEnv = environments[ENV as keyof typeof environments];

// Directories and paths
const logsDir = path.resolve("logs");
const allureResultsDir = path.resolve("allure-results");
const allureReportDir = path.resolve("allure-report");
const logFilePath = path.join(logsDir, "test-case.log");
const playwrightResultsDir = path.resolve("test-results");

// Helper: Ensure a directory exists
const ensureDirectoryExists = async (dirPath: string) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    logMessage(`Failed to create directory ${dirPath}: ${error}`);
    throw error;
  }
};

// Helper: Delete a directory if it exists
const deleteDirectoryIfExists = async (dir: string) => {
  try {
    await fs.rm(dir, { recursive: true, force: true });
    logMessage(`Deleted existing directory: ${dir}`);
  } catch (error) {
    logMessage(`Failed to delete directory ${dir}: ${error}`);
  }
};

// Initialize directories and log file
const initializeEnvironment = async () => {
  try {
    // Ensure directories exist
    await Promise.all([
      ensureDirectoryExists(logsDir),
      ensureDirectoryExists(allureResultsDir),
    ]);

    // Clear and recreate necessary directories
    await Promise.all([
      deleteDirectoryIfExists(allureResultsDir),
      deleteDirectoryIfExists(allureReportDir),
      deleteDirectoryIfExists(playwrightResultsDir),
    ]);

    // Recreate cleared directories
    await ensureDirectoryExists(allureResultsDir);
    await fs.writeFile(logFilePath, "");

    logMessage(
      `🚀 Starting the test execution in ${currentEnv.environmentName}"
      }...`
    );
  } catch (error) {
    logMessage(`Error initializing environment: ${error}`);
    process.exit(1);
  }
};

// Generate environment details for report
const generateAllureFiles = async () => {
  const environmentFilePath = path.join(
    allureResultsDir,
    "environment.properties"
  );
  const environmentVariables = `Environment=${currentEnv.environmentName}\nPlatform=${currentEnv.platform}`;
  const executorFilePath = path.join(allureResultsDir, "executor.json");
  const executorData = {
    name: "Automation Executor",
    type: "Playwright Framework",
    reportName: `Allure Test Report - ${currentEnv.environmentName}`,
  };

  try {
    await fs.writeFile(environmentFilePath, environmentVariables);
    await fs.writeFile(executorFilePath, JSON.stringify(executorData, null, 2));
    logMessage("Generated Allure report files.");
  } catch (error) {
    logMessage(`Failed to generate Allure files: ${error}`);
    process.exit(1);
  }
};

// Execute Tests
const executeTests = async () => {
  const playwrightCommand = `ENV=${ENV} npx playwright test ${testFiles} ${headedMode}`;

  try {
    logMessage(`🚀 Executing command: ${playwrightCommand}`);
    execSync(playwrightCommand, {
      stdio: "inherit",
      env: { ...process.env, ENV },
    });
    logMessage(`✅ Test execution completed successfully.`);
  } catch (error: any) {
    logMessage(`❌ Error occurred during execution: ${error.message}`);
    process.exit(1);
  }
};

// Main Execution Flow
(async () => {
  await initializeEnvironment();
  await generateAllureFiles();
  await executeTests();
  logMessage("To generate the Allure report:");
  logMessage(
    "    ✅ allure generate ./allure-results --clean -o ./allure-report"
  );
  logMessage("To open the Allure report:");
  logMessage("    📊 allure open ./allure-report");

  logMessage("To open the HTML report:");
  logMessage("    📊 npx playwright show-report");
})();

// ----------------------
// **Usage Instructions**
// ----------------------
// 1) Install dependencies:
//    npm install
//
// 2) Run Test Cases:
//    i) Run All Test Cases:
//        a) npx ts-node utils/runTests.ts tests/
//
//    ii) Run Specific Test File:
//        a) npx ts-node utils/runTests.ts tests/specs/test.spec.ts
//
//    iii) Run Multiple Files:
//        a) npx ts-node utils/runTests.ts tests/specs/test1.spec.ts tests/specs/test2.spec.ts
//
// 3) Run Tests for Specific Environments:
//      a) ENV=dev npx ts-node utils/runTests.ts tests/
//      b) ENV=qa npx ts-node utils/runTests.ts tests/
//
// 4) Generate Allure Report:
//      a) allure generate ./allure-results --clean -o ./allure-report
//
// 5) Open Allure Report:
//      a) allure open ./allure-report
