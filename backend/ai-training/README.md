# LumaScope AI Training Module 🧬

## Dataset: AML-Cytomorphology_LMU

### Overview

- **Source**: [Kaggle Blood Cells Dataset](https://www.kaggle.com/datasets/paultimothymooney/blood-cells)
- **Total Images**: 12,500+ single-cell images
- **Cell Types**: Eosinophil, Lymphocyte, Monocyte, Neutrophil
- **Image Format**: PNG

### Data Structure

```bash
backend/ai-training/data/
├── blood-cells/
│   ├── EOSINOPHIL/
│   ├── LYMPHOCYTE/
│   ├── MONOCYTE/
│   └── NEUTROPHIL/
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
