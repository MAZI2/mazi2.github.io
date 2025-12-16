#!/bin/bash
# deploy.sh
# Usage: ./deploy.sh gh-pages

# Set the branch to deploy to
TARGET_BRANCH=${1:-gh-pages}

# Save current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Build the app
echo "Building Vue app..."
npm run build || { echo "Build failed"; exit 1; }

# Switch to temporary folder
TMP_DIR=$(mktemp -d)
echo "Deploying to branch '$TARGET_BRANCH' via temporary folder $TMP_DIR"

# Copy dist content to temp folder
cp -r dist/* "$TMP_DIR"

# Go to temp folder
cd "$TMP_DIR" || exit 1

# Initialize git repo in temp folder
git init
git add -A
git commit -m "Deploy $(date '+%Y-%m-%d %H:%M:%S')"

# Add remote and push to target branch
git remote add origin $(git -C "$OLDPWD" config --get remote.origin.url)
git push -f origin HEAD:"$TARGET_BRANCH"

# Return to original folder
cd "$OLDPWD" || exit 1
echo "Deployment complete!"

# Optional: clean temp folder
rm -rf "$TMP_DIR"
