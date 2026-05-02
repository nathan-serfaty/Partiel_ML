"""Chargement et harmonisation des donnees brutes."""

import pandas as pd
from pathlib import Path

DATA_RAW = Path(__file__).parent.parent / "data" / "raw"
DATA_PROCESSED = Path(__file__).parent.parent / "data" / "processed"

# Mapping des colonnes de langages par annee SO Survey
SO_LANGUAGE_COLUMNS = {
    2017: "HaveWorkedLanguage",
    2018: "LanguageWorkedWith",
    2020: "LanguageWorkedWith",
    2022: "LanguageHaveWorkedWith",
    2023: "LanguageHaveWorkedWith",
    2024: "LanguageHaveWorkedWith",
}


def load_so_survey(year: int) -> pd.DataFrame:
    """Charge un SO survey et retourne le DataFrame brut."""
    path = DATA_RAW / f"so_survey_{year}" / "survey_results_public.csv"
    return pd.read_csv(path, low_memory=False)


def extract_so_language_usage(year: int) -> pd.Series:
    """Extrait le % d'usage de chaque langage pour une annee SO donnee.

    Returns:
        Series indexee par langage, valeurs = pourcentage d'usage.
    """
    df = load_so_survey(year)
    col = SO_LANGUAGE_COLUMNS[year]

    if col not in df.columns:
        raise KeyError(f"Colonne '{col}' introuvable dans SO {year}. "
                       f"Colonnes disponibles: {[c for c in df.columns if 'lang' in c.lower()]}")

    languages = df[col].dropna().str.split(";").explode()
    total_respondents = df[col].dropna().shape[0]
    counts = languages.value_counts()
    return (counts / total_respondents * 100).rename("usage_pct")


def load_all_so_surveys() -> pd.DataFrame:
    """Charge et unifie tous les SO surveys en format long.

    Returns:
        DataFrame avec colonnes: language, year, usage_pct, source
    """
    frames = []
    for year in SO_LANGUAGE_COLUMNS:
        usage = extract_so_language_usage(year)
        frame = usage.reset_index()
        frame.columns = ["language", "usage_pct"]
        frame["year"] = year
        frame["source"] = "stackoverflow"
        frames.append(frame)
    return pd.concat(frames, ignore_index=True)


def load_tiobe() -> pd.DataFrame:
    """Charge les donnees TIOBE-style popularity."""
    path = DATA_RAW / "tiobe_languages" / "Popularity of Programming Languages from 2004 to 2024.csv"
    return pd.read_csv(path)


def load_github_languages() -> dict[str, pd.DataFrame]:
    """Charge les 3 fichiers GitHub Languages (repos, issues, prs)."""
    base = DATA_RAW / "github_languages"
    return {
        "repos": pd.read_csv(base / "repos.csv"),
        "issues": pd.read_csv(base / "issues.csv"),
        "prs": pd.read_csv(base / "prs.csv"),
    }


def load_github_trending() -> pd.DataFrame:
    """Charge le dataset GitHub Daily Trending."""
    return pd.read_csv(DATA_RAW / "github_trending" / "github_daily_trending.csv")


def load_twitter_sentiment() -> tuple[pd.DataFrame, pd.DataFrame]:
    """Charge les datasets Twitter sentiment (training + validation)."""
    base = DATA_RAW / "twitter_sentiment"
    train = pd.read_csv(base / "twitter_training.csv", header=None,
                        names=["id", "entity", "sentiment", "text"])
    val = pd.read_csv(base / "twitter_validation.csv", header=None,
                      names=["id", "entity", "sentiment", "text"])
    return train, val


# Mots-cles pour filtrer les tweets lies aux langages de programmation / IA
PROGRAMMING_KEYWORDS = [
    "python", "javascript", "typescript", "java", "c++", "c#", "rust", "go",
    "golang", "ruby", "php", "swift", "kotlin", "scala", "r lang", "matlab",
    "perl", "lua", "dart", "julia", "haskell", "elixir", "clojure",
    "coding", "programming", "developer", "software",
    "copilot", "chatgpt", "ai", "artificial intelligence", "github copilot",
    "openai", "claude", "llm", "generative ai",
]


def filter_twitter_programming(df: pd.DataFrame) -> pd.DataFrame:
    """Filtre les tweets lies aux langages de programmation et a l'IA."""
    pattern = "|".join(PROGRAMMING_KEYWORDS)
    mask = df["text"].str.lower().str.contains(pattern, na=False)
    return df[mask].copy()
