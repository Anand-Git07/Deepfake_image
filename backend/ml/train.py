from pathlib import Path

import torch
from torch import nn, optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

from model import DeepGuardCNN


def train(data_dir="data/dfdc_faces", output_path="models/deepguard_cnn.pth", epochs=8, batch_size=32):
    transform = transforms.Compose(
        [
            transforms.Resize((224, 224)),
            transforms.RandomHorizontalFlip(),
            transforms.ColorJitter(brightness=0.15, contrast=0.15, saturation=0.1),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ]
    )
    dataset = datasets.ImageFolder(data_dir, transform=transform)
    fake_class_index = dataset.class_to_idx.get("fake")
    if fake_class_index is None:
        raise ValueError("Expected a 'fake' folder inside the training data directory.")

    loader = DataLoader(dataset, batch_size=batch_size, shuffle=True, num_workers=2)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = DeepGuardCNN().to(device)
    criterion = nn.BCEWithLogitsLoss()
    optimizer = optim.AdamW(model.parameters(), lr=3e-4, weight_decay=1e-4)

    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        for images, labels in loader:
            images = images.to(device)
            labels = (labels == fake_class_index).float().view(-1, 1).to(device)
            optimizer.zero_grad()
            loss = criterion(model(images), labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()
        print(f"epoch={epoch + 1} loss={running_loss / len(loader):.4f}")

    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    torch.save(model.state_dict(), output)
    print(f"saved {output}")


if __name__ == "__main__":
    train()
