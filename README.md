# Sentry
A Discord bot designed to give your moderators a break.

[![Notion](https://img.shields.io/badge/-notion-212121?logo=notion&style=flat)](https://www.notion.so/Sentry-9b1df2c92d8448a3934ec3de74217061) 
[![Discord](https://img.shields.io/discord/766723862766944318?color=7289DA&label=support%20discord)](https://discord.gg/V3macC3)\
![Version](https://img.shields.io/github/package-json/version/Anidox/Sentry?label=version) 
[![Uptime Robot status](https://img.shields.io/uptimerobot/status/m786154507-389a4a44e43a89aab2a12488?label=bot%20status)](https://status.sentrybot.tech) 
[![Uptime Robot status](https://img.shields.io/uptimerobot/status/m786154509-ca7e6a7e42db726e6bf2ba09?label=website%20status)](https://status.sentrybot.tech)

## Getting started
There are a few ways to get Sentry up and running on your server.

### Official Instance
To add the official hosted instance, click the button below.\
\
[![Add to Discord](https://img.shields.io/badge/-add%20sentry-%23ED213A?logo=discord&logoColor=white)](https://add.sentrybot.tech/)

### Self-hosting
As Sentry is open-source, you can always run it yourself. Simply:

  1. `git clone` the repo
  2. Run `npm install`
  3. Configure your Sentry instance by making a .env file - there is a template in [.env.example](.env.example).
  
Now you can run your bot with `npm start`! 🎉

## Reporting issues
Please report any issues with any instance of the bot (as long as it is concerning an official bug/feature of Sentry and not a modification made by another instance owner) to the [GitHub issues page](https://github.com/Anidox/Sentry/issues). You can track progress with the tracker link in the [Notion page](https://www.notion.so/Sentry-9b1df2c92d8448a3934ec3de74217061)

## Development
Feel free to contribute to Sentry, or even just add features to your own instance. Simply fork and make a pull request. Add `WIP` add the start of the title of your pull request if it is a work in progress and should not be merged.

When contributing to Sentry, please follow the code style used throughout. The ESLint config is provided. When developing, you can use `npm run dev`, which adds ESLint checking on run. Please make sure you have no ESLint warnings/errors before pushing. You may bypass warnings where absolutely neccesary (e.g. when there is no other possible/viable way).
