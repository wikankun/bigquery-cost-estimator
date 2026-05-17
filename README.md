# BigQuery Cost Estimator Pro

<p align="center">
  <img src="public/bigquery-cost-estimator.png" width="128" alt="BigQuery Cost Estimator Pro Logo" />
</p>

<p align="center">
  <a href="https://github.com/wikankun/bigquery-cost-estimator/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/wikankun/bigquery-cost-estimator" alt="License" />
  </a>
  <a href="https://github.com/wikankun/bigquery-cost-estimator/releases/latest">
    <img src="https://img.shields.io/github/v/release/wikankun/bigquery-cost-estimator" alt="GitHub release" />
  </a>
  <a href="https://github.com/wikankun/bigquery-cost-estimator/stargazers">
    <img src="https://img.shields.io/github/stars/wikankun/bigquery-cost-estimator?style=flat" alt="GitHub stars" />
  </a>
  <a href="https://github.com/sponsors/wikankun">
    <img src="https://img.shields.io/github/sponsors/wikankun" alt="GitHub sponsors" />
  </a>
  <a href="https://github.com/wikankun/bigquery-cost-estimator/releases">
    <img src="https://img.shields.io/github/downloads/wikankun/bigquery-cost-estimator/total" alt="GitHub downloads" />
  </a>
  <a href="https://github.com/wikankun/bigquery-cost-estimator/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/wikankun/bigquery-cost-estimator" alt="GitHub contributors" />
  </a>
</p>

A powerful browser extension built with [WXT](https://wxt.dev/) that provides real-time cost estimates for Google BigQuery queries directly in the Google Cloud Console.

## Features

- **Real-time Cost Estimation**: Instantly see how much your query will cost as you type, based on the "bytes processed" validation message.
- **Global Pricing Support**: Includes on-demand pricing for 50+ Google Cloud regions, including BigQuery Omni (AWS/Azure).
- **Multi-Currency Support**: Convert cost estimates into your local currency (USD, EUR, GBP, JPY, IDR, CNY, AUD, SGD) with daily exchange rate sync.
- **Quota Guard**: Set a monthly budget limit and get warned before running queries that would exceed your quota.
- **Dashboard**: Track your daily and monthly BigQuery spend at a glance via the extension popup.
- **Native Integration**: Seamlessly blends into the BigQuery UI with localized formatting and smart status icons (✅ within budget, ⚠️ over limit).

## Tech Stack

- **Framework**: [WXT](https://wxt.dev/) (Web Extension Toolbox)
- **Language**: TypeScript
- **Bundler**: Vite
- **Storage**: `chrome.storage` (via WXT Storage API)
- **API**: [Currency API](https://github.com/fawazahmed0/currency-api) for exchange rates.

## Installation

### Install from Release (Pre-built)

1. Download the latest version from the [Releases](https://github.com/wikankun/bigquery-cost-estimator/releases) page.
2. **Chrome / Edge / Brave**:
   - Unzip the downloaded file.
   - Go to `chrome://extensions/`.
   - Enable **Developer mode** (toggle in the top right).
   - Click **Load unpacked** and select the unzipped folder.
3. **Firefox**:
   - Open Firefox and go to `about:debugging#/runtime/this-firefox`.
   - Click **Load Temporary Add-on...**.
   - Select the downloaded `.zip` file.

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/wikankun/bigquery-cost-estimator.git
   cd bigquery-cost-estimator
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start development mode**:
   ```bash
   pnpm dev
   ```
   This will open a browser instance with the extension loaded.

### Building for Production

To create a production-ready build in the `.output` directory:

```bash
pnpm build
```

## Configuration

Open the extension popup to configure:
- **Region**: Select your BigQuery dataset region for accurate pricing.
- **Currency**: Choose your preferred currency for display.
- **Monthly Limit**: Set a soft-block threshold for spend tracking.

## License

MIT
