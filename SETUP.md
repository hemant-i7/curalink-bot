# 🚀 CuraLink Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables
Copy the `.env` file and add your Perplexity API key:

```bash
# Required: Perplexity API Configuration
PERPLEXITY_API_KEY=your_actual_perplexity_api_key_here

# NextAuth Configuration (already configured)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth (already configured)
GOOGLE_CLIENT_ID=691331113711-ihh7j6m6jecdjq7vlmfa8h917ui3rmd6.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

### 3. Get Perplexity API Key

1. **Sign up at [Perplexity AI](https://www.perplexity.ai/)**
2. **Go to [API Settings](https://www.perplexity.ai/settings/api)**
3. **Generate a new API key**
4. **Copy the key and paste it in your `.env` file**

### 4. Run the Application
```bash
npm run dev
```

### 5. Access the Medical AI System
- **Main App**: http://localhost:3000
- **Medical Diagnosis**: http://localhost:3000/medical
- **Medical Dashboard**: http://localhost:3000/medical/dashboard
- **API Health Check**: http://localhost:3000/api/medical/diagnose

## 🤖 AI Agent System

### Real-time Agent Orchestration
The system uses 5 specialized AI agents powered by Perplexity Sonar models:

1. **🗣️ Bhasha (Language Translator)**
   - Model: `sonar`
   - Function: Translates symptoms from 10+ Indian languages
   - Features: Emergency keyword detection, cultural context preservation

2. **📊 Lakshan (Symptom Analyzer)**
   - Model: `sonar`
   - Function: Clinical symptom structuring and analysis
   - Features: Red flag detection, urgency scoring, body system classification

3. **📚 Shodh (Medical Researcher)**
   - Model: `sonar`
   - Function: Real-time medical literature research
   - Features: Evidence-based findings, regional disease patterns, outbreak monitoring

4. **🛡️ Suraksha (Risk Assessment)**
   - Model: `sonar`
   - Function: Patient-specific risk evaluation
   - Features: Multi-domain risk analysis, safety recommendations

5. **🧠 Nidan (Diagnosis Aggregator)**
   - Model: `sonar`
   - Function: Clinical decision synthesis
   - Features: Differential diagnosis, confidence scoring, treatment recommendations

### Agent Orchestration Features
- **Parallel Processing**: Multiple agents work simultaneously
- **Real-time Status**: Live agent activity monitoring
- **Error Handling**: Graceful fallbacks and error recovery
- **Performance Metrics**: Processing time and efficiency tracking

## 🌍 Supported Languages

| Language | Native Script | Code |
|----------|---------------|------|
| English | English | `english` |
| Hindi | हिंदी | `hindi` |
| Marathi | मराठी | `marathi` |
| Tamil | தமிழ் | `tamil` |
| Telugu | తెలుగు | `telugu` |
| Bengali | বাংলা | `bengali` |
| Gujarati | ગુજરાતી | `gujarati` |
| Kannada | ಕನ್ನಡ | `kannada` |
| Malayalam | മലയാളം | `malayalam` |
| Punjabi | ਪੰਜਾਬੀ | `punjabi` |
| Urdu | اردو | `urdu` |

## 🔧 System Configuration

### Demo Mode vs Real-time Mode

**Without Perplexity API Key (Demo Mode):**
- Uses intelligent fallback responses
- Simulates agent processing
- Limited to basic symptom analysis
- No real-time research capabilities

**With Perplexity API Key (Real-time Mode):**
- Full AI agent orchestration
- Real-time medical literature research
- Dynamic symptom analysis
- Live risk assessment
- Evidence-based diagnosis

### Performance Optimization

The system is optimized for:
- **Speed**: Parallel agent processing
- **Accuracy**: Multiple validation layers
- **Safety**: Conservative medical approach
- **Scalability**: Efficient resource usage

## 🚨 Important Notes

### Medical Disclaimer
⚠️ **This system is designed to assist healthcare professionals and should not replace professional medical judgment. Always consult qualified healthcare providers for medical decisions.**

### API Usage
- Perplexity API calls are optimized for efficiency
- Each diagnosis uses approximately 4-6 API calls
- Processing time: 5-15 seconds depending on complexity
- Rate limits are handled automatically

### Data Privacy
- No patient data is stored permanently
- All API communications are encrypted
- Session-based processing only
- HIPAA-ready architecture

## 🛠️ Troubleshooting

### Common Issues

1. **"API key not configured" error**
   - Ensure `PERPLEXITY_API_KEY` is set in `.env`
   - Restart the development server after adding the key

2. **Build warnings about unused imports**
   - These are non-critical warnings
   - The application will function normally

3. **Slow response times**
   - Check your internet connection
   - Verify Perplexity API status
   - Complex symptoms may take longer to process

### Getting Help

- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Check the README.md for detailed information
- **API Status**: Monitor Perplexity API status page

## 🚀 Deployment

### Production Deployment
```bash
npm run build
npm start
```

### Environment Variables for Production
Ensure all environment variables are properly set in your production environment:
- `PERPLEXITY_API_KEY`: Your production Perplexity API key
- `NEXTAUTH_URL`: Your production domain
- `NEXTAUTH_SECRET`: A secure random string for production

### Docker Deployment
```bash
docker build -t curalink .
docker run -p 3000:3000 -e PERPLEXITY_API_KEY=your_key curalink
```

---

**Ready to revolutionize medical diagnosis with AI? Start by getting your Perplexity API key and experience the power of multi-agent medical intelligence! 🏥🤖**