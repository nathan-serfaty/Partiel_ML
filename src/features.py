"""Feature engineering pour le panel langages x annees."""

import pandas as pd
import numpy as np


def compute_temporal_features(panel: pd.DataFrame) -> pd.DataFrame:
    """Ajoute les features temporelles au panel (language, year, usage_pct).

    Features ajoutees:
        - delta_1y: variation absolue sur 1 an
        - delta_3y: variation absolue sur 3 ans
        - volatility_3y: ecart-type glissant sur 3 ans
        - rank: rang par usage_pct (par annee)
        - delta_rank: variation du rang sur 1 an
    """
    df = panel.sort_values(["language", "year"]).copy()

    df["delta_1y"] = df.groupby("language")["usage_pct"].diff(1)
    df["delta_3y"] = df.groupby("language")["usage_pct"].diff(3)
    df["volatility_3y"] = (
        df.groupby("language")["usage_pct"]
        .rolling(3, min_periods=2)
        .std()
        .reset_index(level=0, drop=True)
    )
    df["rank"] = df.groupby("year")["usage_pct"].rank(ascending=False, method="min")
    df["delta_rank"] = df.groupby("language")["rank"].diff(1)

    return df


def compute_decline_label(panel: pd.DataFrame, threshold: float = -0.15) -> pd.DataFrame:
    """Ajoute le label de classification 'decline'.

    decline = 1 si usage_pct(t+2) - usage_pct(t) < threshold * usage_pct(t)
    (variation relative < -15%)
    """
    df = panel.sort_values(["language", "year"]).copy()
    df["usage_pct_t2"] = df.groupby("language")["usage_pct"].shift(-2)
    df["relative_change_2y"] = (df["usage_pct_t2"] - df["usage_pct"]) / df["usage_pct"]
    df["decline"] = (df["relative_change_2y"] < threshold).astype(int)
    return df


def compute_regression_target(panel: pd.DataFrame) -> pd.DataFrame:
    """Ajoute la target de regression: usage_pct a t+2."""
    df = panel.sort_values(["language", "year"]).copy()
    df["target_usage_pct_t2"] = df.groupby("language")["usage_pct"].shift(-2)
    return df
