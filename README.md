# Speak2See Frontend

<div align="center">
 <img src="public/speak2see-logo.svg" alt="Speak2See Logo" width="120" height="120"/>
 <div style="position: relative;">
   <div style="position: absolute; inset: 0; animation: spin 20s linear infinite;">
     <svg width="120" height="120" viewBox="0 0 100 100">
       <path fill="#3B82F6" opacity="0.3" d="M50,0 C55,25 75,35 95,50 C75,65 55,75 50,100 C45,75 25,65 5,50 C25,35 45,25 50,0" />
     </svg>
   </div>
 </div>
</div>

This React application serves as the frontend for the Speak2See platform, enabling users to convert speech into images through an intuitive web interface. The project is built using React 18 and Vite for optimal development experience. Development was conducted using Anthropic's Claude 3.5 Sonnet AI assistant, which generated most of the source code and configuration.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (tested with v20)
- npm (tested with v11)
- AWS CLI (configured with appropriate credentials)

## Environment Setup

The application requires specific environment variables to access the AWS backend. These variables are sourced from AWS stack deployment outputs.

1. Deploy the backend stacks first (assuming the source code is in `../Speak2SeeCDK`)
2. Ensure you have the `outputs-dev.json` file in the `../Speak2SeeCDK/shared` folder

## Development Setup

1. Install dependencies:

```bash
npm install
```

2. Link shared types and utilities:

```bash
npm run link-shared-dev
```

This will create a `.env` file with the necessary configuration.

3. Run the unit tests for the React components:

```bash
npm test
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` by default.

## Mock API for Development

The application includes a mock API implementation for development purposes (avoid hitting AWS services repeatedly). To toggle between mock and real API:

```bash
# In your .env file
VITE_REACT_APP_USE_MOCK_API=true  # For mock data
VITE_REACT_APP_USE_MOCK_API=false # For real AWS API endpoints
```

## Authentication

The application uses Amazon Cognito for authentication. Users are added manually to the Cognito UserPool. The authentication flow is handled by the `AuthService` class, which manages:

- User sign-in
- Session management + Token handling
- User profile information

## Infrastructure Deployment

The frontend is deployed using AWS CDK, which provisions a secure CloudFront distribution serving content from an S3 bucket.

To deploy the frontend infrastructure:

```bash
npm run build
cd frontend-iac
npm install
npm run deploy:dev
```

This will create all required AWS resources and output the CloudFront distribution URL to `frontend-dev.json`. Use this URL to access the app.

Note: Only a development environment is currently implemented. The infrastructure includes:

- CloudFront distribution with HTTPS enforcement
- S3 bucket for static assets with versioning enabled
- Access logging for both CloudFront and S3
- Geo-restriction to Germany
- Automatic cleanup of old versions and logs
- Security checks via cdk-nag (with cost-saving suppressions for dev)

The deployment is configured to automatically destroy resources when needed (`npm run destroy:dev`) and uses AWS managed policies in development for simplicity. For a production environment, additional security measures would need to be implemented, including stricter IAM policies, WAF integration, and custom SSL certificates.
