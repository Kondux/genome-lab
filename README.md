<div align="center">
<h1>🧬Genome Lab by Kondux🧬</h1>
  
![GitHub stars](https://img.shields.io/github/stars/Kondux/genome-lab?style=social)&nbsp;&nbsp;&nbsp;
![GitHub forks](https://img.shields.io/github/forks/Kondux/genome-lab?style=social)&nbsp;&nbsp;&nbsp;
![GitHub issues](https://img.shields.io/github/issues/Kondux/genome-lab)&nbsp;&nbsp;&nbsp;
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
<br><br>
[![Discord](https://img.shields.io/badge/Discord-join%20chat-blue.svg)](http://Kondux.gg)&nbsp;&nbsp;&nbsp;
[![Twitter Follow](https://img.shields.io/twitter/follow/kondux.svg?style=social&label=Follow)](https://twitter.com/Kondux_KNDX)&nbsp;&nbsp;&nbsp;
[![Kondux Info page](https://img.shields.io/badge/Kondux-News-blue.svg)](https://www.kondux.info)
</div>

Welcome to [Genome Lab](https://kondux.github.io/genome-lab) by
[Kondux](https://www.kondux.io), where we are forging the future of digital
genetics. Dive into an ecosystem where your creativity meets our technology,
enabling you to encode and decode the very building blocks of digital life –
kNFTs (Kondux Non-Fungible Tokens).

## Explore Digital Genetics

- **Encode DNA**: Utilize our Data-Driven Encryption to represent your asset as complex DNA strands.  
- **Decode DNA**: Unravel the strands to reveal the assets they represent.  
- **kNFTs**: Discover the potential of dynamic Non-Fungible Tokens.

## Our Vision

At Kondux, we are committed to shaping a future where technology enriches every
interaction. Our vision with Genome Lab is to provide an ever-lasting way of
decoding and encoding information with the Kondux DNA protocol that outlives our
developers.

## Join the Community

We believe in the collective power of innovation. Join us on our journey to
redefine the landscape of digital assets. Connect, contribute, and stay
up-to-date with the latest developments in Kondux.

For more about our projects, visit [Kondux](https://www.kondux.info).

## BETA BREAKDOWN

This is currently a living site and will receive many CI/CD updates as time goes
on. While there are a lot of small or stylistic to-dos, some bigger to-dos
include:

- Utilizing the DNA reference key to make the very start of the pipeline data
  driven to match the rest
- Adding color outputs to demonstrate the color and/or hex codes of the color

---

## Getting Started

Below are instructions to help you build and run the **Genome Lab** React application.

### Prerequisites

- **Node.js** (>= 14.x recommended)
- **npm** (>= 6.x recommended)

You can verify these are installed by running:

```bash
node -v
npm -v
```

### Installation

1. **Clone the repository** (or download the project as a ZIP):

   ```bash
   git clone https://github.com/Kondux/genome-lab.git
   cd genome-lab
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

### Running in Development

To start a local development server with hot reloading, run:

```bash
npm start
```

This will automatically open the React application in your browser at
[http://localhost:3000](http://localhost:3000). Any changes made to the
source code will automatically reload the page.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

This command will generate a `/build` folder containing all the production-ready
assets. You can deploy these files to any static hosting provider of your
choice.

### Deployment to GitHub Pages

This project is configured for deployment to GitHub Pages via the `gh-pages`
package. To deploy, run:

```bash
npm run deploy
```

This script will:

1. Run a production build.
2. Push the `/build` folder to the `gh-pages` branch of your repository, making
   your app available at `https://<USERNAME>.github.io/genome-lab`.

> **Note**: If you forked this repository, update the `homepage` field in
> `package.json` to point to your GitHub Pages URL (e.g., 
> `"homepage": "https://<USERNAME>.github.io/genome-lab"`).

### Additional Scripts

- **`npm run test`** – Runs the test suite.
- **`npm run format`** – Formats the codebase using Prettier.
- **`npm run eject`** – Ejects from Create React App for advanced custom configurations.
  (Note: This is irreversible.)

---

We hope you enjoy experimenting with Genome Lab and can’t wait to see how you
leverage the Kondux DNA protocol! If you have any feedback or contribution ideas,
please join our community or open an issue.
