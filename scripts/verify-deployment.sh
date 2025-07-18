#!/bin/bash

# ArcVantage Design Studios - Deployment Verification Script
# This script verifies that the website is properly configured for GitHub Pages deployment

echo "🚀 ArcVantage Design Studios - Deployment Verification"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if we're in the correct directory
if [ ! -f "index.html" ]; then
    echo -e "${RED}Error: index.html not found. Please run this script from the project root directory.${NC}"
    exit 1
fi

echo "1. Checking GitHub Pages Requirements..."
echo "----------------------------------------"

# Check for required files
files=("index.html" ".nojekyll" "404.html" "CNAME" "robots.txt" "sitemap.xml")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "$file exists"
    else
        print_status 1 "$file missing"
    fi
done

echo ""
echo "2. Validating HTML Structure..."
echo "------------------------------"

# Basic HTML validation
if grep -q "<!DOCTYPE html>" index.html; then
    print_status 0 "HTML5 DOCTYPE declaration found"
else
    print_status 1 "HTML5 DOCTYPE declaration missing"
fi

if grep -q "<html lang=" index.html; then
    print_status 0 "HTML lang attribute found"
else
    print_status 1 "HTML lang attribute missing"
fi

if grep -q "<meta charset=" index.html; then
    print_status 0 "Character encoding meta tag found"
else
    print_status 1 "Character encoding meta tag missing"
fi

if grep -q "<meta name=\"viewport\"" index.html; then
    print_status 0 "Viewport meta tag found"
else
    print_status 1 "Viewport meta tag missing"
fi

echo ""
echo "3. Checking CSS and JavaScript Files..."
echo "---------------------------------------"

# Check CSS files
if [ -f "css/styles.css" ]; then
    print_status 0 "Main CSS file exists"
    css_size=$(wc -c < "css/styles.css")
    echo "   CSS file size: ${css_size} bytes"
else
    print_status 1 "Main CSS file missing"
fi

if [ -f "css/styles.min.css" ]; then
    print_status 0 "Minified CSS file exists"
    min_css_size=$(wc -c < "css/styles.min.css")
    echo "   Minified CSS file size: ${min_css_size} bytes"
else
    print_warning "Minified CSS file not found (optional for development)"
fi

# Check JavaScript files
if [ -f "js/main.js" ]; then
    print_status 0 "Main JavaScript file exists"
    js_size=$(wc -c < "js/main.js")
    echo "   JavaScript file size: ${js_size} bytes"
else
    print_status 1 "Main JavaScript file missing"
fi

if [ -f "js/main.min.js" ]; then
    print_status 0 "Minified JavaScript file exists"
    min_js_size=$(wc -c < "js/main.min.js")
    echo "   Minified JavaScript file size: ${min_js_size} bytes"
else
    print_warning "Minified JavaScript file not found (optional for development)"
fi

echo ""
echo "4. Checking Data Files..."
echo "------------------------"

# Check data files
data_files=("data/projects.json" "data/services.json" "data/blog-posts.json")
for file in "${data_files[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "$file exists"
        # Validate JSON syntax
        if python3 -m json.tool "$file" > /dev/null 2>&1; then
            print_status 0 "$file has valid JSON syntax"
        else
            print_status 1 "$file has invalid JSON syntax"
        fi
    else
        print_status 1 "$file missing"
    fi
done

echo ""
echo "5. Checking Image Directory..."
echo "-----------------------------"

if [ -d "images" ]; then
    print_status 0 "Images directory exists"
    image_count=$(find images -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.gif" -o -name "*.webp" \) | wc -l)
    echo "   Total images found: ${image_count}"
    
    # Check for large images
    large_images=$(find images -type f \( -name "*.jpg" -o -name "*.png" \) -size +1M)
    if [ -n "$large_images" ]; then
        print_warning "Large images found (>1MB):"
        echo "$large_images" | while read -r img; do
            size=$(du -h "$img" | cut -f1)
            echo "   - $img ($size)"
        done
    else
        print_status 0 "No oversized images found"
    fi
else
    print_status 1 "Images directory missing"
fi

echo ""
echo "6. Checking GitHub Configuration..."
echo "----------------------------------"

# Check GitHub workflows
if [ -f ".github/workflows/deploy.yml" ]; then
    print_status 0 "GitHub Actions deployment workflow exists"
else
    print_status 1 "GitHub Actions deployment workflow missing"
fi

if [ -f ".github/workflows/status-check.yml" ]; then
    print_status 0 "GitHub Actions status check workflow exists"
else
    print_warning "GitHub Actions status check workflow not found (optional)"
fi

# Check custom domain configuration
if [ -f "CNAME" ]; then
    domain=$(cat CNAME)
    print_status 0 "Custom domain configured: $domain"
else
    print_warning "No custom domain configured"
fi

echo ""
echo "7. Git Repository Status..."
echo "--------------------------"

# Check git status
if git rev-parse --git-dir > /dev/null 2>&1; then
    print_status 0 "Git repository initialized"
    
    # Check for remote
    if git remote get-url origin > /dev/null 2>&1; then
        remote_url=$(git remote get-url origin)
        print_status 0 "Git remote configured: $remote_url"
    else
        print_status 1 "Git remote not configured"
    fi
    
    # Check current branch
    current_branch=$(git branch --show-current)
    if [ "$current_branch" = "main" ]; then
        print_status 0 "On main branch"
    else
        print_warning "Not on main branch (current: $current_branch)"
    fi
    
    # Check for uncommitted changes
    if git diff-index --quiet HEAD --; then
        print_status 0 "No uncommitted changes"
    else
        print_warning "Uncommitted changes detected"
    fi
else
    print_status 1 "Not a git repository"
fi

echo ""
echo "8. Performance Checks..."
echo "-----------------------"

# Check for common performance issues
if grep -q "defer\|async" index.html; then
    print_status 0 "JavaScript loading optimization found"
else
    print_warning "Consider adding defer/async to script tags"
fi

if grep -q "preload\|prefetch" index.html; then
    print_status 0 "Resource preloading found"
else
    print_warning "Consider adding resource preloading for critical assets"
fi

echo ""
echo "9. Accessibility Checks..."
echo "-------------------------"

# Basic accessibility checks
if grep -q "alt=" index.html; then
    print_status 0 "Alt attributes found on images"
else
    print_warning "No alt attributes found - check image accessibility"
fi

if grep -q "aria-" index.html; then
    print_status 0 "ARIA attributes found"
else
    print_warning "No ARIA attributes found - consider adding for better accessibility"
fi

if grep -q "role=" index.html; then
    print_status 0 "Role attributes found"
else
    print_warning "No role attributes found - consider adding for better accessibility"
fi

echo ""
echo "=================================================="
echo "🎯 Deployment Verification Complete!"
echo ""
echo "Next Steps:"
echo "1. Fix any issues marked with ✗"
echo "2. Consider addressing warnings marked with ⚠"
echo "3. Commit and push changes to trigger deployment"
echo "4. Monitor GitHub Actions for deployment status"
echo "5. Test the live site after deployment"
echo ""
echo "GitHub Pages URL: https://$(cat CNAME 2>/dev/null || echo 'your-username.github.io/your-repo')"
echo "=================================================="