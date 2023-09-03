Certainly, here's an updated GitHub README for your project:

# FullStack Website with Database

Welcome to our FullStack website project! This web application is designed to provide a rich set of features including user authentication, chat functionality, friend requests, user blocking, an integrated Pong game, and a leaderboard. Read on to learn more about the project and how to get started.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)

## Introduction

This project is a full-stack web application that demonstrates various functionalities.

## Features

### User Authentication with 2FA (Two-Factor Authentication)

- Securely authenticate using 42AOauth provided by the 42 intra education platform.

<img width="1075" alt="Screen Shot 2023-09-03 at 3 38 58 PM" src="https://github.com/cerdelen/42_transcendence/assets/95369756/27c2a525-a9c2-4c0d-be06-960d5e329a81">


- Enhance security with Two-Factor Authentication (2FA) using Google Authenticator.

<img width="246" alt="Screen Shot 2023-09-03 at 1 21 26 PM" src="https://github.com/cerdelen/42_transcendence/assets/95369756/2a55dc3f-5184-49a8-a126-64c765049bb9">


### Chat Functionalities

- Engage in private one-on-one chats with other users.

<img width="1488" alt="Screen Shot 2023-09-03 at 3 26 49 PM" src="https://github.com/cerdelen/42_transcendence/assets/95369756/dc7dc78d-b184-4109-8a0a-70b6568383dd">

- Create or join group chats with multiple users.
- Group chats feature administrators who can ban or mute users as needed.

<img width="285" alt="Screen Shot 2023-09-03 at 1 22 06 PM" src="https://github.com/cerdelen/42_transcendence/assets/95369756/e468f8b1-f94c-4a41-8fbe-89d9e0589864">


### Social Interaction

- Send and receive friend requests.
- Block other users if needed.

<img width="1435" alt="Screen Shot 2023-09-03 at 1 20 44 PM" src="https://github.com/cerdelen/42_transcendence/assets/95369756/e529d268-4c3d-41da-a842-82fb59ab11ef">


### Integrated Pong Game

- Play an integrated Pong game with other users.

<img width="1434" alt="Screen Shot 2023-09-03 at 1 23 18 PM" src="https://github.com/cerdelen/42_transcendence/assets/95369756/d3caa259-a68d-40e2-8030-c80ea192836c">
<img width="1355" alt="Screen Shot 2023-09-03 at 3 31 18 PM" src="https://github.com/cerdelen/42_transcendence/assets/95369756/ebbacc84-568f-41ab-a3ea-5016e8a293e8">

  
- Compete for a top spot on the leaderboard.

  <img width="1433" alt="Screen Shot 2023-09-03 at 1 22 49 PM" src="https://github.com/cerdelen/42_transcendence/assets/95369756/effc44ad-28c0-4b06-8fee-2db9bd1e2ca2">


### Lifetime Achievement

- Achieve permanent achievements e.g. "Win x amount of games in a row".

## Tech Stack

We utilized the following technologies to build this project:

- **Backend Database**: PostgreSQL
- **Backend Framework**: Nest.js with Prisma as the database framework
- **Frontend Framework**: React
- **Containerization**: Docker for easy deployment

## Getting Started

To get started with this project, follow these steps:

**Important Note**: Due to the reliance on the 42OAuth system for the basic Authentication system, an API key is required, and it gets reset frequently. Therefore, deploying this application on your own machine is not possible without a valid API key. Furthermore you need to have an account on the intra portal to be able to login.

If you do have an Api-key all you have to do is set it up in the "server/.env" file providing "api-id" and "api-secret".

---
