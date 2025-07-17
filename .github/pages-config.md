# GitHub Pages Configuration

This document outlines the GitHub Pages configuration for the ArcVantage Design Studios website.

## Repository Settings

The repository is configured with the following GitHub Pages settings:

- **Source**: Deploy from a branch
- **Branch**: main
- **Folder**: / (root)
- **Custom domain**: arcvantage-design.com
- **HTTPS enforcement**: Enabled
- **Jekyll processing**: Disabled (via .nojekyll file)

## Required Files

The following files are required for proper GitHub Pages deployment:

- `index.html` - Main entry point for the website
- `.nojekyll` - Prevents GitHub Pages from using Jekyll processing
- `404.html` - Custom 404 error page
- `CNAME` - Contains the custom domain name
- `robots.txt` - Instructions for search engine crawlers
- `sitemap.xml` - Site structure information for search engines

## Deployment Workflow

The deployment process is automated using GitHub Actions:

1. Changes are pushed to the main branch
2. The GitHub Actions workflow is triggered
3. The workflow validates HTML, checks for required files, and optimizes assets
4. The site is built and deployed to GitHub Pages
5. The deployment status is reported in the workflow logs

## Custom Domain Setup

The site uses a custom domain configured with:

- CNAME file containing the domain name
- DNS configuration with the following records:
  - A records pointing to GitHub Pages IP addresses
  - CNAME record for www subdomain

## HTTPS Enforcement

HTTPS is enforced for all connections to the website, providing:
- Secure encrypted connections
- Protection against man-in-the-middle attacks
- Better SEO ranking

## Testing Deployment

To test the deployment process:

1. Make a small change to any file in the repository
2. Commit and push the change to the main branch
3. Go to the "Actions" tab in the GitHub repository
4. Monitor the "Deploy to GitHub Pages" workflow
5. Once completed, verify the changes on the live site

You can also manually trigger a deployment from the Actions tab.