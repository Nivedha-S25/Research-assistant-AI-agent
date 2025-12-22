# Research-assistant-AI-agent


https://github.com/user-attachments/assets/e4be91fd-4899-4fc7-b9d3-2a06be8f3ae1


# 🧠 Research Agent: AI-Powered Document Analyst

> **A Retrieval-Augmented Generation (RAG) application that enables contextual "chat" with PDF research papers .**

## 🚀 Overview

Research Agent solves the problem of information overload in academic and technical research. Instead of manually scanning hundreds of pages, users can upload a PDF and query it using natural language. The system extracts the document's raw text, injects it into the **Google Gemini model** context window, and generates citation-backed answers in real-time.

This project demonstrates proficiency in **Prompt Engineering**, **React State Management**, and **Asynchronous API Integration**.

## ✨ Key Features

* ** PDF Ingestion Engine:** Utilizes `pdf.js` to parse and extract text from complex PDF layouts instantly on the client side.
* ** Context-Aware RAG:** Implements a RAG pipeline where the extracted text serves as the "Ground Truth" for the Gemini LLM, minimizing hallucinations.
* ** Modern Chat Interface:** A responsive, distinct UI built with **Tailwind CSS** featuring real-time "thinking" states and markdown rendering.
* ** Source Context Explorer:** Includes a transparent "View Context" mode that allows users to inspect exactly what data the AI is analyzing.
* ** Optimized Performance:** Built on **Vite** for sub-second build times and high-performance module serving.

## 🛠️ Tech Stack

* Frontend Framework:** React 18+ (Hooks, State Management)
* Language:** TypeScript (Strict typing for robustness)
* Build Tool:** Vite
* AI Model:** Google Gemini model (API's)
* Styling:** Tailwind CSS
* Document Processing:** PDF.js

## ⚙️ Installation & Setup

Follow these steps to run the project locally on your machine.

### 1. Prerequisites
Ensure you have **Node.js** (v16 or higher) installed.

### 2. Clone the Repository
```bash
git clone 
cd research-agent/code
3. Install Dependencies
Bash

npm install
4. Configure Environment Variables
Create a file named .env.local in the code folder.

Add your Google Gemini API key:

Code snippet

GEMINI_API_KEY=enter your gemini api key here
(Note: You can get a free API key from Google AI Studio)

5. Run the Application
Bash

npm run dev
Open your browser and navigate to the local link provided (usually http://localhost:5173).

📸 Usage Guide
Upload: Click the sidebar area to upload a research paper (PDF format).

Analyze: Wait for the "Analysis Active" indicator.

Query: Ask specific questions like "What is the methodology used?" or "Summarize the conclusion."

Verify: Click "View Extracted Context" to see the raw data backing the answer.

🛡️ Security & Architecture Note
Client-Side Architecture: This MVP runs entirely in the browser. The API key is stored in .env.local and is not exposed to the public repository.

Production Consideration: For a public deployment, the API calls would be moved to a proxy server (Node.js/Express) to fully secure the credentials.
