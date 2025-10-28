# AICo – AI-Powered Collaborative Workspace

## Overview
AICo is an AI-native collaboration platform with real-time chat, task management, analytics, and an optional Solana blockchain logging module.

## Tech Stack
- Frontend: React + Vite + TailwindCSS
- Backend: Node.js + Express + MongoDB (Mongoose)
- Realtime: Socket.io
- AI: OpenAI API
- Blockchain: Solana Web3.js (placeholder)

## Prerequisites
- Node.js 18+
- MongoDB running locally or in the cloud
- OpenAI API key
- Git (optional)

## Setup
1. Copy env file
```
cp .env.example .env
```
2. Edit .env
3. Install dependencies
```
npm install
cd frontend && npm install
```
4. Run dev servers
```
npm run dev
```
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## Scripts
- `npm run server` – start backend with nodemon
- `npm run client` – start frontend dev server
- `npm run dev` – run both concurrently

## Folder Structure
See repository tree for backend, frontend, and contracts.
