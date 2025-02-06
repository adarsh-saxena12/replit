# 🚀 Cloud-Based Online IDE

## 🌟 Overview
An advanced cloud-based **Online IDE** with real-time **collaborative coding** and **terminal-based execution**. Built with **Node.js, TypeScript, Express, Docker, AWS S3, AWS EKS, Socket.IO, node-pty, and React.js**, this IDE offers a seamless **coding** and **execution** experience in the browser.

## ✨ Features

- 💻 **Interactive Terminal:** Terminal-based execution with **node-pty** for a smooth shell experience.
- 🏗️ **Scalability & Deployment:** Containerized using **Docker** and deployed on **AWS EKS** for high availability.
- 🛠️ **Robust Backend:** Powered by **Node.js, Express, and TypeScript** for a scalable and maintainable architecture.
- 🎨 **User-Friendly Interface:** Built with **React.js** for an intuitive and responsive UI.
- ☁️ **Cloud Storage:** Integrated with **AWS S3** for secure file storage.

## 📦 Tech Stack

- **Frontend:** React.js ⚛️
- **Backend:** Node.js, Express.js 🚀
- **WebSockets:** Socket.IO 🔄
- **Terminal Support:** node-pty 🖥️
- **Containerization:** Docker 🐳
- **Cloud & Deployment:** AWS EKS ☁️, AWS S3 🗄️
- **Programming Language:** TypeScript 💙

## 🚀 Getting Started

### 🔧 Prerequisites
Ensure you have the following installed:
- Node.js & npm
- Docker
- AWS CLI (for deployment)

### 📥 Installation & Setup
```sh
# Clone the repository
$ git clone https://github.com/yourusername/your-repo.git

# Navigate to the project directory
$ cd online-ide

# Install dependencies
$ npm install
```

### 🏗️ Running the Project
#### 🖥️ Development Mode
```sh
$ npm run dev
```
#### 🐳 Docker Setup
```sh
# Build Docker Image
$ docker build -t online-ide.

# Run the container
$ docker run -p 3000:3000 online-ide
```

### ☁️ Deploying to AWS EKS
1. Push the Docker image to AWS ECR.
2. Apply Kubernetes configurations to deploy on **AWS EKS**.

## 📸 Screenshots

![Screenshot (694)](https://github.com/user-attachments/assets/39d42530-492a-4c4d-b5c3-77a9cea5d913)

![Screenshot (695)](https://github.com/user-attachments/assets/3238625f-45a8-48f1-b85c-ec84e7241346)
