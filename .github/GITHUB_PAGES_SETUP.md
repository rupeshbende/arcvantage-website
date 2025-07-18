# GitHub Pages Setup Guide

This document provides step-by-step instructions for configuring GitHub Pages for the ArcVantage Design Studios website.

## Repository Settings Configuration

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select "Deploy from a branch"
5. Choose **main** branch and **/ (root)** folder
6. Click **Save**

### 2. Custom Domain Configuration

#### Step 1: Add Custom Domain
1. In the Pages settings, under **Custom domain**
2. Enter: `www.arcvantagedesignstudios.in`
3. Click **Save**
4. This will create/update the `CNAME` file in your repository

#### Step 2: DNS Configuration
Configure your domain's DNS settings with your domain provider:

**A Records** (for apex domain):
```
Type: A
Name: @
Value: 185.199.108.153
```
```
Type: A
Name: @
Value: 185.199.109.153
```
```
Type: A
Name: @
Value: 185.199.110.153
```
```
Type: A
Name: @
Value: 185.199.111.153
```

**CNAME Record** (for www subdomain):
```
Type: CNAME
Name: www
Value: rupeshbende.github.io
```

### 3. HTTPS Enforcement

1. In the Pages settings, check **Enforce HTTPS**
2. This ensures all traffic is redirected to HTTPS
3. SSL certificate is automatically provided by GitHub

### 4. Jekyll Processing

Since we're using a custom static site (not Jekyll):
1. Ensure `.nojekyll` file exists in the root directory
2. This prevents GitHub from processing the site with Jekyll

## Verification Steps

### 1. Check Deployment Status

After configuration, verify deployment:

1. Go to **Actions** tab in your repository
2. Look for "Deploy to GitHub Pages" workflow
3. Ensure it completes successfully
4. Check the deployment URL in the workflow logs

### 2. Test Website Access

Test the following URLs:

- ✅ `https://www.arcvantagedesignstudios.in` (should work)
- ✅ `http://www.arcvantagedesignstudios.in` (should redirect to HTTPS)
- ✅ `https://rupeshbende.github.io/arcvantage-website/` (GitHub Pages URL)

### 3. Verify HTTPS Certificate

1. Visit your custom domain
2. Check for the lock icon in the browser address bar
3. Click on the lock to verify SSL certificate details
4. Certificate should be issued by GitHub

### 4. Test 404 Error Page

1. Visit a non-existent page: `https://www.arcvantagedesignstudios.in/nonexistent`
2. Should display the custom 404.html page
3. Verify navigation links work from the 404 page

## Troubleshooting

### Common Issues and Solutions

#### 1. Custom Domain Not Working

**Problem**: Custom domain shows 404 or doesn't resolve

**Solutions**:
- Check DNS propagation (can take up to 24 hours)
- Verify CNAME file contains correct domain
- Ensure DNS records are correctly configured
- Use `dig` or online DNS checker tools to verify

#### 2. HTTPS Not Working

**Problem**: SSL certificate errors or mixed content warnings

**Solutions**:
- Wait for SSL certificate provisioning (can take a few minutes)
- Ensure all resources (CSS, JS, images) use HTTPS or relative URLs
- Check for mixed content in browser developer tools

#### 3. Site Not Updating

**Problem**: Changes not reflected on live site

**Solutions**:
- Check GitHub Actions workflow status
- Clear browser cache
- Verify changes were pushed to main branch
- Check for any workflow errors in Actions tab

#### 4. 404 Errors for Assets

**Problem**: CSS, JS, or images not loading

**Solutions**:
- Verify file paths are relative (not absolute)
- Check file names and extensions match exactly
- Ensure files are committed and pushed to repository

### DNS Verification Commands

Use these commands to verify DNS configuration:

```bash
# Check A records
dig arcvantagedesignstudios.in A

# Check CNAME record
dig www.arcvantagedesignstudios.in CNAME

# Check if domain resolves to GitHub Pages
nslookup www.arcvantagedesignstudios.in
```

## Monitoring and Maintenance

### 1. Automated Monitoring

The repository includes automated monitoring:

- **Status Check Workflow**: Runs every 12 hours to verify site availability
- **Deployment Workflow**: Validates and deploys changes automatically
- **Performance Checks**: Monitors asset sizes and loading times

### 2. Manual Checks

Perform these checks regularly:

- [ ] Website loads correctly on all devices
- [ ] All navigation links work
- [ ] Contact form functions properly
- [ ] Images load without errors
- [ ] HTTPS certificate is valid and not expiring

### 3. Performance Monitoring

Monitor these metrics:

- Page load speed (target: < 3 seconds)
- Image optimization (no oversized images)
- CSS/JS minification working
- CDN resources loading properly

## Security Considerations

### 1. HTTPS Enforcement

- All traffic is automatically redirected to HTTPS
- SSL certificate is managed by GitHub
- No mixed content warnings

### 2. Content Security

- No inline scripts or styles
- External resources loaded over HTTPS
- Form validation includes security measures

### 3. Access Control

- Repository access controlled through GitHub permissions
- Deployment requires push access to main branch
- Sensitive information not stored in repository

## Backup and Recovery

### 1. Repository Backup

- Repository is backed up through GitHub's infrastructure
- Consider creating periodic exports of repository data
- Document any external dependencies

### 2. Content Backup

- JSON data files are version controlled
- Images are stored in repository
- Consider backing up large media files separately

### 3. Recovery Procedures

In case of issues:

1. Check GitHub Actions logs for errors
2. Revert to last known good commit if needed
3. Re-run deployment workflow manually
4. Contact GitHub Support for platform issues

## Contact and Support

For GitHub Pages specific issues:

- **GitHub Pages Documentation**: https://docs.github.com/en/pages
- **GitHub Support**: https://support.github.com/
- **Repository Issues**: Use GitHub Issues for project-specific problems

---

**Last Updated**: July 2025  
**Maintained By**: ArcVantage Design Studios Development Team