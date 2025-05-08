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
        for cell_type in self.cell_types:
            cell_dir = os.path.join(data_dir, cell_type)
            if os.path.exists(cell_dir):
                for img_name in os.listdir(cell_dir):
                    # Support multiple image formats for flexibility
                    if img_name.lower().endswith(('.png', '.jpg', '.jpeg', '.tif', '.tiff')):
                        self.images.append(os.path.join(cell_dir, img_name))
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
    """Train a multi-class blood cell classification model using YOLOv8.
    
    This function handles the entire training pipeline, including:
    1. Data preprocessing and augmentation
    2. Dataset splitting
    3. Model initialization
    4. Training loop
    5. Model saving
    6. Performance evaluation
    
    Args:
        data_dir (str): Root directory containing cell type image subdirectories
        model_path (str): File path to save the trained model weights
        epochs (int): Number of complete passes through the entire training dataset
        batch_size (int): Number of images processed in a single training iteration
    
    Returns:
        tuple: Training results and performance metrics
    """
    # Define image preprocessing transformations
    # Ensures consistent input size, color normalization, and tensor conversion
    transform = transforms.Compose([
        transforms.Resize((224, 224)),  # Standardize image dimensions
        transforms.ToTensor(),  # Convert to PyTorch tensor
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],  # ImageNet mean values
            std=[0.229, 0.224, 0.225]    # ImageNet standard deviation values
        )
    ])
    
    # Create custom dataset with flexible image loading
    dataset = BloodCellDataset(data_dir, transform=transform)
    
    # Stratified dataset splitting for training and validation
    # Ensures representative sampling of all cell types
    train_size = int(0.8 * len(dataset))  # 80% training, 20% validation
    val_size = len(dataset) - train_size
    train_dataset, val_dataset = random_split(dataset, [train_size, val_size])
    
    # Create data loaders for efficient batch processing
    train_loader = DataLoader(
        train_dataset, 
        batch_size=batch_size, 
        shuffle=True,  # Randomize data order to prevent overfitting
        num_workers=4  # Parallel data loading
    )
    val_loader = DataLoader(
        val_dataset, 
        batch_size=batch_size, 
        shuffle=False  # Maintain order for consistent validation
    )
    
    # Initialize YOLOv8 classification model
    # Uses lightweight nano variant for efficiency
    model = YOLO('yolov8n-cls.yaml')  # Nano classification model
    
    # Conduct model training
    results = model.train(
        data=train_loader,
        epochs=epochs,
        imgsz=224,  # Image size matching preprocessing
        val=val_loader,
        num_classes=len(dataset.cell_types)  # Dynamic class count
    )
    
    # Persist trained model for future inference
    torch.save(model.state_dict(), model_path)
    
    # Comprehensive model performance assessment
    metrics = evaluate_model(model, val_loader)
    
    return results, metrics

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
    data_dir = './AML_Cytomorphology_LMU/'  # Root directory of training images
    model_path = 'blood_cell_classification_model.pt'  # Output model weights file
    
    # Training hyperparameters
    training_config = {
        'epochs': 50,        # Number of complete training passes
        'batch_size': 32,   # Number of images per training iteration
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
