# Pertinence des langages de programmation a l'ere de l'IA generative

Projet de Machine Learning analysant l'evolution de l'usage des langages de programmation et predisant lesquels risquent de decliner sous l'effet de l'IA generative (ChatGPT, Copilot, Claude).

## Structure

```
Data_tuka/
├── CLAUDE_LOG.md          # Journal de bord du projet
├── data/
│   ├── raw/               # Datasets bruts (SO surveys, GitHub, TIOBE, Twitter)
│   └── processed/         # Donnees nettoyees (parquet/csv)
├── notebooks/
│   ├── 01_eda.ipynb
│   ├── 02_feature_engineering.ipynb
│   ├── 03_modeling.ipynb
│   └── 04_sentiment_and_scoring.ipynb
├── src/
│   ├── data_loading.py    # Chargement et harmonisation des donnees
│   ├── features.py        # Feature engineering
│   └── models.py          # Entrainement et evaluation
├── models/                # Modeles sauvegardes (.pkl)
└── reports/figures/       # Visualisations
```

## Sources de donnees

- Stack Overflow Developer Survey (2017, 2018, 2020, 2022, 2023, 2024)
- GitHub Programming Languages (2011-2021)
- GitHub Daily Trending Repos
- TIOBE-style Language Popularity (2004-2024)
- Twitter Entity Sentiment Analysis

## Installation

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
