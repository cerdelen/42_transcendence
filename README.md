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
- Enhance security with Two-Factor Authentication (2FA) using Google Authenticator.

### Chat Functionalities

- Engage in private one-on-one chats with other users.
- Create or join group chats with multiple users.
- Group chats feature administrators who can ban or mute users as needed.

### Social Interaction

- Send and receive friend requests.
- Block other users if needed.

### Integrated Pong Game

- Play an integrated Pong game with other users.
- Compete for a top spot on the leaderboard.

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

**Important Note**: Due to the reliance on the 42OAuth system for the basic Authentication system, an API key is required, and it gets reset frequently. Therefore, deploying this application on your own machine is not possible without a valid API key.

If you do have an Api-key all you have to do is set it up in the "server/.env" file providing "api-id" and "api-secret".

---