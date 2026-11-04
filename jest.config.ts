import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Only run files in lib/ (pure utility tests — no DOM needed)
  testMatch: ["<rootDir>/lib/**/*.test.ts"],
  moduleNameMapper: {
    // Next.js path alias
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          // Allow test files to import without strict ESM rules
          module: "commonjs",
        },
      },
    ],
  },
};

export default config;
