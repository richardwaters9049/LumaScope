import os
import numpy as np
import pandas as pd
import torch
import torchvision
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image
import ultralytics
from ultralytics import YOLO

class BloodCellDataset(Dataset):
    def __init__(self, data_dir, transform=None):
        """
        Custom dataset for Blood Cell Classification
        
        Args:
            data_dir (str): Directory containing cell images
            transform (callable, optional): Optional transform to be applied on a sample
        """
        self.data_dir = data_dir
        self.transform = transform
        
        # Cell types
        self.cell_types = ['EOSINOPHIL', 'LYMPHOCYTE', 'MONOCYTE', 'NEUTROPHIL']
        
        # Categorize images
        self.images = []
        self.labels = []
        
        for cell_type in self.cell_types:
            cell_dir = os.path.join(data_dir, cell_type)
            if os.path.exists(cell_dir):
                for img_name in os.listdir(cell_dir):
                    if img_name.lower().endswith(('.png', '.jpg', '.jpeg', '.tif', '.tiff')):
                        self.images.append(os.path.join(cell_dir, img_name))
                        # One-hot encoding for multi-class classification
                        label = self.cell_types.index(cell_type)
                        self.labels.append(label)
        
    def __len__(self):
        return len(self.images)
    
    def __getitem__(self, idx):
        img_path = self.images[idx]
        image = Image.open(img_path).convert('RGB')
        label = self.labels[idx]
        
        if self.transform:
            image = self.transform(image)
        
        return image, label

def train_model(data_dir, model_path='blood_cell_classification_model.pt', epochs=50, batch_size=32):
    """
    Train YOLOv8 model for multi-class blood cell classification
    
    Args:
        data_dir (str): Directory containing training images
        model_path (str): Path to save trained model
        epochs (int): Number of training epochs
        batch_size (int): Batch size for training
    """
    # Set up data transformations
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    # Create dataset
    dataset = BloodCellDataset(data_dir, transform=transform)
    
    # Split dataset
    train_size = int(0.8 * len(dataset))
    val_size = len(dataset) - train_size
    train_dataset, val_dataset = random_split(dataset, [train_size, val_size])
    
    # Create data loaders
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
    
    # Initialize model with multi-class configuration
    model = YOLO('yolov8n-cls.yaml')  # Classification variant of YOLOv8
    
    # Training
    results = model.train(
        data=train_loader,
        epochs=epochs,
        imgsz=224,
        val=val_loader,
        num_classes=len(dataset.cell_types)  # Specify number of classes
    )
    
    # Save model
    torch.save(model.state_dict(), model_path)
    
    # Model evaluation
    metrics = evaluate_model(model, val_loader)
    
    return results, metrics

def evaluate_model(model, val_loader):
    """
    Evaluate model performance
    
    Args:
        model: Trained model
        val_loader: Validation data loader
    
    Returns:
        dict: Performance metrics
    """
    model.eval()
    correct = 0
    total = 0
    confusion_matrix = torch.zeros(len(val_loader.dataset.dataset.cell_types), 
                                   len(val_loader.dataset.dataset.cell_types))
    
    with torch.no_grad():
        for inputs, labels in val_loader:
            outputs = model(inputs)
            _, predicted = torch.max(outputs, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
            
            # Update confusion matrix
            for t, p in zip(labels, predicted):
                confusion_matrix[t.long(), p.long()] += 1
    
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
    main()
