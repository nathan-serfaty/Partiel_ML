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

# Colonnes utiles par annee (chargement efficace)
SO_USEFUL_COLUMNS = {
    2017: ["Respondent", "HaveWorkedLanguage", "YearsProgram", "DeveloperType"],
    2018: ["Respondent", "LanguageWorkedWith", "YearsCoding", "DevType"],
    2020: ["Respondent", "LanguageWorkedWith", "YearsCode", "DevType"],
    2022: ["Respondent", "LanguageHaveWorkedWith", "YearsCode", "DevType"],
    2023: ["ResponseId", "LanguageHaveWorkedWith", "YearsCode", "DevType",
           "AISearchHaveWorkedWith", "AIDevHaveWorkedWith", "AISent", "AIAcc"],
    2024: ["ResponseId", "LanguageHaveWorkedWith", "YearsCode", "DevType",
           "AISearchDevHaveWorkedWith", "AISent", "AIAcc"],
}

# Normalisation des noms de langages : variantes → nom canonique
# Decisions :
# - HTML, CSS, HTML/CSS exclus (pas des langages de programmation)
# - Bash/Shell variantes unifiees
# - Casse harmonisee (MATLAB, COBOL, etc.)
# - Delphi variantes unifiees
# - VB variantes unifiees
LANGUAGE_NORMALIZATION = {
    # Exclusions (mapped to None, filtered out later)
    "HTML": None,
    "CSS": None,
    "HTML/CSS": None,
    "SCSS": None,
    "Sass": None,
    "Less": None,
    # Bash/Shell variants
    "Bash/Shell (all shells)": "Bash/Shell",
    "Bash/Shell/PowerShell": "Bash/Shell",
    "Shell": "Bash/Shell",
    # Case normalization
    "Cobol": "COBOL",
    "Matlab": "MATLAB",
    "Ocaml": "OCaml",
    "LISP": "Lisp",
    "Common Lisp": "Lisp",
    "Emacs Lisp": "Lisp",
    "FORTRAN": "Fortran",
    # Delphi variants
    "Delphi": "Delphi/Object Pascal",
    "Delphi/Pascal": "Delphi/Object Pascal",
    # VB variants
    "Visual Basic (.Net)": "VB.NET",
    "Visual Basic .NET": "VB.NET",
    "Visual Basic": "VB.NET",
    # C/C++ in TIOBE (combined) — kept distinct in SO
    "C/C++": "C/C++",
    # Powershell casing
    "Powershell": "PowerShell",
    # Perl 6 → Raku
    "Perl 6": "Raku",
    "Perl6": "Raku",
}


def normalize_language_name(name) -> str | None:
    """Normalise un nom de langage vers sa forme canonique.

    Returns:
        Le nom canonique, ou None si le langage doit etre exclu (HTML/CSS).
    """
    if not isinstance(name, str):
        return None
    name = name.strip()
    if name in LANGUAGE_NORMALIZATION:
        return LANGUAGE_NORMALIZATION[name]
    return name


def load_so_survey(year: int, usecols: list[str] | None = None) -> pd.DataFrame:
    """Charge un SO survey. Par defaut, charge uniquement les colonnes utiles."""
    path = DATA_RAW / f"so_survey_{year}" / "survey_results_public.csv"
    if usecols is None:
        usecols = SO_USEFUL_COLUMNS.get(year)
    # Some columns may not exist in the CSV; filter to existing ones
    if usecols is not None:
        all_cols = pd.read_csv(path, nrows=0).columns.tolist()
        usecols = [c for c in usecols if c in all_cols]
    return pd.read_csv(path, usecols=usecols, low_memory=False)


def extract_so_language_usage(year: int) -> pd.DataFrame:
    """Extrait le % d'usage de chaque langage pour une annee SO donnee.

    Returns:
        DataFrame avec colonnes: language, usage_pct, n_respondents
    """
    col = SO_LANGUAGE_COLUMNS[year]
    df = load_so_survey(year, usecols=[col])

    series = df[col].dropna()
    total_respondents = len(series)
    languages = series.str.split(";").explode().str.strip()

    # Normalize names
    languages = languages.map(normalize_language_name)
    languages = languages.dropna()  # Drop excluded (HTML/CSS)

    counts = languages.value_counts()
    usage = (counts / total_respondents * 100).reset_index()
    usage.columns = ["language", "usage_pct"]
    usage["n_respondents"] = total_respondents
    return usage


def load_all_so_surveys() -> pd.DataFrame:
    """Charge et unifie tous les SO surveys en format long.

    Returns:
        DataFrame: language, year, usage_pct, n_respondents, source
    """
    frames = []
    for year in SO_LANGUAGE_COLUMNS:
        usage = extract_so_language_usage(year)
        usage["year"] = year
        usage["source"] = "stackoverflow"
        frames.append(usage)
    return pd.concat(frames, ignore_index=True)


def load_tiobe_long() -> pd.DataFrame:
    """Charge TIOBE et le convertit en format long normalise.

    Returns:
        DataFrame: language, year, usage_pct, n_respondents, source
    """
    path = DATA_RAW / "tiobe_languages" / "Popularity of Programming Languages from 2004 to 2024.csv"
    df = pd.read_csv(path)
    df["year"] = pd.to_datetime(df["Date"], format="mixed").dt.year

    # Moyenne annuelle par langage
    lang_cols = [c for c in df.columns if c != "Date" and c != "year"]
    yearly = df.groupby("year")[lang_cols].mean()

    long = yearly.reset_index().melt(id_vars="year", var_name="language", value_name="usage_pct")
    long["language"] = long["language"].map(normalize_language_name)
    long = long[long["language"].notna()]
    long["n_respondents"] = pd.NA
    long["source"] = "tiobe"
    return long[["language", "year", "usage_pct", "n_respondents", "source"]]


def load_github_activity_long() -> pd.DataFrame:
    """Charge GitHub issues+PRs et les convertit en format long normalise.

    Calcule un usage_pct = part de chaque langage dans le total issues+PRs par annee.

    Returns:
        DataFrame: language, year, usage_pct, n_respondents, source
    """
    base = DATA_RAW / "github_languages"
    issues = pd.read_csv(base / "issues.csv")
    prs = pd.read_csv(base / "prs.csv")

    # Combine issues + PRs
    combined = pd.concat([
        issues.rename(columns={"name": "language"}),
        prs.rename(columns={"name": "language"}),
    ])
    yearly = combined.groupby(["language", "year"])["count"].sum().reset_index()

    # Compute yearly share
    totals = yearly.groupby("year")["count"].transform("sum")
    yearly["usage_pct"] = yearly["count"] / totals * 100

    yearly["language"] = yearly["language"].map(normalize_language_name)
    yearly = yearly[yearly["language"].notna()]
    yearly = yearly.groupby(["language", "year"])["usage_pct"].sum().reset_index()
    yearly["n_respondents"] = pd.NA
    yearly["source"] = "github"
    return yearly[["language", "year", "usage_pct", "n_respondents", "source"]]


def build_unified_panel() -> pd.DataFrame:
    """Construit le panel unifie multi-sources.

    Returns:
        DataFrame: language, year, source, usage_pct, n_respondents
    """
    so = load_all_so_surveys()
    tiobe = load_tiobe_long()
    github = load_github_activity_long()
    panel = pd.concat([so, tiobe, github], ignore_index=True)
    panel["year"] = panel["year"].astype(int)
    return panel[["language", "year", "source", "usage_pct", "n_respondents"]]


def load_tiobe() -> pd.DataFrame:
    """Charge les donnees TIOBE-style popularity (format brut)."""
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
    import re
    pattern = "|".join(re.escape(kw) for kw in PROGRAMMING_KEYWORDS)
    mask = df["text"].str.lower().str.contains(pattern, na=False)
    return df[mask].copy()
