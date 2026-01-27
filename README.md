# Spixi Mini Apps Website

The official repository for the Spixi Mini Apps directory and builder tools. This website hosts a curated list of Mini Apps for the Spixi IM platform and provides tools for developers to package and distribute their own apps.

## 🚀 Features

- **Mini App Directory**: Browse, search, and discover Mini Apps for Spixi.
- **Instant Installation**: Scan QR codes to install apps directly into Spixi.
- **Mini App Packer**: A client-side tool to package your HTML5 apps into `.spixi` and `.zspixiapp` formats ready for distribution.
- **Internationalization**: Support for multiple languages.
- **Dark/Light Mode**: Adaptive UI for all environments.

## 🛠️ Technology Stack

- **Framework**: [Nuxt 3](https://nuxt.com)
- **UI**: [Tailwind CSS](https://tailwindcss.com) & [Flowbite](https://flowbite.com)
- **Animations**: [GSAP](https://gsap.com)
- **Language**: TypeScript & Vue 3 Composition API
- **Utilities**: [JSZip](https://stuk.github.io/jszip/) (Archiving), [qrcode.vue](https://github.com/scopewu/qrcode.vue) (QR Generation)
- **Deployment**: GitHub Pages

## 📦 Project Setup

### Prerequisites

- Node.js (Latest LTS recommended)
- `pnpm` (This project enforces the use of pnpm)

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

### Build

Build the application for production:

```bash
pnpm generate
```

The output will be in the `.output/public` directory, ready for deployment to GitHub Pages.

## 🏗️ Creating a Mini App

To create a Mini App for Spixi, your project structure should look like this:

```
my-app/
├── appinfo.spixi    # Metadata file (Required)
├── icon.png         # App icon (Required for Packer)
└── app/
    └── index.html   # Entry point (Required)
    └── ...          # Other assets (js, css, images)
```

### `appinfo.spixi` Format

The `appinfo.spixi` file is a key-value pair configuration file used by the Packer to generate the app metadata.

**Supported Fields:**

```ini
id = com.example.myapp        # Unique App ID
name = My Awesome App         # Display Name
version = 1.0.0               # App Version
publisher = Your Name         # Publisher Name
caVersion = 0                 # CA Version (Default: 0)
capabilities =                # App Capabilities
minUsers =                    # Minimum Users
maxUsers =                    # Maximum Users
protocols =                   # Supported Protocols
```

Once your app folder is ready, use the **Mini App Packer** on the website (or locally via `/builder`) to package it. The packer will generate:
1.  `your-app-name.zspixiapp`: The zipped application code.
2.  `your-app-name.spixi`: The metadata file containing checksums and download info.
3.  `your-app-name.png`: The application icon.

## 📂 Project Structure

- `pages/`: Application routes (`index.vue`, `builder.vue`, etc.)
- `components/`: Reusable Vue components
- `layouts/`: Page layouts
- `public/`: Static assets
- `lang/`: I18n translation files
- `packer/`: Standalone packer resources
- `plugins/`: Nuxt plugins

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
