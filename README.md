# Facility Questionnaire Application

A professional web-based form application for collecting facility information related to ATC (Air Traffic Control) operations. The application features a multi-section questionnaire with real-time progress tracking and secure data storage.

## Overview

This application provides a streamlined interface for facilities to submit detailed questionnaires about their operations, staffing, and equipment. All submissions are stored in JSON format for easy integration with other systems.

### Key Features

- **Multi-Section Form**: 4 organized sections covering Facility Information, Operations, Staffing, and Equipment & Systems
- **Progress Tracking**: Real-time visual progress indicators in the sidebar showing completion status for each section
- **Professional UI**: Enterprise-grade design with clean, intuitive interface
- **Data Persistence**: All submissions automatically saved to JSON file
- **Validation**: Required field validation ensures data completeness
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite 6** - Build tool and dev server
- **Vanilla CSS** - Custom styling with CSS variables

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web server framework
- **File System (fs/promises)** - JSON data storage

## Project Structure

```
node-form/
├── src/
│   ├── components/
│   │   ├── Form.jsx           # Main form container with state management
│   │   ├── Sidebar.jsx        # Progress tracking sidebar
│   │   └── FormSection.jsx    # Individual form section component
│   ├── formData.js            # Form configuration and questions
│   ├── App.jsx                # Root component
│   ├── main.jsx               # React entry point
│   └── style.css              # Application styles
├── server/
│   └── index.js               # Express server and API endpoints
├── facility-form-data/
│   └── submissions.json       # Stored form submissions (auto-generated)
├── public/                    # Static assets
├── index.html                 # HTML entry point
├── vite.config.js             # Vite configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd node-form
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

The application requires both frontend and backend servers to be running.

**Terminal 1 - Backend Server:**
```bash
npm run server
```
The server will start on `http://localhost:3000`

**Terminal 2 - Frontend Dev Server:**
```bash
npm run dev
```
The frontend will automatically open in your browser (default: `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

Production files will be generated in the `dist/` directory.

## Production Deployment

### Server Structure

**IMPORTANT**: Keep the backend server OUTSIDE the public HTML directory for security.

```
/var/www/  (or your server root)
├── html/                          # Web-accessible directory
│   └── facility-form/             # Frontend built files
│       ├── index.html
│       ├── assets/
│       └── ...
│
└── node-form-server/              # OUTSIDE public HTML
    ├── server/
    │   └── index.js
    ├── facility-form-data/        # Data storage (auto-created)
    ├── node_modules/
    └── package.json
```

### Step-by-Step Deployment

#### 1. Build the Frontend

On your development machine:

```bash
npm run build
```

This creates the `dist/` folder with optimized production files.

#### 2. Deploy Frontend Files

Copy the contents of `dist/` to your web server's public directory:

```bash
# Example using SCP
scp -r dist/* user@your-server.com:/var/www/html/facility-form/

# Or using SFTP, FTP, or your hosting provider's file manager
```

#### 3. Deploy Backend Server

Copy the server files to a directory OUTSIDE the public HTML folder:

```bash
# On your development machine, create a deployment package
mkdir deploy
cp -r server package.json package-lock.json deploy/

# Copy to server (OUTSIDE public directory)
scp -r deploy/* user@your-server.com:/var/www/node-form-server/
```

#### 4. Install Dependencies on Server

SSH into your server and install production dependencies:

```bash
ssh user@your-server.com
cd /var/www/node-form-server
npm install --production
```

#### 5. Configure Environment (Optional)

Create a `.env` file in `/var/www/node-form-server/` if you want to use environment variables:

```bash
PORT=3000
NODE_ENV=production
DATA_DIR=/var/www/node-form-server/facility-form-data
```

#### 6. Set Up Process Manager (PM2)

Use PM2 to keep your Node.js server running:

```bash
# Install PM2 globally (if not already installed)
sudo npm install -g pm2

# Start the server
cd /var/www/node-form-server
pm2 start server/index.js --name facility-form-api

# Save PM2 configuration
pm2 save

# Set PM2 to start on system boot
pm2 startup
```

PM2 Commands:

```bash
pm2 status                 # Check server status
pm2 logs facility-form-api # View logs
pm2 restart facility-form-api # Restart server
pm2 stop facility-form-api # Stop server
```

#### 7. Configure Reverse Proxy

##### Option A: Nginx Configuration

Create `/etc/nginx/sites-available/facility-form`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend - Serve static files
    location / {
        root /var/www/html/facility-form;
        try_files $uri $uri/ /index.html;
    }

    # Backend API - Proxy to Node.js
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/facility-form /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

##### Option B: Apache Configuration

Create `/etc/apache2/sites-available/facility-form.conf`:

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/html/facility-form

    <Directory /var/www/html/facility-form>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Proxy API requests to Node.js
    ProxyPreserveHost On
    ProxyPass /api http://localhost:3000/api
    ProxyPassReverse /api http://localhost:3000/api
</VirtualHost>
```

Enable required modules and site:

```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2ensite facility-form
sudo systemctl reload apache2
```

#### 8. Configure SSL (Recommended)

Use Let's Encrypt for free SSL certificates:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx  # For Nginx
# OR
sudo apt install certbot python3-certbot-apache # For Apache

# Get certificate
sudo certbot --nginx -d your-domain.com  # For Nginx
# OR
sudo certbot --apache -d your-domain.com # For Apache
```

#### 9. Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Ensure port 3000 is NOT publicly accessible
# It should only be accessible via localhost/reverse proxy
```

### Production Checklist

- [ ] Frontend built and deployed to public HTML directory
- [ ] Backend deployed OUTSIDE public directory
- [ ] Dependencies installed with `--production` flag
- [ ] PM2 configured and server running
- [ ] Reverse proxy configured (Nginx or Apache)
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] CORS settings updated to restrict origins (see Security section)
- [ ] File permissions set correctly (`facility-form-data` folder writable)
- [ ] Backup strategy implemented for `facility-form-data/submissions.json`

### Updating the Application

**Frontend Updates:**

```bash
# On development machine
npm run build

# Upload new dist files
scp -r dist/* user@your-server.com:/var/www/html/facility-form/
```

**Backend Updates:**

```bash
# Upload new server files
scp server/index.js user@your-server.com:/var/www/node-form-server/server/

# Restart via PM2
ssh user@your-server.com
pm2 restart facility-form-api
```

### Monitoring

```bash
# View real-time logs
pm2 logs facility-form-api

# Monitor resource usage
pm2 monit

# Check application status
pm2 status
```

## Form Sections

### 1. Facility Information
- Facility Name
- Facility Type (Tower, TRACON, ARTCC, Combined)
- Facility Location

### 2. Operations
- Average Daily Operations
- Operational Hours (24/7, Daytime Only, Variable Schedule)
- Peak Operation Hours

### 3. Staffing
- Total Staff Count
- Certified Controllers
- Training Program Status

### 4. Equipment & Systems
- Primary ATC System
- Backup Systems Available
- Last System Upgrade Date

## API Endpoints

### POST `/api/submit`
Submit a new facility questionnaire.

**Request Body:**
```json
{
  "facility-name": "Example Tower",
  "facility-type": "Tower",
  "facility-location": "Chicago, IL",
  "daily-operations": "250",
  "operational-hours": "24/7",
  "peak-hours": "6 AM - 9 AM, 4 PM - 7 PM",
  "total-staff": "45",
  "certified-controllers": "32",
  "training-program": "Active",
  "primary-system": "STARS",
  "backup-systems": "Yes - Full",
  "last-system-upgrade": "2024-03-15"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "id": "1733745600000"
}
```

### GET `/api/submissions`
Retrieve all submitted questionnaires.

**Response:**
```json
[
  {
    "id": "1733745600000",
    "facility-name": "Example Tower",
    ...
    "submittedAt": "2025-12-09T12:00:00.000Z"
  }
]
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## Data Storage

Submissions are stored in `facility-form-data/submissions.json` as an array of objects. Each submission includes:
- Unique ID (timestamp-based)
- All form field responses
- Submission timestamp (ISO 8601 format)

The folder and file are automatically created on first submission if they don't exist.

## Development

### Adding New Questions

Edit `src/formData.js` to add questions to existing sections:

```javascript
{
  id: 'question-id',
  label: 'Question Label',
  type: 'text', // or 'number', 'date', 'select'
  options: ['Option 1', 'Option 2'], // for select type
  required: true
}
```

### Styling Customization

CSS variables are defined in `src/style.css` for easy theme customization:

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #64748b;
  --success-color: #10b981;
  /* ... more variables */
}
```

## Security Considerations

### CORS Configuration

The application is currently configured to accept all origins (`*`) for development. **This must be changed for production.**

Update `server/index.js` to restrict CORS to your domain:

```javascript
// Replace the existing CORS middleware with:
app.use((req, res, next) => {
  const allowedOrigins = ['https://your-domain.com', 'https://www.your-domain.com']
  const origin = req.headers.origin

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})
```

### Additional Security Measures

- **Authentication**: Consider adding user authentication for form submissions
- **Rate Limiting**: Implement rate limiting to prevent abuse and DoS attacks
- **Input Sanitization**: Add validation and sanitization for all user inputs
- **File Permissions**: Ensure `facility-form-data/` directory has proper permissions (readable/writable only by the Node.js process)
- **HTTPS Only**: Always use HTTPS in production (never HTTP)
- **Environment Variables**: Use environment variables for sensitive configuration
- **Regular Updates**: Keep all dependencies up to date (`npm audit` and `npm update`)
- **Backup Strategy**: Implement automated backups for `facility-form-data/submissions.json`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- User authentication system
- Admin dashboard for viewing submissions
- Export submissions to CSV/Excel
- Email notifications on form submission
- Form analytics and reporting
- Multi-language support
- Draft save functionality
- File upload capabilities

## Troubleshooting

### Port Already in Use
If port 3000 or 5173 is already in use, modify the ports in:
- `server/index.js` (line 10) for backend
- `vite.config.js` for frontend

### CORS Errors
Ensure the backend server is running before starting the frontend. Check that the API URL in `src/components/Form.jsx` matches your backend URL.

### Data Not Saving
Verify the server has write permissions for the project directory to create the `facility-form-data` folder.

## Support

For questions or issues, contact the development team or submit an issue in the project repository.

## License

[Specify your license here]

---

**Last Updated**: December 2025
**Version**: 1.0.0
