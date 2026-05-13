from pathlib import Path
import random

import torch
from torch import nn, optim
from torch.utils.data import DataLoader, Subset
from torchvision import datasets, transforms

from model import DeepGuardCNN


def _device():
    if torch.cuda.is_available():
        return "cuda"
    if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        return "mps"
    return "cpu"


def _split_indices(dataset, val_ratio=0.18, seed=42):
    by_class = {}
    for index, (_, label) in enumerate(dataset.samples):
        by_class.setdefault(label, []).append(index)

    random.seed(seed)
    train_indices = []
    val_indices = []
    for indices in by_class.values():
        random.shuffle(indices)
        val_count = max(1, int(len(indices) * val_ratio))
        val_indices.extend(indices[:val_count])
        train_indices.extend(indices[val_count:])

    random.shuffle(train_indices)
    random.shuffle(val_indices)
    return train_indices, val_indices


def _evaluate(model, loader, fake_class_index, device):
    model.eval()
    total = 0
    correct = 0
    loss_total = 0.0
    criterion = nn.BCEWithLogitsLoss()
    class_stats = {
        "real": {"total": 0, "correct": 0},
        "fake": {"total": 0, "correct": 0},
    }

    with torch.no_grad():
        for images, labels in loader:
            images = images.to(device)
            fake_labels = (labels == fake_class_index).float().view(-1, 1).to(device)
            logits = model(images)
            loss_total += criterion(logits, fake_labels).item()
            predictions = torch.sigmoid(logits) >= 0.5
            correct_mask = predictions.eq(fake_labels.bool())
            total += labels.size(0)
            correct += correct_mask.sum().item()

            for label, was_correct in zip(labels, correct_mask.view(-1).cpu()):
                class_name = "fake" if label.item() == fake_class_index else "real"
                class_stats[class_name]["total"] += 1
                class_stats[class_name]["correct"] += int(was_correct.item())

    accuracy = correct / max(total, 1)
    real_accuracy = class_stats["real"]["correct"] / max(class_stats["real"]["total"], 1)
    fake_accuracy = class_stats["fake"]["correct"] / max(class_stats["fake"]["total"], 1)
    return {
        "loss": loss_total / max(len(loader), 1),
        "accuracy": accuracy,
        "real_accuracy": real_accuracy,
        "fake_accuracy": fake_accuracy,
    }


def train(data_dir="data/dfdc_faces", output_path="models/deepguard_cnn.pth", epochs=18, batch_size=64, num_workers=0, image_size=128):
    train_transform = transforms.Compose(
        [
            transforms.Resize((image_size, image_size)),
            transforms.RandomHorizontalFlip(),
            transforms.ColorJitter(brightness=0.15, contrast=0.15, saturation=0.1),
            transforms.RandomRotation(5),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ]
    )

    eval_transform = transforms.Compose(
        [
            transforms.Resize((image_size, image_size)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ]
    )

    dataset = datasets.ImageFolder(data_dir, transform=train_transform)
    eval_dataset = datasets.ImageFolder(data_dir, transform=eval_transform)
    fake_class_index = dataset.class_to_idx.get("fake")
    if fake_class_index is None:
        raise ValueError("Expected a 'fake' folder inside the training data directory.")

    train_indices, val_indices = _split_indices(dataset)
    train_subset = Subset(dataset, train_indices)
    val_subset = Subset(eval_dataset, val_indices)
    train_loader = DataLoader(train_subset, batch_size=batch_size, shuffle=True, num_workers=num_workers)
    val_loader = DataLoader(val_subset, batch_size=batch_size, shuffle=False, num_workers=num_workers)
    device = _device()
    print(f"device={device} train={len(train_subset)} val={len(val_subset)}")
    model = DeepGuardCNN().to(device)
    criterion = nn.BCEWithLogitsLoss()
    optimizer = optim.AdamW(model.parameters(), lr=8e-4, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode="max", factor=0.5, patience=3)
    best_score = 0.0
    best_state = None

    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        for images, labels in train_loader:
            images = images.to(device)
            labels = (labels == fake_class_index).float().view(-1, 1).to(device)
            optimizer.zero_grad()
            loss = criterion(model(images), labels)
            loss.backward()
            nn.utils.clip_grad_norm_(model.parameters(), 2.0)
            optimizer.step()
            running_loss += loss.item()

        metrics = _evaluate(model, val_loader, fake_class_index, device)
        scheduler.step(metrics["accuracy"])
        print(
            f"epoch={epoch + 1:02d} "
            f"train_loss={running_loss / len(train_loader):.4f} "
            f"val_loss={metrics['loss']:.4f} "
            f"val_acc={metrics['accuracy']:.3f} "
            f"real_acc={metrics['real_accuracy']:.3f} "
            f"fake_acc={metrics['fake_accuracy']:.3f}"
        )

        balanced_score = (metrics["real_accuracy"] + metrics["fake_accuracy"]) / 2
        if balanced_score > best_score:
            best_score = balanced_score
            best_state = {key: value.detach().cpu() for key, value in model.state_dict().items()}

    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    torch.save(best_state or model.state_dict(), output)
    print(f"saved {output} best_balanced_acc={best_score:.3f}")


if __name__ == "__main__":
    train()
