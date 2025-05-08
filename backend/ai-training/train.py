import os
import numpy as np
# Standard Python and PyTorch libraries for machine learning
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader, random_split
import torchvision.transforms as transforms

# Ultralytics library for YOLO model implementation
import ultralytics
from ultralytics import YOLO

# Configure logging and set random seed for reproducibility
torch.manual_seed(42)  # Ensures consistent results across runs

class BloodCellDataset(Dataset):
    """
    Custom dataset for Blood Cell Classification
    
    This class is designed to handle the loading and preprocessing of blood cell images.
    It provides a custom implementation of the PyTorch Dataset class, allowing for 
    efficient data loading and manipulation.
    
    Attributes:
        data_dir (str): Path to dataset root
        transform (callable): Image preprocessing transformations
        cell_types (list): Supported blood cell types for classification
        images (list): Full paths to all image files
        labels (list): Corresponding integer labels for each image
    """
    def __init__(self, data_dir, transform=None):
        """Initialize a custom dataset for multi-class blood cell classification.
        
        This dataset dynamically loads images from a directory structure where
        each subdirectory represents a different cell type. It supports flexible
        image transformations and provides an easy-to-use interface for PyTorch models.
        
        Args:
            data_dir (str): Root directory containing cell type subdirectories
            transform (callable, optional): Image transformation pipeline
        """
        self.data_dir = data_dir
        self.transform = transform
        
        # Predefined cell types with consistent ordering for label encoding
        self.cell_types = ['EOSINOPHIL', 'LYMPHOCYTE', 'MONOCYTE', 'NEUTROPHIL']
        
        # Initialize lists to store image paths and labels
        self.images = []
        self.labels = []
        
        # Dynamically discover and categorize images
        # Handle potential nested directory structures
        for root, dirs, files in os.walk(data_dir):
            for cell_type in self.cell_types:
                if cell_type.lower() in root.lower():
                    for img_name in files:
                        # Support multiple image formats for flexibility
                        if img_name.lower().endswith(('.png', '.jpg', '.jpeg', '.tif', '.tiff')):
                            full_path = os.path.join(root, img_name)
                            self.images.append(full_path)
                            # Convert cell type to integer label using index
                            # Enables multi-class classification
                            label = self.cell_types.index(cell_type)
                            self.labels.append(label)
        
    def __len__(self):
        """Return the total number of images in the dataset.
        
        Returns:
            int: Number of images in the dataset
        """
        return len(self.images)
    
    def __getitem__(self, idx):
        """Retrieve and preprocess an image at the specified index.
        
        This method is called by PyTorch DataLoader during training and inference.
        It handles image loading, color conversion, and optional transformations.
        
        Args:
            idx (int): Index of the image to retrieve
        
        Returns:
            tuple: Processed image tensor and its corresponding label
        """
        image_path = self.images[idx]
        label = self.labels[idx]
        
        # Load image using PIL, convert to RGB to ensure 3 color channels
        image = Image.open(image_path).convert('RGB')
        
        # Apply transformations if specified
        # Allows for data augmentation and normalization
        if self.transform:
            image = self.transform(image)
        
        return image, label

def train_model(data_dir, model_path='blood_cell_classification_model.pt', epochs=50, batch_size=32):
    """Train a multi-class blood cell classification model using Ultralytics YOLO.
    
    This function handles the entire training pipeline, including:
    1. Dataset preparation
    2. Model initialization
    3. Training configuration
    4. Performance tracking
    
    Args:
        data_dir (str): Root directory of training images
        model_path (str): Path to save trained model weights
        epochs (int, optional): Number of training epochs. Defaults to 50.
        batch_size (int, optional): Training batch size. Defaults to 32.
    
    Returns:
        dict: Training results and performance metrics
    """
    import os
    import yaml
    from ultralytics import YOLO
    
    # Prepare YOLO-compatible dataset configuration
    def prepare_yolo_dataset_yaml(data_dir):
        # Define cell types based on directory structure
        cell_types = ['EOSINOPHIL', 'LYMPHOCYTE', 'MONOCYTE', 'NEUTROPHIL']
        
        # Prepare train and validation paths
        train_path = os.path.join(data_dir, 'train')
        val_path = os.path.join(data_dir, 'val')
        
        # Create directories if they don't exist
        os.makedirs(train_path, exist_ok=True)
        os.makedirs(val_path, exist_ok=True)
        
        # Split dataset into train and validation
        for cell_type in cell_types:
            type_dir = os.path.join(data_dir, cell_type)
            if os.path.exists(type_dir):
                # Get all images for this cell type
                images = [f for f in os.listdir(type_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.tif', '.tiff'))]
                
                # Simple 80-20 train-val split
                train_count = int(len(images) * 0.8)
                train_images = images[:train_count]
                val_images = images[train_count:]
                
                # Create train and val subdirectories for each cell type
                os.makedirs(os.path.join(train_path, cell_type), exist_ok=True)
                os.makedirs(os.path.join(val_path, cell_type), exist_ok=True)
                
                # Copy images to train and val directories
                for img in train_images:
                    os.symlink(
                        os.path.join(type_dir, img), 
                        os.path.join(train_path, cell_type, img)
                    )
                for img in val_images:
                    os.symlink(
                        os.path.join(type_dir, img), 
                        os.path.join(val_path, cell_type, img)
                    )
        
        # Create YAML configuration for YOLO
        dataset_yaml = {
            'train': train_path,
            'val': val_path,
            'nc': len(cell_types),
            'names': cell_types
        }
        
        yaml_path = os.path.join(data_dir, 'blood_cell_dataset.yaml')
        with open(yaml_path, 'w') as f:
            yaml.dump(dataset_yaml, f)
        
        return yaml_path
    
    # Prepare dataset configuration
    dataset_yaml_path = prepare_yolo_dataset_yaml(data_dir)
    
    # Initialize YOLO model
    model = YOLO('yolov8n-cls.pt')  # Start with a pre-trained classification model
    
    # Train the model
    results = model.train(
        data=dataset_yaml_path,
        epochs=epochs,
        batch=batch_size,
        imgsz=224,  # Standard input size for classification
        save=True,
        project=os.path.dirname(model_path),
        name=os.path.basename(model_path).replace('.pt', '')
    )
    
    # Save the final model
    model.save(model_path)
    
    return results
    # Additional comprehensive diagnostics
    print("\n--- System and Library Diagnostics ---")
    try:
        import torch
        import torchvision
        import ultralytics
        
        print(f"PyTorch Version: {torch.__version__}")
        print(f"TorchVision Version: {torchvision.__version__}")
        print(f"Ultralytics Version: {ultralytics.__version__}")
    except ImportError as e:
        print(f"Library Import Error: {e}")
    
    # Detailed dataset diagnostics
    print(f"\nDataset Directory: {data_dir}")
    print("Dataset Contents:")
    image_extensions = ['.png', '.jpg', '.jpeg', '.tif', '.tiff']
    cell_types = ['EOSINOPHIL', 'LYMPHOCYTE', 'MONOCYTE', 'NEUTROPHIL']
    
    # Comprehensive error checking
    if not os.path.exists(data_dir):
        raise FileNotFoundError(f"Dataset directory not found: {data_dir}")
    
    # Validate dataset structure with recursive search
    dataset_valid = False
    total_images = 0
    
    # Recursive directory search function
    def find_images(directory):
        images_found = []
        for root, dirs, files in os.walk(directory):
            for file in files:
                if any(file.lower().endswith(ext) for ext in image_extensions):
                    images_found.append(os.path.join(root, file))
        return images_found
    
    # Search for images in each cell type
    for cell_type in cell_types:
        cell_type_images = []
        for root, dirs, files in os.walk(data_dir):
            # Check if current directory matches cell type (case-insensitive)
            if cell_type.lower() in root.lower():
                cell_type_images.extend([
                    os.path.join(root, f) for f in files 
                    if any(f.lower().endswith(ext) for ext in image_extensions)
                ])
        
        print(f"{cell_type}: {len(cell_type_images)} images")
        total_images += len(cell_type_images)
        
        if len(cell_type_images) > 0:
            dataset_valid = True
    
    print(f"Total images found: {total_images}")
    
    if not dataset_valid:
        raise ValueError("No valid images found in the dataset. Please check the dataset structure.")
    import os
    import sys
    import logging
    import traceback
    
    # Diagnostic print statements
    print(f"Python Executable: {sys.executable}")
    print(f"Python Version: {sys.version}")
    print(f"Current Working Directory: {os.getcwd()}")
    print(f"Script Location: {__file__}")
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO, 
        format='%(asctime)s - %(levelname)s: %(message)s',
        handlers=[
            logging.FileHandler('training_log.txt'),
            logging.StreamHandler()
        ]
    )
    logger = logging.getLogger(__name__)
    
    with open(yaml_path, 'w') as f:
        f.write(yaml_content)
    
    logger.info(f"Created dataset configuration: {yaml_path}")
    
    try:
        # Initialize YOLO classification model
        model = YOLO('yolov8n-cls.pt')  # Use pre-trained nano classification model
        
        logger.info("Starting model training...")
        
        # Training configuration
        results = model.train(
            data=yaml_path,
            epochs=epochs,
            imgsz=224,
            batch=batch_size,
            project='blood_cell_classification',
            name='training_run',
            verbose=True
        )
        
        logger.info("Model training completed successfully.")
        
        # Performance evaluation
        metrics = {
            'accuracy': results.results_dict.get('top1_acc', 0),
            'confusion_matrix': None,  # Placeholder for detailed metrics
            'cell_types': cell_types
        }
        
        # Save model weights
        model.save(model_path)
        logger.info(f"Model weights saved to: {model_path}")
        
        return results, metrics
    
    except Exception as e:
        logger.error(f"Training failed: {e}")
        raise

def evaluate_model(model, val_loader):
    """Comprehensively assess model performance on validation dataset.
    
    Calculates key performance metrics:
    1. Overall accuracy
    2. Confusion matrix for detailed error analysis
    3. Per-class performance insights
    
    Args:
        model: Trained classification model
        val_loader: DataLoader containing validation dataset
    
    Returns:
        dict: Detailed performance metrics
    """
    # Set model to evaluation mode
    # Disables dropout and batch normalization updates
    model.eval()
    
    # Performance tracking variables
    correct = 0
    total = 0
    
    # Confusion matrix tracks prediction accuracy for each cell type
    confusion_matrix = torch.zeros(
        len(val_loader.dataset.dataset.cell_types), 
        len(val_loader.dataset.dataset.cell_types)
    )
    
    # Disable gradient computation to reduce memory usage
    with torch.no_grad():
        for inputs, labels in val_loader:
            # Forward pass through the model
            outputs = model(inputs)
            
            # Select class with highest probability
            _, predicted = torch.max(outputs, 1)
            
            # Update total sample and correct prediction counts
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
            
            # Populate confusion matrix
            # Tracks prediction accuracy for each cell type
            for true_label, pred_label in zip(labels, predicted):
                confusion_matrix[true_label.long(), pred_label.long()] += 1
    
    # Calculate overall accuracy percentage
    accuracy = 100 * correct / total
    
    return {
        'accuracy': accuracy,
        'confusion_matrix': confusion_matrix.numpy(),
        'cell_types': val_loader.dataset.dataset.cell_types
    }

def main():
    data_dir = '/Users/richy/Documents/Github/LumaScope/backend/ai-training/data/cell_images'
    results, metrics = train_model(data_dir)
    model.save('/Users/richy/Documents/Github/LumaScope/backend/ai-training/leukemia_detection_model.pt')
    
    print("Training complete. Model saved.")

if __name__ == '__main__':
    """Main entry point for blood cell classification model training.
    
    This script serves multiple purposes:
    1. Standalone training script for the blood cell classification model
    2. Demonstrates usage of train_model and evaluate_model functions
    3. Provides a quick way to train and assess model performance
    
    Configuration can be easily modified for different datasets, 
    training parameters, and model architectures.
    """
    # Configurable training parameters
    # Adjust these based on dataset size, computational resources, and performance needs
    data_dir = './data/cell_images'  # Updated data directory
    model_path = 'blood_cell_classification_model.pt'  # Output model weights file
    
    # Training hyperparameters
    training_config = {
        'epochs': 50,        # Number of complete training passes
        'batch_size': 32,   # Number of images per training iteration
        'learning_rate': 0.001,  # Initial learning rate
        'validation_split': 0.2,  # Percentage of data used for validation
    }
    
    # Execute model training with specified configuration
    results, metrics = train_model(
        data_dir, 
        model_path, 
        epochs=training_config['epochs'], 
        batch_size=training_config['batch_size']
    )
    
    # Performance reporting
    print("\n--- Blood Cell Classification Model Training Results ---")
    print(f"Training Accuracy: {metrics['accuracy']:.2f}%")
    print("\nConfusion Matrix:")
    print(metrics['confusion_matrix'])
    
    # Detailed per-class performance breakdown
    print("\nCell Type Performance:")
    for i, cell_type in enumerate(metrics['cell_types']):
        class_accuracy = (metrics['confusion_matrix'][i, i] / 
                         metrics['confusion_matrix'][i].sum()) * 100
        print(f"{cell_type}: {class_accuracy:.2f}% accuracy")
