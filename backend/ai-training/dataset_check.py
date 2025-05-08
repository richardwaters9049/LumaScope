import os
import sys

def print_directory_structure(directory):
    print(f"Checking directory: {directory}")
    print("=" * 50)
    
    if not os.path.exists(directory):
        print(f"ERROR: Directory does not exist: {directory}")
        return
    
    for root, dirs, files in os.walk(directory):
        level = root.replace(directory, '').count(os.sep)
        indent = ' ' * 4 * level
        print(f"{indent}{os.path.basename(root)}/")
        
        subindent = ' ' * 4 * (level + 1)
        for file in files:
            print(f"{subindent}{file}")

def main():
    data_dir = '/Users/richy/Documents/Github/LumaScope/backend/ai-training/data/cell_images'
    print_directory_structure(data_dir)

if __name__ == '__main__':
    main()
