import sys
import os

def print_system_info():
    print("Python Executable:", sys.executable)
    print("Python Version:", sys.version)
    print("Current Working Directory:", os.getcwd())
    print("Script Location:", __file__)

    try:
        import torch
        print("PyTorch Version:", torch.__version__)
    except ImportError as e:
        print("PyTorch Import Error:", e)

    try:
        import ultralytics
        print("Ultralytics Version:", ultralytics.__version__)
    except ImportError as e:
        print("Ultralytics Import Error:", e)

    # Check dataset directory
    data_dir = '/Users/richy/Documents/Github/LumaScope/backend/ai-training/data/cell_images'
    print("\nDataset Directory:", data_dir)
    
    if os.path.exists(data_dir):
        print("Dataset Directory Contents:")
        for item in os.listdir(data_dir):
            print(f"- {item}")
    else:
        print("Dataset directory does not exist!")

if __name__ == '__main__':
    print_system_info()
