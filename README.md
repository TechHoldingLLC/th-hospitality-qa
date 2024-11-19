# Coca Cola QA Automation Framework

This repository hosts the automation framework for the QA efforts of the Coca Cola project. Built using **Playwright** and **TypeScript**, the framework enables robust end-to-end testing to ensure application quality.

---

## **Getting Started**

### **Prerequisites**
1. Install **Node.js** and **npm** on your system.
   Verify installation:
   ```bash
   node -v
   npm -v
   ```
2. Install Playwright browser drivers:
   ```bash
   npx playwright install
   ```

---

### **Installation**
1. **Clone the repository:**
   ```bash
   git clone https://github.com/TechHoldingLLC/th-coke-qa.git (using HTTPS) or git@github.com:TechHoldingLLC/th-coke-qa.git (usign SSH)
   cd th-coke-qa
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

---

## **Running Tests**

### **Environment-Specific Configurations**
The framework uses configuration files for different environments, located in the `tests/config/` folder (e.g., `config.dev.ts`, `config.qa.ts`, `config.prod.ts`). Update these files with the required URLs and other settings.

### **Run Tests in Specific Environments**
To execute tests for a specific environment, set the `ENV` variable before running the test command.

#### Examples:
- **Development environment:**
  ```bash
  ENV=dev npx playwright test
  ```

- **QA environment:**
  ```bash
  ENV=qa npx playwright test
  ```

---

## **Coding Standards**

### **1. Variable Naming**
- Use descriptive and meaningful names.
  Example: `apiBaseUrl` instead of `url`.
- Use **camelCase** for local variables and **PascalCase** for global variables.
- Avoid ambiguous abbreviations.

### **2. Types**
- Explicitly define variable and function types for clarity.
- Leverage TypeScript's type inference when appropriate.
- Use TypeScript's type system to prevent runtime errors.

### **3. Interfaces and Classes**
- Follow **Object-Oriented Programming (OOP)** principles for maintainable and reusable code.

### **4. Functions**
- Use descriptive function names that clearly indicate their purpose.
- Keep functions concise, performing a single task.
- Use **arrow functions** where applicable for cleaner syntax.

### **5. Error Handling**
- Employ `try...catch` blocks for exception handling.
- Provide clear and actionable error messages for debugging.
- Implement strategies such as retries or logging as needed.

### **6. Asynchronous Programming**
- Use `async/await` for handling asynchronous operations.
- Handle errors gracefully within asynchronous code.

---

## **Page Object Model (POM)**
The framework uses the **Page Object Model (POM)** design pattern to:
- Promote code reusability.
- Simplify maintenance.
- Enhance readability.

**Structure:**
- Each web page is represented as a separate class under the `tests/pageObjects/` directory.
- Common actions (e.g., login, navigation) are encapsulated in these classes, making tests cleaner and more modular.

---

## **Key Features**
1. **Scalable Framework**: Designed for multi-environment execution.
2. **Modular Design**: Incorporates POM for maintainability.
3. **Flexible Configuration**: Environment-specific settings for dynamic testing needs.
4. **TypeScript Support**: Strong typing for improved code quality and reliability.
