# Pertinence des langages de programmation à l'ère de l'IA générative

Projet de Machine Learning analysant l'impact de l'IA générative (ChatGPT, Copilot, Claude) sur la pertinence des langages de programmation. Pipeline complet : collecte de données, EDA, feature engineering, modeling (classification + régression), analyse de sentiment NLP, et scoring final.

## Découverte principale

L'hypothèse "l'IA tue certains langages" **n'est pas confirmée** par les données. Notre score `ai_susceptibility` arrive au **rang 17/21** en importance SHAP. Les facteurs réellement prédictifs du déclin sont l'âge du langage, son niveau d'abstraction, et s'il est compilé — des dynamiques structurelles bien antérieures à l'IA.

## Données

Panel mensuel de **21 165 observations**, 60 langages, 2004-2024. Sources Kaggle :

| Source | Granularité | Lien |
|---|---|---|
| Stack Overflow Developer Survey (2017-2024) | Annuel | [Kaggle](https://www.kaggle.com/datasets/stackoverflow/so-survey-2017) |
| TIOBE Index (2004-2024) | Mensuel | [Kaggle](https://www.kaggle.com/datasets/muhammadkhalid/most-popular-programming-languages-since-2004) |
| GitHub Languages (2011-2022) | Trimestriel | [Kaggle](https://www.kaggle.com/datasets/isaacwen/github-programming-languages-data) |
| GitHub Daily Trending | Quotidien | [Kaggle](https://www.kaggle.com/datasets/satoshiss/github-daily-trending-repos) |
| Twitter Entity Sentiment | Ponctuel | [Kaggle](https://www.kaggle.com/datasets/jp797498e/twitter-entity-sentiment-analysis) |

## Structure du dépôt

```
├── src/
│   ├── data_loading.py      # Chargement et normalisation des 10 sources
│   ├── features.py           # Feature engineering + AI susceptibility scores
│   └── models.py             # Split temporel, métriques, sérialisation
├── notebooks/
│   ├── 01_eda.ipynb           # Analyse exploratoire + 6 figures
│   ├── 02_feature_engineering.ipynb  # Construction des features
│   ├── 03_modeling.ipynb      # 5 classifieurs + régression + SHAP
│   └── 04_sentiment_and_scoring.ipynb  # NLP + célébrités + score final
├── models/                    # Modèles sérialisés + hyperparamètres
├── reports/
│   ├── final_report.md        # Rapport complet (8 sections + annexes)
│   ├── language_pertinence_ranking.csv  # Ranking des 60 langages
│   └── figures/               # 14 visualisations
└── data/
    ├── raw/                   # Données brutes (10 sources)
    └── processed/             # Panels et features transformés
```

## Reproduction

```bash
# Installer les dépendances
pip install -r requirements.txt

# Exécuter les notebooks dans l'ordre
jupyter notebook notebooks/01_eda.ipynb
jupyter notebook notebooks/02_feature_engineering.ipynb
jupyter notebook notebooks/03_modeling.ipynb
jupyter notebook notebooks/04_sentiment_and_scoring.ipynb
```

Les données brutes doivent être placées dans `data/raw/` (voir les liens Kaggle ci-dessus).

## Résultats clés

- **Meilleur modèle** : LogReg L2 — F1 macro = 0.628, ROC-AUC = 0.781 (bat les baselines de +0.17)
- **Top 3 langages 2026** : Python (0.898), R (0.613), C# (0.596)
- **Crédibilité célébrités** : 0.72/1.00 (les créateurs de langages sont plus fiables que les CEOs)

Rapport complet : [`reports/final_report.md`](reports/final_report.md)
