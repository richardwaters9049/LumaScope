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

class LeukemiaCellDataset(Dataset):
    def __init__(self, data_dir, transform=None):
        """
        Custom dataset for Leukemia Cell Classification
        
        Args:
            data_dir (str): Directory containing cell images
            transform (callable, optional): Optional transform to be applied on a sample
        """
        self.data_dir = data_dir
        self.transform = transform
        
        # Categorize images into normal and leukemia classes
        self.images = []
        self.labels = []
        
        # Handle multiple dataset directories
        dataset_dirs = [os.path.join(data_dir, d) for d in os.listdir(data_dir) if os.path.isdir(os.path.join(data_dir, d))]
        
        for dataset_dir in dataset_dirs:
            for class_name in ['normal', 'leukemia']:
                class_dir = os.path.join(dataset_dir, class_name)
                if os.path.exists(class_dir):
                    for img_name in os.listdir(class_dir):
                        if img_name.lower().endswith(('.png', '.jpg', '.jpeg', '.tif', '.tiff')):
                            self.images.append(os.path.join(class_dir, img_name))
                            self.labels.append(1 if class_name == 'leukemia' else 0)
        
    def __len__(self):
        return len(self.images)
    
    def __getitem__(self, idx):
        img_path = self.images[idx]
        image = Image.open(img_path).convert('RGB')
        label = self.labels[idx]
        
        if self.transform:
            image = self.transform(image)
        
        return image, label

def train_leukemia_detection_model(data_dir):
    """
    Train a YOLOv8 model for leukemia cell detection
    
    Args:
        data_dir (str): Directory containing training data
    """
    # Data transformations
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    # Create dataset and dataloader
    dataset = LeukemiaCellDataset(data_dir, transform=transform)
    
    # Split dataset
    train_size = int(0.8 * len(dataset))
    val_size = len(dataset) - train_size
    train_dataset, val_dataset = torch.utils.data.random_split(dataset, [train_size, val_size])
    
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)
    
    # Initialize YOLO model
    model = YOLO('yolov8n.pt')  # Start with pre-trained weights
    
    # Training configuration
    results = model.train(
        data=data_dir,
        epochs=50,
        imgsz=224,
        batch=32,
        plots=True
    )
    
    return model, results

def main():
    data_dir = '/Users/richy/Documents/Github/LumaScope/backend/ai-training/data/cell_images'
    model, training_results = train_leukemia_detection_model(data_dir)
    
    # Save the trained model
    model.save('/Users/richy/Documents/Github/LumaScope/backend/ai-training/leukemia_detection_model.pt')
    
    print("Training complete. Model saved.")

if __name__ == '__main__':
    main()
