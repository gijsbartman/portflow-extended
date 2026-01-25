# Portflow Extended

Portflow Extended is a production-grade Chrome extension designed to enhance the Portflow experience. It provides detailed insights into your progress, including skill levels, evaluation counts, and missing requirements for your specific curriculum.

## Getting Started

There are a few ways to get up and running, depending on whether you are developing features or just want to use the extension.

### Development

If you are contributing code, this is the recommended way to work.

```bash
pnpm install
pnpm dev
```

This command opens a pristine instance of Chrome with the extension automatically installed and watched for changes.

**Note on Persistence:**
By default, `pnpm dev` creates a temporary Chrome profile. If you want to persist your login session between restarts, create a `web-ext.config.ts` file in the root directory (this file is gitignored) with the following content:

```ts
// web-ext.config.ts
import { defineWebExtConfig } from "wxt"

export default defineWebExtConfig({
  chromiumArgs: ["--user-data-dir=./.wxt/chrome-data"],
})
```

### Other Browsers

This extension is built with WXT, which supports multiple browsers. While Chrome is the primary target, you can run or build for Firefox using the included scripts:

**Firefox Development:**

```bash
pnpm dev:firefox
```

**Firefox Build:**

```bash
pnpm build:firefox
# OR
pnpm zip:firefox
```

### Installation

If you want to use the extension without the dev server, you have three options to obtain the package:

1.  **Download a Release**: Go to the Releases page, download the `.zip` file, and unzip it.
2.  **Build from Source**: Run `pnpm build` to create a production build in `.output/chrome-mv3`.
3.  **Zip from Source**: Run `pnpm zip` to create a zip file in `.output/`, then unzip it.

#### Loading into Chrome

Once you have the unzipped folder (either from download or build):

1.  Open Chrome and navigate to `chrome://extensions/`.
2.  Enable **Developer mode** in the top-right corner.
3.  Click **Load unpacked**.
4.  Select the folder containing the extension (e.g., `.output/chrome-mv3` or your unzipped folder).

You're all set! Note that you may need to reload the extension from this page if you make updates to the files manually.

## Features

- **Level Checking**
  Automatically checks your progress against course requirements for skills, HBO-I, and KPM.
  
  <img width="362" height="342" alt="Screenshot 2026-01-25 at 13 48 41" src="https://github.com/user-attachments/assets/2fc04a29-ed1e-4e72-8fb1-1d556ecbc249" />

- **Detailed Insights**
  View exact evaluation counts and see exactly what is missing to reach the next level.
  
  <img width="361" height="370" alt="Screenshot 2026-01-25 at 13 49 41" src="https://github.com/user-attachments/assets/da3bd0fe-9f4c-46fa-85e9-9ce6bf364517" />

- **Seamless Integration**
  Injects stats directly into the Portflow interface and offers a comprehensive popup overview.

  <img width="1677" height="933" alt="Screenshot 2026-01-25 at 12 51 14" src="https://github.com/user-attachments/assets/0e7950ea-6804-4783-b790-de245af750b0" />

## Documentation

The codebase is structured to be intuitive:

- `entrypoints/`: Contains the popup, content scripts, and background logic.
- `src/components/`: Reusable React components using a centralized design system.
- `src/utils/`: core logic for level checking and data formatting.
- `assets/`: Global styles including the Tailwind theme configuration.

## Contributing

If you want to add contributions to this repository, please follow the instructions in [CONTRIBUTING.md](./CONTRIBUTING.md).

## Need help?

If you're struggling with something, checking lines of code or existing issues is your best bet. If you find a bug, please open an issue following our guidelines.
