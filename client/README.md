# :rocket: React + TypeScript + Vite Setup

This guide helps you quickly set up React, TypeScript, and Vite with ESLint for better code quality.

# :pin: Official Plugins
Vite offers two official plugins for React:

* [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
* [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


## :electric_plug: Install Required Packages
Run the following command to install dependencies:

```bash
npm install
```
## :hammer_and_wrench: Enable Type-Aware Linting (Recommended)
:one: Update eslint.config.js

```bash
export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});

```
:two: Use stricter ESLint rules by replacing:

* tseslint.configs.recommended ➝ tseslint.configs.recommendedTypeChecked
* (Optional) Add tseslint.configs.stylisticTypeChecked for style rules.


## :art: Add React-Specific Linting
:one: Install the plugin:

```bash
npm install eslint-plugin-react --save-dev
```
:two: Update eslint.config.js:

```bash
import react from 'eslint-plugin-react';

export default tseslint.config({
  settings: { react: { version: '18.3' } },
  plugins: { react },
  rules: {
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});

```


Your eslint.config.js file should look similiar to this:

```bash

import tseslint from '@typescript-eslint/eslint-plugin';
import react from 'eslint-plugin-react';

export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
  settings: {
    react: { version: '18.3' }
  },
  plugins: {
    react
  },

});

```
