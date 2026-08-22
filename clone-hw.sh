#!/bin/bash

# ============================================================
# Platform
# ============================================================

case "$(uname -s)" in
    Linux*)
        OS="linux"
        ;;

    MINGW*|MSYS*|CYGWIN*)
        OS="windows"
        ;;

    *)
        echo "Error: Unsupported operating system."
        echo "Supported systems: Linux and Windows."
        exit 1
        ;;
esac

# ============================================================
# Dependencies
# ============================================================

if ! command -v git &> /dev/null; then
    echo "Error: git is not installed."
    exit 1
fi

if ! command -v curl &> /dev/null; then
    echo "Error: curl is not installed."
    exit 1
fi

# jq is only required on Linux.
# Windows uses PowerShell for JSON parsing.
if [ "$OS" = "linux" ]; then
    if ! command -v jq &> /dev/null; then
        echo "Error: jq is not installed."
        echo "Install it with: sudo pacman -S jq"
        exit 1
    fi
fi

# ============================================================
# Repository
# ============================================================

repo_owner="musdev13"
repo_name="reactnative-hws"

repo_url="https://github.com/$repo_owner/$repo_name.git"
api_url="https://api.github.com/repos/$repo_owner/$repo_name"

# Запоминаем директорию, из которой был запущен скрипт
base_dir="$PWD"

# ============================================================
# JSON helpers
# ============================================================

get_default_branch() {
    local json="$1"

    if [ "$OS" = "windows" ]; then
        printf '%s' "$json" |
            powershell.exe -NoProfile -Command \
            '$json = [Console]::In.ReadToEnd() | ConvertFrom-Json; $json.default_branch' |
            tr -d '\r'
    else
        echo "$json" | jq -r '.default_branch'
    fi
}

get_homework_folders() {
    local json="$1"

    if [ "$OS" = "windows" ]; then
        printf '%s' "$json" |
            powershell.exe -NoProfile -Command \
            '$json = [Console]::In.ReadToEnd() | ConvertFrom-Json; $json | Where-Object { $_.type -eq "dir" } | ForEach-Object { $_.name }' |
            tr -d '\r'
    else
        echo "$json" |
            jq -r '.[] | select(.type == "dir") | .name'
    fi
}

# ============================================================
# GitHub API
# ============================================================

echo "Fetching homework folders from GitHub..."

repo_info=$(curl -fsSL "$api_url")

if [ $? -ne 0 ]; then
    echo "Error: Failed to connect to GitHub API."
    exit 1
fi

default_branch=$(get_default_branch "$repo_info")

if [ -z "$default_branch" ] || [ "$default_branch" = "null" ]; then
    echo "Error: Failed to determine repository default branch."
    exit 1
fi

folders_json=$(curl -fsSL \
    -H "Accept: application/vnd.github+json" \
    "$api_url/contents/hws?ref=$default_branch")

if [ $? -ne 0 ]; then
    echo "Error: Failed to get hws directory from GitHub."
    exit 1
fi

mapfile -t folders < <(
    get_homework_folders "$folders_json"
)

if [ ${#folders[@]} -eq 0 ]; then
    echo "Error: No homework folders found in hws/."
    exit 1
fi

# ============================================================
# Terminal helpers
# ============================================================

hide_cursor() {
    tput civis 2>/dev/null || true
}

show_cursor() {
    tput cnorm 2>/dev/null || true
}

clear_lines() {
    local count="$1"

    for ((i = 0; i < count; i++)); do
        tput cuu1 2>/dev/null || printf '\033[1A'
        tput el 2>/dev/null || printf '\033[2K'
    done
}

# ============================================================
# Folder selector
# ============================================================

select_option() {
    local selected=0
    local options=("$@")
    local num_options=${#options[@]}

    hide_cursor

    while true; do
        # Draw options
        for i in "${!options[@]}"; do
            if [ "$i" -eq "$selected" ]; then
                printf "\e[1;32m> %s\e[0m\n" "${options[$i]}"
            else
                printf "  %s\n" "${options[$i]}"
            fi
        done

        # Read one character
        IFS= read -rsn1 key

        case "$key" in
            # Escape sequence
            $'\x1b')
                IFS= read -rsn2 key
                ;;

            # Enter
            "")
                break
                ;;
        esac

        # Remove previous menu
        clear_lines "$num_options"

        case "$key" in
            '[A')
                ((selected--))

                if [ "$selected" -lt 0 ]; then
                    selected=$((num_options - 1))
                fi
                ;;

            '[B')
                ((selected++))

                if [ "$selected" -ge "$num_options" ]; then
                    selected=0
                fi
                ;;
        esac
    done

    show_cursor

    return "$selected"
}

# ============================================================
# Select homework
# ============================================================

echo "Select a homework to clone (use ↑/↓ arrows and Enter):"
echo

select_option "${folders[@]}"

choice_idx=$?
folder_name="${folders[$choice_idx]}"

target_dir="$base_dir/hws/$folder_name"

echo
echo -e "Selected: \e[1;34m$folder_name\e[0m"
echo -e "Target:   \e[1;34m$target_dir\e[0m"
echo

# ============================================================
# Check target
# ============================================================

if [ -e "$target_dir" ]; then
    echo "Error: $target_dir already exists."
    exit 1
fi

mkdir -p "$base_dir/hws"

# ============================================================
# Temporary repository
# ============================================================

temp_dir=$(mktemp -d)

if [ -z "$temp_dir" ] || [ ! -d "$temp_dir" ]; then
    echo "Error: Failed to create temporary directory."
    exit 1
fi

cleanup() {
    rm -rf "$temp_dir"
    show_cursor
}

trap cleanup EXIT INT TERM

echo "Setting up temporary repository..."

cd "$temp_dir" || exit 1

git init -q

git remote add origin "$repo_url"

git sparse-checkout init --cone

git sparse-checkout set "hws/$folder_name"

echo "Downloading files from repository..."

if ! git pull origin "$default_branch" --quiet 2>/dev/null; then
    echo "Error: Failed to download homework."
    exit 1
fi

# ============================================================
# Copy homework
# ============================================================

source_dir="$temp_dir/hws/$folder_name"

if [ ! -d "$source_dir" ]; then
    echo "Error: Homework folder was not found after checkout."
    exit 1
fi

cp -a "$source_dir" "$base_dir/hws/"

echo "Files downloaded successfully."

# ============================================================
# Finish
# ============================================================

echo "------------------------------------------------"
echo -e "\e[1;32mHomework $folder_name has been successfully cloned!\e[0m"
echo
echo "Location:"
echo -e "\e[1;33m$base_dir/hws/$folder_name\e[0m"
echo "------------------------------------------------"
