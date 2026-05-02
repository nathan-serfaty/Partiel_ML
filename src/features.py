"""Feature engineering pour le panel langages x annees."""

import pandas as pd
import numpy as np
from pathlib import Path

DATA_PROCESSED = Path(__file__).parent.parent / "data" / "processed"

# Seuil de declin configurable (variation relative sur 2 ans)
DECLINE_THRESHOLD = -0.15

# ================================================================
# METADATA LANGAGES
# ================================================================

# Composante manuelle du AI_susceptibility_score
# Logique: les langages dont le code est facilement generable par LLM
# (web/scripting, boilerplate-heavy) ont un score eleve.
# Les langages systems/embedded/niche ont un score bas.
MANUAL_AI_SCORES = {
    # Web frontend / scripting leger : 0.8-1.0
    "JavaScript": 0.90, "TypeScript": 0.85, "PHP": 0.90, "Ruby": 0.85,
    "CoffeeScript": 0.85, "Dart": 0.80, "VBA": 0.90, "VB.NET": 0.90,
    # Web backend / data science : 0.5-0.7
    "Python": 0.70, "Java": 0.70, "C#": 0.65, "Kotlin": 0.60,
    "Swift": 0.55, "R": 0.65, "MATLAB": 0.60, "SQL": 0.75,
    "Scala": 0.55, "Groovy": 0.65, "PowerShell": 0.70,
    "Bash/Shell": 0.65, "Objective-C": 0.55,
    # Systems / embedded / low-level : 0.1-0.3
    "C": 0.20, "C++": 0.25, "Rust": 0.20, "Assembly": 0.10,
    "Fortran": 0.15, "Ada": 0.15, "COBOL": 0.20,
    "Delphi/Object Pascal": 0.25, "Zig": 0.15,
    # DSL / niche / fonctionnel : 0.3-0.6
    "Go": 0.45, "Haskell": 0.30, "Clojure": 0.35, "Elixir": 0.40,
    "Erlang": 0.30, "F#": 0.35, "OCaml": 0.30, "Lisp": 0.30,
    "Prolog": 0.25, "Julia": 0.40, "Lua": 0.45, "Perl": 0.55,
    "Raku": 0.35, "Solidity": 0.50, "GDScript": 0.50,
    "Crystal": 0.40, "Nim": 0.35, "MicroPython": 0.60,
    "APL": 0.15, "Zephyr": 0.20, "SAS": 0.55,
    # Combined (TIOBE)
    "C/C++": 0.22, "Abap": 0.50,
}

MANUAL_AI_JUSTIFICATIONS = {
    "JavaScript": "Langage web dominant, enorme corpus d'entrainement LLM, boilerplate eleve",
    "TypeScript": "Superset de JS, tres bien gere par les LLMs, mais typage ajoute complexite",
    "PHP": "Code web legacy, tres repetitif, parfaitement generable par LLM",
    "Ruby": "Rails = convention over configuration, patterns tres previsibles pour LLM",
    "Python": "Langage #1 du ML/data, bien gere par LLM mais diversite d'usages le protege",
    "Java": "Verbeux et boilerplate-heavy, tres bien gere par LLM, mais ecosysteme entreprise solide",
    "C#": "Similar a Java, bon support LLM, ecosysteme .NET entreprise",
    "C": "Proche du hardware, gestion memoire manuelle, LLM genere du code C moins fiable",
    "C++": "Complexite du langage (templates, RAII) rend la generation LLM moins fiable",
    "Rust": "Borrow checker rend la generation LLM tres difficile, erreurs subtiles",
    "Go": "Syntaxe simple mais patterns concurrence specifiques, moderement generable",
    "Haskell": "Systeme de types avance, monadique, peu de corpus d'entrainement",
    "Assembly": "Specifique a l'architecture, quasi-impossible pour un LLM",
    "SQL": "Declaratif et repetitif, tres bien gere par LLM",
    "VBA": "Macro Office, patterns extremement repetitifs, generable a 100%",
    "VB.NET": "Legacy Microsoft, en declin naturel, boilerplate eleve",
    "Bash/Shell": "Scripts courts et repetitifs, bien geres par LLM",
    "Kotlin": "Modern, concis, LLM le gere bien mais moins de corpus que Java",
    "Swift": "Ecosysteme Apple ferme, LLM moins entraine dessus",
    "R": "Statistique, patterns repetitifs, bien gere pour le data analysis",
    "Delphi/Object Pascal": "Legacy, tres peu de corpus LLM, communaute reduite",
    "COBOL": "Legacy mainframe, peu de corpus, mais patterns repetitifs",
    "Lua": "Scripting jeux, simple, moderement generable",
    "Perl": "Syntaxe cryptique mais patterns connus, moderement generable",
}

# Metadata langages : paradigme, annee de creation
LANGUAGE_METADATA = {
    "JavaScript": {"year_created": 1995, "typing": "dynamic", "compiled": False, "level": "high", "paradigm": "multi"},
    "TypeScript": {"year_created": 2012, "typing": "static", "compiled": True, "level": "high", "paradigm": "multi"},
    "Python": {"year_created": 1991, "typing": "dynamic", "compiled": False, "level": "high", "paradigm": "multi"},
    "Java": {"year_created": 1995, "typing": "static", "compiled": True, "level": "high", "paradigm": "oop"},
    "C#": {"year_created": 2000, "typing": "static", "compiled": True, "level": "high", "paradigm": "oop"},
    "C": {"year_created": 1972, "typing": "static", "compiled": True, "level": "low", "paradigm": "procedural"},
    "C++": {"year_created": 1985, "typing": "static", "compiled": True, "level": "low", "paradigm": "multi"},
    "PHP": {"year_created": 1995, "typing": "dynamic", "compiled": False, "level": "high", "paradigm": "multi"},
    "Ruby": {"year_created": 1995, "typing": "dynamic", "compiled": False, "level": "high", "paradigm": "oop"},
    "Go": {"year_created": 2009, "typing": "static", "compiled": True, "level": "mid", "paradigm": "multi"},
    "Rust": {"year_created": 2010, "typing": "static", "compiled": True, "level": "low", "paradigm": "multi"},
    "Swift": {"year_created": 2014, "typing": "static", "compiled": True, "level": "high", "paradigm": "multi"},
    "Kotlin": {"year_created": 2011, "typing": "static", "compiled": True, "level": "high", "paradigm": "multi"},
    "Dart": {"year_created": 2011, "typing": "static", "compiled": True, "level": "high", "paradigm": "oop"},
    "R": {"year_created": 1993, "typing": "dynamic", "compiled": False, "level": "high", "paradigm": "multi"},
    "SQL": {"year_created": 1974, "typing": "static", "compiled": False, "level": "high", "paradigm": "declarative"},
    "Bash/Shell": {"year_created": 1989, "typing": "dynamic", "compiled": False, "level": "high", "paradigm": "procedural"},
    "PowerShell": {"year_created": 2006, "typing": "dynamic", "compiled": False, "level": "high", "paradigm": "multi"},
    "Scala": {"year_created": 2004, "typing": "static", "compiled": True, "level": "high", "paradigm": "multi"},
    "Haskell": {"year_created": 1990, "typing": "static", "compiled": True, "level": "high", "paradigm": "functional"},
    "Lua": {"year_created": 1993, "typing": "dynamic", "compiled": False, "level": "high", "paradigm": "multi"},
    "Perl": {"year_created": 1987, "typing": "dynamic", "compiled": False, "level": "high", "paradigm": "multi"},
    "MATLAB": {"year_created": 1984, "typing": "dynamic", "compiled": False, "level": "high", "paradigm": "multi"},
    "Assembly": {"year_created": 1949, "typing": "static", "compiled": True, "level": "low", "paradigm": "procedural"},
    "Objective-C": {"year_created": 1984, "typing": "static", "compiled": True, "level": "mid", "paradigm": "oop"},
    "Clojure": {"year_created": 2007, "typing": "dynamic", "compiled": True, "level": "high", "paradigm": "functional"},
    "Elixir": {"year_created": 2011, "typing": "dynamic", "compiled": True, "level": "high", "paradigm": "functional"},
    "Erlang": {"year_created": 1986, "typing": "dynamic", "compiled": True, "level": "high", "paradigm": "functional"},
    "F#": {"year_created": 2005, "typing": "static", "compiled": True, "level": "high", "paradigm": "functional"},
    "Julia": {"year_created": 2012, "typing": "dynamic", "compiled": True, "level": "high", "paradigm": "multi"},
    "VBA": {"year_created": 1993, "typing": "dynamic", "compiled": False, "level": "high", "paradigm": "procedural"},
    "VB.NET": {"year_created": 2001, "typing": "static", "compiled": True, "level": "high", "paradigm": "oop"},
    "Delphi/Object Pascal": {"year_created": 1995, "typing": "static", "compiled": True, "level": "mid", "paradigm": "oop"},
    "COBOL": {"year_created": 1959, "typing": "static", "compiled": True, "level": "high", "paradigm": "procedural"},
    "Fortran": {"year_created": 1957, "typing": "static", "compiled": True, "level": "mid", "paradigm": "procedural"},
    "Ada": {"year_created": 1980, "typing": "static", "compiled": True, "level": "mid", "paradigm": "multi"},
    "Solidity": {"year_created": 2015, "typing": "static", "compiled": True, "level": "high", "paradigm": "oop"},
    "GDScript": {"year_created": 2014, "typing": "dynamic", "compiled": False, "level": "high", "paradigm": "oop"},
    "OCaml": {"year_created": 1996, "typing": "static", "compiled": True, "level": "high", "paradigm": "functional"},
    "Lisp": {"year_created": 1958, "typing": "dynamic", "compiled": False, "level": "high", "paradigm": "functional"},
    "Prolog": {"year_created": 1972, "typing": "dynamic", "compiled": False, "level": "high", "paradigm": "logic"},
    "Groovy": {"year_created": 2003, "typing": "dynamic", "compiled": True, "level": "high", "paradigm": "oop"},
    "SAS": {"year_created": 1976, "typing": "static", "compiled": False, "level": "high", "paradigm": "procedural"},
    "Zig": {"year_created": 2016, "typing": "static", "compiled": True, "level": "low", "paradigm": "procedural"},
}


def build_language_metadata(ai_adoption_rates: pd.DataFrame | None = None) -> pd.DataFrame:
    """Construit le fichier de metadata par langage.

    Args:
        ai_adoption_rates: DataFrame with columns [language, ai_adoption_rate]
            from SO 2023+2024 AISelect data. If None, uses manual scores only.

    Returns:
        DataFrame with language metadata, AI scores, and justifications.
    """
    rows = []
    for lang, manual_score in MANUAL_AI_SCORES.items():
        meta = LANGUAGE_METADATA.get(lang, {})
        row = {
            "language": lang,
            "ai_susceptibility_manual": manual_score,
            "year_created": meta.get("year_created", pd.NA),
            "typing": meta.get("typing", "unknown"),
            "compiled": meta.get("compiled", pd.NA),
            "level": meta.get("level", "unknown"),
            "paradigm": meta.get("paradigm", "unknown"),
            "justification": MANUAL_AI_JUSTIFICATIONS.get(lang, ""),
        }

        if ai_adoption_rates is not None:
            match = ai_adoption_rates[ai_adoption_rates.language == lang]
            if len(match) > 0:
                rate = match.iloc[0]["ai_adoption_rate"]
                row["ai_adoption_data"] = rate
                row["ai_susceptibility_score"] = 0.5 * manual_score + 0.5 * rate
            else:
                row["ai_adoption_data"] = pd.NA
                row["ai_susceptibility_score"] = manual_score
        else:
            row["ai_adoption_data"] = pd.NA
            row["ai_susceptibility_score"] = manual_score

        rows.append(row)

    return pd.DataFrame(rows)


# ================================================================
# TEMPORAL FEATURES
# ================================================================

def compute_temporal_features(panel: pd.DataFrame) -> pd.DataFrame:
    """Ajoute les features temporelles au panel.

    Gere les gaps temporels : calcule delta_since_last_obs avec
    years_since_last_obs pour ne pas confondre delta_1y et delta_2y.

    Features ajoutees:
        - delta_since_last_obs: variation absolue depuis la derniere observation
        - years_since_last_obs: nombre d'annees entre les 2 observations
        - delta_annualized: delta_since_last_obs / years_since_last_obs
        - volatility_3obs: ecart-type glissant sur les 3 dernieres observations
        - rank: rang par usage_pct (par annee, par source)
        - delta_rank: variation du rang depuis la derniere observation
    """
    df = panel.sort_values(["source", "language", "year"]).copy()

    # Group by source+language for within-source temporal features
    grp = df.groupby(["source", "language"])

    # Delta since last observation
    df["delta_since_last_obs"] = grp["usage_pct"].diff()
    df["years_since_last_obs"] = grp["year"].diff()
    df["delta_annualized"] = df["delta_since_last_obs"] / df["years_since_last_obs"]

    # Volatility over 3 observations (rolling std)
    df["volatility_3obs"] = (
        grp["usage_pct"]
        .rolling(3, min_periods=2)
        .std()
        .reset_index(level=[0, 1], drop=True)
    )

    # Rank within source and year
    df["rank"] = df.groupby(["source", "year"])["usage_pct"].rank(
        ascending=False, method="min"
    )
    df["delta_rank"] = grp["rank"].diff()

    return df


def build_multisource_features(panel_with_temporal: pd.DataFrame) -> pd.DataFrame:
    """Construit les features multi-sources pour chaque (langage, annee).

    Pivote les features par source (SO, GitHub, TIOBE) puis ajoute
    des features de consensus.

    Returns:
        DataFrame indexe par (language, year) avec features par source
        + features consensus.
    """
    df = panel_with_temporal.copy()

    # Pivot usage_pct by source
    usage_pivot = df.pivot_table(
        index=["language", "year"],
        columns="source",
        values="usage_pct",
    )
    usage_pivot.columns = [f"usage_pct_{s}" for s in usage_pivot.columns]

    # Pivot delta_annualized by source
    delta_pivot = df.pivot_table(
        index=["language", "year"],
        columns="source",
        values="delta_annualized",
    )
    delta_pivot.columns = [f"delta_ann_{s}" for s in delta_pivot.columns]

    # Pivot rank by source
    rank_pivot = df.pivot_table(
        index=["language", "year"],
        columns="source",
        values="rank",
    )
    rank_pivot.columns = [f"rank_{s}" for s in rank_pivot.columns]

    # Pivot volatility by source
    vol_pivot = df.pivot_table(
        index=["language", "year"],
        columns="source",
        values="volatility_3obs",
    )
    vol_pivot.columns = [f"volatility_{s}" for s in vol_pivot.columns]

    # n_respondents from SO
    n_resp = df[df.source == "stackoverflow"].set_index(["language", "year"])[["n_respondents"]]

    # Merge all
    result = pd.concat([usage_pivot, delta_pivot, rank_pivot, vol_pivot], axis=1)
    result = result.join(n_resp, how="left")

    # Consensus features
    usage_cols = [c for c in result.columns if c.startswith("usage_pct_")]
    result["usage_pct_mean"] = result[usage_cols].mean(axis=1)
    result["sources_agreement"] = result[usage_cols].std(axis=1)  # Low = consensus
    result["n_sources_available"] = result[usage_cols].notna().sum(axis=1)

    return result.reset_index()


# ================================================================
# TARGETS
# ================================================================

def compute_targets(features_df: pd.DataFrame, threshold: float = DECLINE_THRESHOLD) -> pd.DataFrame:
    """Ajoute les targets de classification et regression.

    Classification: decline = 1 si usage_pct_so change de plus de `threshold`
    relativement sur 2 ans (t → t+2).
    Regression: target_usage_pct_t2 = usage_pct_so a t+2.

    Uses SO as primary source for targets (most complete survey data).
    Falls back to usage_pct_mean if SO not available.
    """
    df = features_df.sort_values(["language", "year"]).copy()

    # Primary target source: SO
    target_col = "usage_pct_stackoverflow"
    if target_col not in df.columns:
        target_col = "usage_pct_mean"

    # Compute t+2 target (shift -2 within each language, ordered by year)
    # CAREFUL: shift by position, not by year value, due to gaps
    # We need to look ahead 2 observations, then check if year difference is ~2
    grp = df.groupby("language")
    df["_target_raw"] = grp[target_col].shift(-2)
    df["_target_year"] = grp["year"].shift(-2)
    df["_years_ahead"] = df["_target_year"] - df["year"]

    # Only keep targets where the look-ahead is reasonable (2-3 years)
    valid_target = df["_years_ahead"].between(1, 4)

    df["target_usage_pct_t2"] = df["_target_raw"].where(valid_target)

    # Relative change for classification
    current = df[target_col]
    df["relative_change_2y"] = (
        (df["target_usage_pct_t2"] - current) / current
    ).where(valid_target & (current > 0))

    df["decline"] = (df["relative_change_2y"] < threshold).astype("Int64")
    df.loc[df["relative_change_2y"].isna(), "decline"] = pd.NA

    # Cleanup temp columns
    df.drop(columns=["_target_raw", "_target_year", "_years_ahead"], inplace=True)

    return df


def analyze_threshold_candidates(features_df: pd.DataFrame, target_col: str = "usage_pct_stackoverflow") -> pd.DataFrame:
    """Analyse la distribution des delta_2y relatifs pour calibrer le seuil.

    Returns summary for thresholds -10%, -15%, -20%.
    """
    df = features_df.copy()
    grp = df.groupby("language")
    df["_target_raw"] = grp[target_col].shift(-2)
    df["_target_year"] = grp["year"].shift(-2)
    df["_years_ahead"] = df["_target_year"] - df["year"]

    valid = df["_years_ahead"].between(1, 4) & (df[target_col] > 0)
    rel_change = ((df["_target_raw"] - df[target_col]) / df[target_col]).where(valid).dropna()

    results = []
    for thresh in [-0.10, -0.15, -0.20, -0.25]:
        n_decline = (rel_change < thresh).sum()
        n_total = len(rel_change)
        results.append({
            "threshold": f"{thresh:.0%}",
            "n_decline": n_decline,
            "n_stable_growth": n_total - n_decline,
            "pct_decline": n_decline / n_total * 100,
            "n_total": n_total,
        })

    return pd.DataFrame(results)
