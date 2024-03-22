#!/bin/bash

# Function to convert files to Unix format recursively
convert_files() {
    local current_directory="$1"
    # Navigate to the directory
    cd "$current_directory" || { echo "Directory not found"; exit 1; }

    # Loop through all files and directories in the current directory
    for item in *; do
        if [ -f "$item" ]; then
            # If it's a file, run dos2unix
            dos2unix "$item"
            echo "Converted $item to Unix format"
        elif [ -d "$item" ]; then
            # If it's a directory, call the function recursively
            convert_files "$item"
        fi
    done
}

# Specify the top-level directory containing the files
top_directory="test-network/scripts"

# Call the function to start conversion from the top-level directory
convert_files "$top_directory"

echo "Conversion complete"

