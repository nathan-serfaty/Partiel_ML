"""Entrainement, evaluation et sauvegarde des modeles."""

import pickle
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score, f1_score, roc_auc_score, confusion_matrix,
    mean_absolute_error, mean_squared_error, mean_absolute_percentage_error,
)

MODELS_DIR = Path(__file__).parent.parent / "models"
SEED = 42


def temporal_split(df: pd.DataFrame, train_max: int = 2021,
                   val_years: tuple = (2022, 2023), test_year: int = 2024):
    """Split temporel strict: train <= 2021, val 2022-2023, test 2024."""
    train = df[df["year"] <= train_max]
    val = df[df["year"].isin(val_years)]
    test = df[df["year"] == test_year]
    return train, val, test


def evaluate_classification(y_true, y_pred, y_proba=None) -> dict:
    """Metriques de classification: accuracy, F1 macro, ROC-AUC."""
    metrics = {
        "accuracy": accuracy_score(y_true, y_pred),
        "f1_macro": f1_score(y_true, y_pred, average="macro", zero_division=0),
        "confusion_matrix": confusion_matrix(y_true, y_pred),
    }
    if y_proba is not None and len(np.unique(y_true)) == 2:
        metrics["roc_auc"] = roc_auc_score(y_true, y_proba)
    return metrics


def evaluate_regression(y_true, y_pred) -> dict:
    """Metriques de regression: MAE, RMSE, MAPE."""
    return {
        "mae": mean_absolute_error(y_true, y_pred),
        "rmse": np.sqrt(mean_squared_error(y_true, y_pred)),
        "mape": mean_absolute_percentage_error(y_true, y_pred),
    }


def save_model(model, name: str):
    """Sauvegarde un modele en pickle."""
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    path = MODELS_DIR / f"{name}.pkl"
    with open(path, "wb") as f:
        pickle.dump(model, f)
    return path


def load_model(name: str):
    """Charge un modele depuis pickle."""
    path = MODELS_DIR / f"{name}.pkl"
    with open(path, "rb") as f:
        return pickle.load(f)
