# LumaScope AI Training Module 🧬

## Dataset: AML-Cytomorphology_LMU

### Overview

- **Source**: The Cancer Imaging Archive (TCIA)
- **Total Images**: 18,365 expert-labeled single-cell images
- **Patient Groups**: AML patients and controls
- **Image Size**: 11GB main image set

### Data Structure

```bash
backend/ai-training/data/
├── dataset-master/
│   ├── normal/
│   │   └── *.png
│   └── leukemia/
│       └── *.png
└── dataset2-master/
    ├── normal/
    │   └── *.png
    └── leukemia/
        └── *.png
```

## Training Process

### Preprocessing

- Image normalization
- Resize to 224x224 pixels
- Binary classification (Normal vs Leukemia)

### Model

- Base Model: YOLOv8
- Transfer Learning
- Training Split: 80% train, 20% validation

## Running Training

```bash
# Install dependencies
pip install -r requirements.txt

# Run training script
python train.py
```

## Output

- Trained model: `leukemia_detection_model.pt`
- Training logs and metrics

## Dependencies

- PyTorch
- Ultralytics YOLOv8
- scikit-learn
- SHAP

## Limitations

- Current model is a binary classifier
- Performance depends on dataset quality
