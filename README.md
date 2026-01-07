📧 Email Writer Assistant

Email Writer Assistant is an AI-powered Gmail tool that helps users generate high-quality email replies directly inside Gmail.
It uses a Chrome Extension frontend, a React-based UI (optional), and a Spring Boot backend integrated with the Google Gemini API to generate tone-based email responses.

🚀 Features

Gmail-integrated Chrome Extension

AI-generated email replies using Google Gemini

Tone selection: Professional, Casual, Friendly, Funny

One-click reply insertion into Gmail compose box

Spring Boot REST API backend

React JS frontend for UI/management (optional)
-------------------------------------------------------------

🛠️ Tech Stack
-Frontend

2. JavaScript

3. Chrome Extensions (Manifest V3)

4. HTML, CSS

5. React JS

-Backend

1. Java

2. Spring Boot

3. REST APIs

-Google Gemini API

🧠 How It Works

User opens Gmail and clicks Compose or Reply

Chrome Extension injects an AI Reply button and tone dropdown

Selected email content and tone are sent to the backend

Spring Boot backend creates a prompt and calls the Gemini API

Gemini generates an email reply

The reply is returned and inserted into the Gmail compose box

🤖 Getting Gemini AI API Key

Visit Google AI Studio
👉 https://aistudio.google.com

Sign in with your Google account

Click Get API Key

Copy the generated API key
⚠️ Do NOT commit this key to GitHub

⚙️ Backend Setup (Spring Boot)
1️⃣ Clone the Repository
git clone https://github.com/manojvp16/Email_Writer_Assistant.git

2️⃣ Set Gemini API Key as Environment Variable
Windows (PowerShell)
setx GEMINI_API_KEY "your_api_key_here"

Linux / macOS
export GEMINI_API_KEY=your_api_key_here

3️⃣ Configure Application Properties
server.port=8080
gemini.api.key=${GEMINI_API_KEY}

4️⃣ Run the Backend
mvn spring-boot:run


Backend will run on:

http://localhost:8080

🔌 API Endpoint
Generate Email Reply

POST /api/email/generate

Request Body
{
  "emailContent": "Hello, I wanted to follow up on our meeting...",
  "tone": "professional"
}

Response
AI-generated email reply text

🧩 Chrome Extension Setup

Open Chrome and go to:

chrome://extensions


Enable Developer Mode

Click Load unpacked

Select the Chrome Extension folder

Open Gmail

Click Compose or Reply

Select tone

Click AI Reply

