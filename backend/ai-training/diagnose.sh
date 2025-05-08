#!/bin/bash

# Comprehensive system and directory diagnostics
echo "=== System Diagnostics ==="
echo "Current Directory: $(pwd)"
echo "Python Path: $(which python3)"
python3 --version
echo "Home Directory: $HOME"

echo "=== Directory Contents ==="
ls -la

echo "=== Dataset Directory ==="
ls -la /Users/richy/Documents/Github/LumaScope/backend/ai-training/data/cell_images

echo "=== Python Environment Test ==="
python3 -c "
import sys
import os

print('Python Executable:', sys.executable)
print('Python Version:', sys.version)
print('Current Working Directory:', os.getcwd())
print('Home Directory:', os.path.expanduser('~'))
print('Dataset Directory Contents:')
try:
    print(os.listdir('/Users/richy/Documents/Github/LumaScope/backend/ai-training/data/cell_images'))
except Exception as e:
    print('Error listing dataset directory:', e)
"
