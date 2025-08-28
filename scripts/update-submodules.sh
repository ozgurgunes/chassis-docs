#!/bin/bash

# Script to update submodules to their configured branches from .gitmodules
# Includes protection against circular submodule dependencies

declare -A visited_repos
MAX_DEPTH=3  # Prevent infinite recursion

update_submodules() {
    local current_depth=${1:-0}
    local current_path=${2:-"."}
    
    if [ $current_depth -gt $MAX_DEPTH ]; then
        echo "⚠️  Maximum recursion depth reached at $current_path. Skipping to prevent circular dependencies."
        return
    fi
    
    echo "🔄 Updating submodules at depth $current_depth in $current_path..."
    
    # Update submodules to latest remote commits
    git submodule update --remote --recursive
    
    # Checkout each submodule to its configured branch
    git submodule foreach '
        repo_url=$(git config --get remote.origin.url)
        if [[ -n "${visited_repos[$repo_url]}" ]]; then
            echo "⚠️  Circular dependency detected for $repo_url in $name. Skipping."
            exit 0
        fi
        visited_repos[$repo_url]=1
        
        branch=$(git config -f $toplevel/.gitmodules submodule.$name.branch)
        if [ -n "$branch" ]; then
            echo "Checking out $name to branch: $branch"
            git checkout $branch 2>/dev/null || git checkout -b $branch origin/$branch
            git pull origin $branch
        else
            echo "No branch specified for $name, staying on main"
            git checkout main
            git pull origin main
        fi
    '
    
    # Handle nested submodules with depth tracking
    git submodule foreach "
        if [ -f .gitmodules ] && [ $current_depth -lt $MAX_DEPTH ]; then
            echo \"Found nested submodules in \$name, updating...\"
            cd \$PWD
            $(declare -f update_submodules)
            update_submodules $((current_depth + 1)) \"\$PWD\"
        elif [ $current_depth -ge $MAX_DEPTH ]; then
            echo \"⚠️  Max depth reached in \$name. Skipping nested submodules to prevent circular dependencies.\"
        fi
    "
}

echo "🔄 Starting submodule update with circular dependency protection..."
echo "📊 Maximum recursion depth: $MAX_DEPTH"

# Start the update process
update_submodules 0

echo "✅ All submodules updated with circular dependency protection!"
echo ""
echo "Current status:"
git submodule foreach 'echo "  $name: $(git branch --show-current)"'
