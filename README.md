# TikTok Scraper

Scrape and analyze trending, fashion-related, TikTok content.

## Get Started

1. Set TikTok cookies

- Open [https://www.tiktok.com](https://www.tiktok.com) in your browser
- Login into your account
- Right click and select Inspect
- Open the Application tab
- Open your Cookies for [https://www.tiktok.com](https://www.tiktok.com)
- Copy your values for tt_chain_token and ttwid
- Paste the values to their respective variables in the .env.example file
- Rename the .env.example file to .env

2. Build the docker image

```bash
docker build -t tiktok-scraper .
```

3. Run the container

```bash
docker run tiktok-scraper
```
