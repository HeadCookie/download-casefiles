# Download Penneo Case Files App

## Overview
Downloads Penneo casefiles to local storage via API. 
You must have a Penneo account with API access to use this app. See the Penneo help center for more information.

## Requirements
- Node
- NPM
- Penneo account with API access

## Setup
- Clone repo.
- Run `npm install`.

## Usage
- Execute `npm start`.
- Follow CLI prompts.
```bash
download-casefiles on  main [?] is  v1.0.0 via  v20.9.0 
❯ npm start

> download-casefiles@1.0.0 start
> node src/app.js

Select Environment:

[1] sandbox
[2] production
[0] CANCEL

Which environment do you want to use? [1, 2, 0]: 2
Selected environment: production
Enter the path to the download directory: ~/Downloads/my-casefiles
Enter key: 2bc7a1bdd49e8106b4079470bfd0d01667c6c6856e8984d0393d4a5062fe94c
Enter secret: ****************************************************************
 ████████████████████████████████████████ 100% | ETA: 0s | 51/51
File saved: file:///Users/johndoe/Downloads/my-casefiles
```
