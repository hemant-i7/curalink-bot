# CuraLink - Complete Medical AI Diagnosis System

A comprehensive AI-powered Medical Diagnosis System built with LangChain and Google Generative AI, specifically designed for the Indian healthcare ecosystem. This system uses a collaborative team of specialized AI agents to assist doctors in clinical diagnosis, with support for multiple Indian languages and advanced medical image processing capabilities.

## Key Features

### Multi-Agent AI Architecture

- Language Translator Agent: Translates symptoms from 10+ Indian languages
- Symptom Analyzer Agent: Structures patient symptoms clinically
- Medical Researcher Agent: Searches current medical literature
- Risk Assessment Agent: Evaluates patient-specific risk factors
- Diagnosis Aggregator Agent: Combines insights into final diagnosis
- Analytica Agent: Advanced pattern analysis and medical insights
- Coordinator Agent: Orchestrates multi-agent workflows
- Epi-Watch Agent: Epidemiological surveillance and monitoring
- Pattern Seeker Agent: Medical pattern recognition and analysis

### Patient Health Management

- Gamified Health Dashboard: Earn coins and level up by completing health tasks
- Daily Health Challenges: Fitness, nutrition, wellness, and medical tasks
- Video Task Verification: AI-powered verification for fitness and wellness activities
- Leaderboard System: Compete with other users for health achievements
- Streak Tracking: Maintain daily health task streaks
- Rewards System: Coin-based incentives for healthy behaviors

### AI-Powered Medical Analysis Tools

- Lab Report Analyzer: Upload medical lab reports for comprehensive AI analysis with health trends, risk assessment, and personalized recommendations
- Medicine Scanner: Scan medicine packages to get detailed information about dosage, side effects, interactions, and safety precautions
- Nutrition Analyzer: Analyze food photos for detailed nutritional breakdown, calorie counting, meal planning suggestions, and dietary recommendations
- Medical Image Analysis: Process X-rays, CT scans, MRI, and other medical imaging

### Appointment & Payment System

- Doctor Appointment Booking: Schedule and manage medical consultations
- Appointment History: Track past and upcoming appointments
- Payment Integration: Razorpay payment gateway integration
- Payment History: Complete transaction records
- Coin-Based Discounts: Use earned health coins for appointment discounts
- Dynamic Pricing: Calculate discounts based on health achievements

### Clinical Tools for Medical Professionals

- AI Diagnosis Assistant: Multi-agent diagnostic support
- Patient Case Management: Track and manage patient cases
- Medical Analytics Dashboard: View diagnosis patterns and insights
- Patient History: Access comprehensive patient medical records
- AI Orchestration: Advanced multi-agent coordination for complex cases
- Research Integration: Access to current medical literature

### Multilingual Support

- Supported Languages: Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati, Kannada, Malayalam, Punjabi, Urdu
- Real-time Translation: Convert regional language symptoms to medical English
- Cultural Context: Understanding local medical expressions and terminology

### Safety & Compliance

- Role-Based Access Control: Separate interfaces for patients and clinicians
- Secure Authentication: NextAuth.js with Google OAuth
- Data Encryption: MongoDB-based secure data storage
- Emergency Detection: Prioritize identification of critical conditions
- Human-in-the-Loop: Doctors make final decisions
- Complete Audit Trails: Full logging of diagnostic processes

## Technology Stack

- Frontend: Next.js 15.5, React 19, TypeScript
- UI Components: Radix UI, Tailwind CSS, Framer Motion
- AI/ML: LangChain, Google Generative AI
- Database: MongoDB with Mongoose ODM
- Authentication: NextAuth.js with Google OAuth
- Payments: Razorpay Payment Gateway
- Styling: Tailwind CSS 4 with custom design system
- Form Management: React Hook Form with Zod validation
