# ArcVantage Design Studios Website

A modern, responsive website for ArcVantage Design Studios, an architecture firm specializing in innovative arc-based living space design. The site showcases the firm's portfolio, services, and expertise in creating serene environments through architectural excellence.

## 🚀 Live Website

The website is deployed on GitHub Pages and accessible at:
- **Primary URL**: https://www.arcvantagedesignstudios.in
- **GitHub Pages URL**: https://rupeshbende.github.io/arcvantage-website/

## 📋 Features

- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Arc-Inspired Design**: Visual elements that reflect the firm's architectural specialty
- **Dynamic Content**: Project gallery and blog system with JSON-based content management
- **Accessibility**: WCAG 2.1 AA compliant with screen reader support
- **Performance Optimized**: Lazy loading, minified assets, and optimized images
- **SEO Friendly**: Proper meta tags, structured data, and sitemap

## 🛠 Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Montserrat, Open Sans, Playfair Display)
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
/
├── index.html              # Main single-page application
├── 404.html               # Custom 404 error page
├── .nojekyll              # Disables Jekyll processing
├── CNAME                  # Custom domain configuration
├── robots.txt             # Search engine crawler instructions
├── sitemap.xml            # Site structure for SEO
├── css/
│   ├── styles.css         # Main stylesheet
│   └── styles.min.css     # Minified CSS for production
├── js/
│   ├── main.js            # Core functionality
│   ├── main.min.js        # Minified JavaScript
│   ├── projects.js        # Project gallery management
│   ├── blog.js            # Blog system
│   ├── services.js        # Services section
│   ├── contact.js         # Contact form handling
│   ├── accessibility.js   # Accessibility features
│   └── image-optimization.js # Image loading optimization
├── images/
│   ├── hero/              # Hero section images
│   ├── projects/          # Project portfolio images
│   └── icons/             # Custom icons
├── data/
│   ├── projects.json      # Project portfolio data
│   ├── services.json      # Services information
│   └── blog-posts.json    # Blog content
├── scripts/
│   └── verify-deployment.sh # Deployment verification script
└── .github/
    ├── workflows/         # GitHub Actions workflows
    ├── pages-config.md    # GitHub Pages documentation
    └── DEPLOYMENT_TESTING.md # Testing guidelines
```

## 🚀 GitHub Pages Deployment

### Automatic Deployment

The website is configured for automatic deployment using GitHub Actions:

1. **Trigger**: Pushes to the `main` branch automatically trigger deployment
2. **Workflow**: `.github/workflows/deploy.yml` handles the build and deployment process
3. **Validation**: HTML validation and file verification before deployment
4. **Optimization**: Asset optimization and performance checks
5. **Status Monitoring**: `.github/workflows/status-check.yml` monitors site availability

### Manual Deployment

You can manually trigger a deployment:

1. Go to the **Actions** tab in the GitHub repository
2. Select the "Deploy to GitHub Pages" workflow
3. Click "Run workflow" and select the main branch
4. Monitor the deployment progress in the workflow logs

### Deployment Requirements

The following files are required for GitHub Pages deployment:

- ✅ `index.html` - Main entry point
- ✅ `.nojekyll` - Disables Jekyll processing
- ✅ `404.html` - Custom error page
- ✅ `CNAME` - Custom domain configuration
- ✅ `robots.txt` - SEO crawler instructions
- ✅ `sitemap.xml` - Site structure

### Custom Domain Configuration

The site uses a custom domain with the following setup:

- **Domain**: www.arcvantagedesignstudios.in
- **HTTPS**: Enforced for all connections
- **DNS Configuration**: 
  - A records pointing to GitHub Pages IP addresses
  - CNAME record for www subdomain

## 🔧 Development

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/rupeshbende/arcvantage-website.git
   cd arcvantage-website
   ```

2. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```

3. Make your changes and test locally before pushing

### Deployment Verification

Run the deployment verification script to check if everything is properly configured:

```bash
./scripts/verify-deployment.sh
```

This script checks:
- Required GitHub Pages files
- HTML structure and validation
- CSS and JavaScript files
- Data file integrity
- Image optimization
- Git repository status
- Performance and accessibility

### Content Management

#### Adding New Projects

1. Add project images to `images/projects/`
2. Update `data/projects.json` with project information:
   ```json
   {
     "id": "unique-project-id",
     "title": "Project Name",
     "category": "residential|commercial|renovation",
     "description": "Brief description",
     "images": ["image1.jpg", "image2.jpg"],
     "completionDate": "2024-01-15",
     "location": "City, State"
   }
   ```

#### Adding Blog Posts

Update `data/blog-posts.json` with new blog content:
```json
{
  "id": "unique-post-id",
  "title": "Blog Post Title",
  "excerpt": "Brief summary",
  "content": "Full content in HTML",
  "publishDate": "2024-01-15",
  "category": "design-tips|living-spaces|architecture"
}
```

## 🧪 Testing

### Cross-Browser Testing

The site is tested on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Responsive Testing

Breakpoints tested:
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

### Performance Testing

- Page load speed: < 3 seconds
- Image optimization: Lazy loading implemented
- Asset minification: CSS and JS minified for production

## 📈 SEO & Analytics

- **Meta Tags**: Comprehensive meta tags for social sharing
- **Structured Data**: JSON-LD markup for better search visibility
- **Sitemap**: XML sitemap for search engine indexing
- **Robots.txt**: Proper crawler instructions

## 🔒 Security

- **HTTPS**: Enforced for all connections
- **Content Security**: No inline scripts or styles
- **Form Validation**: Client-side validation with security considerations

## 📞 Support

For technical issues or questions about the website:

1. Check the [GitHub Issues](https://github.com/rupeshbende/arcvantage-website/issues)
2. Review the deployment logs in GitHub Actions
3. Run the verification script for diagnostics

## 📄 License

This project is proprietary to ArcVantage Design Studios. All rights reserved.

---

**ArcVantage Design Studios** - Transforming Living Spaces Through Arc-Inspired Design