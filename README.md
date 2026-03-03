# 🖋️ Pora Pao - Smart Tutor Dashboard
<img width="1529" height="430" alt="image" src="https://github.com/user-attachments/assets/cf1da77a-2d1a-44ed-9fe2-419123c1fa98" />

A modern, mobile-first, completely serverless web application built with React, Vite, and Supabase that connects private tutors with their students through an intuitive platform.

![Pora Pao](https://img.shields.io/badge/Pora%20Pao-Smart%20Dashboard-blue?style=for-the-badge&logo=react)
![Serverless](https://img.shields.io/badge/Serverless-Supabase-green?style=for-the-badge&logo=supabase)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

## 🌟 Key Features

### 👥 **Dual User System**
- <img width="869" height="516" alt="image" src="https://github.com/user-attachments/assets/fdf31230-3fe9-4ba1-9a52-8bc65aaf872e" />
- **Tutors**: Manage students, schedule routines, assign homework and quizzes, grade assignments, and monitor analytics.
- **Students**: View routines, check pending tasks, and track their academic performance securely.

### 📅 **Advanced Scheduling & Routine**
- <img width="440" height="754" alt="image" src="https://github.com/user-attachments/assets/534173da-ac0e-4251-abc9-2fe34158b320" />
- **Mini Calendar**: Visually distinct calendar highlighting routine teaching days and rescheduled dates.
- **Reschedule Alerts**: Students immediately see if a session has been moved.

### 📝 **Assignment & Grading System**
- <img width="640" height="553" alt="image" src="https://github.com/user-attachments/assets/69a5cc55-2193-4383-82ad-a9abd05641b7" /><img width="621" height="752" alt="image" src="https://github.com/user-attachments/assets/56f183e5-a16c-4d6e-b24a-0fecbf8b8e3b" />
- **Centralized Tasks**: Assign homework and quizzes categorized by customizable subjects.
- **Automated Grading Logs**: Grade assignments with a click and automatically generate comprehensive history logs.

### 📊 **Deep Analytics & Performance**
- <img width="569" height="889" alt="image" src="https://github.com/user-attachments/assets/6612e534-86c3-4e9e-8832-95c77a495529" />
- **Visual Progress**: Auto-generated Bar Charts, Area Charts, and Progress Timelines to map student strengths and historical quiz averages.
- **Subject Mastery**: Quickly identify which subjects need more attention.

### 🔒 **Code-Based Security**
- <img width="632" height="172" alt="image" src="https://github.com/user-attachments/assets/9245bb1e-84ec-4757-8321-dfbade4233fe" />
- **Passwordless Entry for Students**: Seamless login using only a 6-digit cryptographic code provided securely by the tutor. No emails required!
- **Row Level Security**: Fully secured database ensuring tutors and students only access their own authorized data.

### 🎨 **Modern UI/UX**
- **Glassmorphism Design**: Stunning, frosted-glass components with backdrop blur for a highly premium feel.
- **Mobile-First Approach**: Perfectly constrained layouts that feel like a native iOS/Android application.
- **Interactive Elements**: Smooth hover effects, tap animations, and vibrant gradient accents.

## 🛠 Technology Stack

### **Frontend**
- **React.js 18** - Modern UI framework
- **Vite** - Lightning-fast build tool and development server
- **React Router DOM** - Client-side routing
- **Recharts** - Dynamic data visualization
- **Lucide React** - Beautiful, consistent iconography
- **Vanilla CSS** - Custom glassmorphism implementation (No external UI libraries)

### **Backend & Database (Serverless)**
- **Supabase** - Open-source Firebase alternative
- **PostgreSQL** - Robust relational database backend
- **Supabase Auth** - Built-in secure authentication
- **Row Level Security (RLS)** - Database-level security policies

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v16 or higher)
- Supabase Project (Free tier works perfectly)
- Git

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mostofa-Hasin-Mahdi/pora-pao.git
   cd pora-pao/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file in the `/client` directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Initialize the Database**
   Copy the contents of `supabase_schema.sql` (found in the root directory) and execute it in your Supabase SQL Editor to instantly provision all tables and security policies.

5. **Start the application**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Head over to `http://localhost:5173` to view the app!

## 📱 User Guide

### **For Tutors**

1. **Registration & Login**
   - Create an account or log in through the Tutor Portal.
2. **Dashboard Management**
   - Add new students to generate their secure 6-digit login code.
   - Access Tutor Settings to update your profile name and phone number.
3. **Student Details & Scheduling**
   - Select a student to set up their weekly routine on the Mini Calendar.
   - Add subjects, assign homework, and schedule quizzes tailored to specific topics.
4. **Grading & Analytics**
   - Grade pending tasks to move them into the student's History Log.
   - View advanced performance analytics (Bar/Area charts) for each student.

### **For Students**

1. **Secure Login**
   - Access the Student Portal using ONLY the 6-character code provided by your tutor.
2. **Dashboard Overview**
   - Instantly view upcoming quizzes, pending homework, and your tutor's contact info.
   - Check the Mini Calendar for your study routine and reschedule alerts.
3. **Performance Tracking**
   - Review your graded assignments in your History log.
   - Analyze your subject strengths via your personalized Performance Analytics charts.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Mostofa Hasin Mahdi**
- **Established**: 2026
- **Technology**: React, Supabase, Glassmorphism
- **Purpose**: Serverless smart dashboard for private educational management.

## 🙏 Acknowledgments

- **Supabase** for the incredible backend-as-a-service and PostgreSQL database.
- **Recharts** for the brilliant data visualization components.
- **Lucide React** for the clean and modular iconography.
- **Vite** for the exceptionally fast development experience.

---

⭐ **Star this repository if you found it helpful!**

🔗 **Connect with me**: [GitHub](https://github.com/Mostofa-Hasin-Mahdi) | [LinkedIn](https://linkedin.com/in/mostofa-hasin-mahdi-76777a182)

---

*Built with ❤️, React, and Glassmorphism*
