# AGENTS.md
 
## Project Overview

Mental Drawer is a  website built with Docsify. It's a static site that serves markdown documentation files with client-side rendering.

Live site: https://okmi-mizu.github.io/mental-drawer/

## Architecture

This is a Docsify-based documentation site with the following structure:

- **docs/**: Contains all documentation content and assets
  - `index.html`: Main entry point that configures Docsify (sets project name, enables sidebar, configures subMaxLevel)
  - `README.md`: Homepage content
  - `_sidebar.md`: Navigation sidebar configuration
  - Individual `.md` files: Documentation pages (e.g., Depth.md, contact.md)
  - `libs/`: Custom JavaScript libraries
    - `docsify-4.js`: Local copy of Docsify framework
    - `theme-switcher.js`: Custom theme switching functionality

The site uses client-side rendering - all markdown files are loaded and rendered in the browser by Docsify.

## Common Commands

### Development Server
```bash
docsify serve ./docs
```
Starts local development server to preview the documentation site.

### Install Docsify CLI
```bash
npm i docsify-cli -g
```
Installs Docsify CLI globally (required for local development).

### Git Workflow

Custom git aliases are configured for this repository:

- **Pull from remote (main branch):**
  ```bash
  git-main-pull
  ```
  Gets files from remote repository and merges them into local repository.

- **Push to remote (main branch):**
  ```bash
  git-main-push
  ```
  Pushes local commits to remote repository and deploys to the website.

Note: The main branch is `main` and the site is published via GitHub Pages.

## Content Editing

All content is written in Markdown and stored in the `docs/` directory. To add new pages:

1. Create a new `.md` file in `docs/`
2. Add a link to it in `docs/_sidebar.md` for navigation
3. Test locally with `docsify serve ./docs`
4. Commit and push to deploy

The Docsify configuration in `docs/index.html` controls site-wide settings like sidebar behavior and maximum subheading depth.
