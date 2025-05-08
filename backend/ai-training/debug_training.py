import os
import sys
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

def check_environment():
    """Check Python and library environment."""
    logger.info(f"Python Version: {sys.version}")
    
    try:
        import torch
        logger.info(f"PyTorch Version: {torch.__version__}")
    except ImportError:
        logger.error("PyTorch not installed")
    
    try:
        import ultralytics
        logger.info(f"Ultralytics Version: {ultralytics.__version__}")
    except ImportError:
        logger.error("Ultralytics not installed")

def check_dataset(data_dir):
    """Check dataset structure and image count."""
    logger.info(f"Checking dataset in: {data_dir}")
    
    if not os.path.exists(data_dir):
        logger.error(f"Data directory not found: {data_dir}")
        return
    
    image_extensions = ['.png', '.jpg', '.jpeg', '.tif', '.tiff']
    cell_types = ['EOSINOPHIL', 'LYMPHOCYTE', 'MONOCYTE', 'NEUTROPHIL']
    
    for cell_type in cell_types:
        type_path = os.path.join(data_dir, cell_type)
        if os.path.exists(type_path):
            images = [f for f in os.listdir(type_path) if any(f.lower().endswith(ext) for ext in image_extensions)]
            logger.info(f"{cell_type}: {len(images)} images")
        else:
            logger.warning(f"No directory found for {cell_type}")

def main():
    data_dir = '/Users/richy/Documents/Github/LumaScope/backend/ai-training/data/cell_images'
    
    check_environment()
    check_dataset(data_dir)

if __name__ == '__main__':
    main()
