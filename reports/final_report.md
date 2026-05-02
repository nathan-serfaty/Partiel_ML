# Pertinence des langages de programmation a l'ere de l'IA generative

## TL;DR

**Question de depart :** L'IA generative (ChatGPT, Copilot, Claude) va-t-elle rendre certains langages de programmation obsoletes ? Les langages dont le code est "facilement generable par LLM" sont-ils en declin accelere ?

**Methodologie :** Nous avons construit un panel mensuel de 21 165 observations couvrant 60 langages sur 2004-2024, a partir de 10 sources (Stack Overflow, TIOBE, GitHub). Un pipeline ML complet (LogReg, XGBoost, LightGBM, SHAP) predit le declin relatif d'un langage sur differents horizons temporels. Le tout est complete par une analyse de sentiment NLP (Twitter/RoBERTa) et un suivi des predictions d'entrepreneurs tech.

**Decouverte principale :** L'hypothese "l'IA tue certains langages" n'est **pas confirmee** par les donnees. Notre score `ai_susceptibility` — mesurant la facilite de generation LLM par langage — arrive au rang 17/21 en importance SHAP. Les facteurs reellement predictifs du declin sont l'age du langage, son niveau d'abstraction, et s'il est compile. Ce n'est pas l'IA qui decide quels langages declinent : ce sont des dynamiques structurelles et de marche bien plus anciennes.

---

## 1. Contexte et hypothese

Depuis la sortie de ChatGPT (novembre 2022) et de GitHub Copilot, de nombreux leaders de l'industrie ont predit la fin du code manuel :

- **Jensen Huang** (NVIDIA, fev. 2024) : *"It is our job to create computing technology such that nobody has to program."*
- **Dario Amodei** (Anthropic, mars 2025) : *"AI could write 90% of code in 3 to 6 months."*
- **Andrej Karpathy** (janv. 2023) : *"The hottest new programming language is English."*
- **Sam Altman** (OpenAI, janv. 2024) : *"AI coders will surpass humans by end of 2025."*

En parallele, les predictions specifiques a des langages se sont averees plus fiables :
- **Linus Torvalds** : *"Let's wait 10 years"* — C toujours dominant dans le kernel.
- **Anders Hejlsberg** : TypeScript en croissance (+66% de contributeurs en 2024).
- **Mark Russinovich** (Microsoft Azure) : Rust en croissance comme remplacant de C/C++.

Sur nos 15 predictions suivies, 9 se sont realisees (60%), 3 sont en cours, et 3 ne se sont pas realisees. Les predictions les plus fiables viennent des createurs de langages specifiques, pas des CEOs generalistes.

**Hypothese testee :** Si l'IA generative accelere le declin de certains langages, ceux dont le code est le plus facilement generable par LLM (JavaScript, PHP, Ruby — code web repetitif) devraient decliner plus vite que ceux qui resistent a la generation (Rust, C, Haskell — code systeme/formel).

---

## 2. Donnees et methodologie

### 2.1 Sources de donnees

| Source | Type | Couverture | Granularite |
|---|---|---|---|
| Stack Overflow Developer Survey | % d'usage auto-declare | 2017-2024 (6 annees) | Annuel |
| TIOBE Index | Part de marche (requetes moteurs) | Jul 2004 - Dec 2024 | Mensuel |
| GitHub Issues + PRs | Activite open-source | Q3 2011 - Q4 2022 | Trimestriel |
| GitHub Daily Trending | Repos tendances | Nov 2024 - Oct 2025 | Quotidien |
| Twitter Entity Sentiment | Sentiment general | ~75 000 tweets | Ponctuel |

### 2.2 Construction du panel

- **Panel unifie mensuel** : 12 148 lignes, 80 langages, 3 sources principales
- **Normalisation des noms** : 20+ variantes mappees (ex: "Visual Basic (.Net)" → "VB.NET"), HTML/CSS exclus
- **Features temporelles** : delta 1/3/6/12 obs, moyennes mobiles, volatilite 12 mois, momentum 6 mois, distance au pic, rang
- **Target** : declin binaire (variation relative < -15% sur N observations)
- **Panel final avec targets multi-horizons** : 21 165 lignes x 38 colonnes, 60 langages

### 2.3 Strategie ML

- **Split temporel strict** : train <= Dec 2020, val Jan 2021 - Jun 2022, test >= Jul 2022
- **Modeles testes** : LogReg L2, Random Forest, XGBoost, LightGBM
- **Evaluation** : F1 macro, ROC-AUC, PR-AUC, block bootstrap CI 95% par langage
- **Verification anti-fuite** : toutes les features backward-looking, targets via shift(-N)

---

## 3. Resultats EDA

### 3.1 Tendances post-LLM (2022-2024)

Les plus fortes hausses relatives post-ChatGPT :
- **Rust** : +187% relatif (de ~4.5% a ~12.6%)
- **TypeScript** : +78.5%
- **Go** : +71.9%

Les plus fortes chutes :
- **VB.NET** : -35.9%
- **PHP** : -30.1%
- **Ruby** : -28.6%
- **Swift** : -25.8%

### 3.2 Coherence inter-sources

La correlation entre Stack Overflow et GitHub atteint 0.861, confirmant que les deux sources racontent la meme histoire. Le "point de rupture" 2022 est visible : les changements s'accelerent apres ChatGPT, mais ils suivent des tendances structurelles pre-existantes.

---

## 4. Resultats du modeling

### 4.1 Performances comparees

| Modele | F1 macro test | ROC-AUC | PR-AUC | CI 95% bootstrap |
|---|---|---|---|---|
| Baseline naive (majorite) | 0.459 | — | — | — |
| Baseline metier (momentum+delta) | 0.451 | — | — | [0.403, 0.496] |
| **LogReg L2** | **0.628** | 0.781 | 0.434 | [0.523, 0.714] |
| LightGBM | 0.543 | 0.693 | 0.281 | — |
| XGBoost | 0.550 | 0.685 | 0.298 | — |
| Random Forest | 0.521 | 0.695 | 0.304 | — |

Le LogReg L2 bat les deux baselines de +0.17 F1 (significatif, CIs non chevauchants). Les modeles a arbres sur-apprennent massivement (XGBoost : CV F1=0.74 vs test F1=0.54, gap +0.20).

### 4.2 Le twist : ai_susceptibility n'est pas predictif

C'est le resultat le plus important de l'etude. Notre score `ai_susceptibility_score` — combinant une composante manuelle (facilite de generation LLM) et une composante data-driven (taux d'adoption IA par langage dans les SO 2023-2024) — arrive seulement au **rang 17 sur 21 features** en importance SHAP.

**Top 5 features predictives du declin :**

| Rang | Feature | Interpretation |
|---|---|---|
| 1 | language_age | Les vieux langages declinent plus |
| 2 | level_num | Langages bas niveau = plus stables |
| 3 | is_compiled | Compile = moins de declin |
| 4 | distance_to_peak | Loin du pic historique = declin probable |
| 5 | usage_pct | Usage actuel eleve = inertie |

### 4.3 Pourquoi l'hypothese IA ne se confirme pas ?

Quatre explications complementaires :

1. **Effet de second ordre** : L'IA aide a *ecrire* du JavaScript, mais cela ne reduit pas la *demande* pour JavaScript. Au contraire, si le code est plus facile a produire, la demande pour le langage pourrait augmenter (paradoxe de Jevons).

2. **Lenteur des cycles d'adoption** : Un langage ne disparait pas en 2 ans. COBOL est predit mort depuis 1990. Les entreprises ont des millions de lignes de code en production — la migration coute plus cher que le maintien.

3. **Biais de l'hypothese** : Nous avons suppose que "generable par LLM = vulnerable". Mais les langages les plus generables (Python, JavaScript) sont aussi les mieux documentes, les plus communautaires, les plus demandes. La "generabilite" est un proxy de la popularite, pas de la vulnerabilite.

4. **Fenetre d'observation trop courte** : L'ere LLM date de fin 2022. Avec seulement ~2 ans de recul, les effets structurels n'ont peut-etre pas eu le temps de se materialiser dans les metriques de popularite.

---

## 5. Sentiment communautaire et avis d'experts

### 5.1 Sentiment Twitter (RoBERTa)

Sur 5 000 tweets echantillonnes et analyses via `cardiffnlp/twitter-roberta-base-sentiment-latest`, seuls 13 tweets ont pu etre attribues a un langage specifique (6 langages detectes). Le dataset Twitter est **generique** (entites comme Google, FIFA, Amazon) et non specifique aux developpeurs.

**Limitation majeure** : Ce signal est trop faible pour etre statistiquement exploitable. Le poids de 15% dans le score final est donc applique a un signal quasi-nul pour la plupart des langages, ce qui les ramene a la valeur neutre (0.5).

### 5.2 Track record des predictions celebrities

| Categorie | Score | Exemples |
|---|---|---|
| Predictions realisees (9/15) | 1.0 | Pichai (Google 25% AI code), Torvalds (C stable), Hejlsberg (TS growth) |
| En cours (3/15) | 0.5 | Karpathy (English = programming), Andreessen (AI eating software) |
| Non realisees (3/15) | 0.0-0.25 | Huang (don't learn to code), Amodei (90% code en 6 mois) |

**Credibilite globale : 0.72/1.00**

Observation : les predictions les plus fiables sont celles des createurs de langages (Torvalds, Hejlsberg, van Rossum), pas celles des CEOs generalistes. Les predictions quantitatives et chronologiques ("90% en 6 mois") se realisent rarement dans les delais annonces.

**Disclaimer** : 15 citations constituent un echantillon anecdotique, pas une analyse statistique. Cette section est illustrative.

---

## 6. Score de pertinence final

### 6.1 Methodologie du score

Vu que `ai_susceptibility_score` n'est pas predictif (rang 17/21 SHAP), il est **exclu** du score final. La ponderation revisee :

```
pertinence(langage) =
    0.45 * (1 - prob_decline_modele)     # prediction ML
  + 0.20 * usage_actuel_normalise        # taille du marche
  + 0.15 * sentiment_communaute          # signal humain (limite)
  + 0.10 * momentum_normalise            # tendance recente
  + 0.10 * stabilite_structurelle        # 1 - volatilite
```

Ce choix est delibere : inclure une feature non predictive dans le score final biaiserait les recommandations sans apporter de valeur informative.

### 6.2 Top 15 — Langages a apprendre en 2026

| Rang | Langage | Score | Forces |
|---|---|---|---|
| 1 | **Python** | 0.823 | #1 usage, momentum maximal, ecosysteme IA/ML |
| 2 | **Swift** | 0.619 | Faible prob. declin, bonne stabilite |
| 3 | **R** | 0.618 | Niche solide (stats/data science), stable |
| 4 | **Rust** | 0.610 | Forte croissance, adoption Microsoft/Linux |
| 5 | **C#** | 0.600 | Ecosysteme .NET, usage entreprise solide |
| 6 | **JavaScript** | 0.584 | Incontournable web, enorme ecosysteme |
| 7 | **Kotlin** | 0.579 | Android officiel, moderne, stable |
| 8 | **PowerShell** | 0.565 | Niche DevOps/admin, tres stable |
| 9 | **Go** | 0.545 | Cloud-native dominant, syntaxe simple |
| 10 | **Dart** | 0.533 | Flutter/multi-plateforme, en croissance |
| 11 | **Java** | 0.531 | Massif en entreprise, mais momentum faible |
| 12 | **Lua** | 0.527 | Niche jeux/embarque, stable |
| 13 | **TypeScript** | 0.511 | Superset JS dominant, mais sentiment negatif dans nos donnees |
| 14 | **VBA** | 0.506 | Niche Office/macro, stable par inertie |
| 15 | **Julia** | 0.502 | Calcul scientifique, en croissance |

### 6.3 Bottom 10 — Langages a eviter pour un debutant

| Rang | Langage | Score | Risques |
|---|---|---|---|
| 51 | ActionScript | 0.372 | Flash mort, aucun ecosysteme |
| 52 | COBOL | 0.364 | Legacy mainframe, communaute mourante |
| 53 | Objective-J | 0.357 | Quasi-mort, remplace par frameworks modernes |
| 54 | C/C++ (TIOBE) | 0.349 | Score bas car TIOBE les combine, haute volatilite |
| 55 | Fortran | 0.341 | Niche HPC, aucune croissance |
| 56 | Delphi | 0.320 | Legacy, communaute reduite |
| 57 | VB.NET | 0.312 | Microsoft l'a abandonne, en declin constant |
| 58 | C | 0.312 | Stable en absolu mais volatile, usage en baisse relative |
| 59 | Perl | 0.305 | Remplace par Python depuis 15 ans |
| 60 | PHP | 0.299 | En declin constant, sentiment negatif |

*Note : C et C/C++ sont penalises par leur haute volatilite dans nos donnees. En pratique, C reste indispensable pour le systeme/embarque. Le score reflete la pertinence pour un dev qui choisit un premier langage, pas la valeur absolue du langage.*

### 6.4 Visualisation quadrant

Voir `fig_14_pertinence_quadrant.png` : axe X = usage actuel, axe Y = probabilite de declin, couleur = sentiment communaute, taille = score de pertinence.

---

## 7. Limitations methodologiques

Cette section est **critique** pour l'honnetete scientifique du projet.

1. **Petit nombre de "vrais" declins observes** : Sur 60 langages, seuls ~12 montrent un declin significatif. Le modele apprend surtout a distinguer les langages stables des quelques langages en chute — une tache plus facile qu'elle n'y parait.

2. **Source TIOBE controversee** : L'indice TIOBE mesure la popularite via les requetes de moteurs de recherche, une methodologie critiquee par la communaute. Nos resultats en dependent partiellement (7 134 lignes sur 21 165).

3. **Sentiment Twitter generique** : Le dataset Twitter porte sur des entites generales (Google, FIFA, Amazon), pas sur des discussions de developpeurs. Seuls 13 tweets sur 5 000 echantillonnes ont pu etre attribues a un langage de programmation. Ce signal est anecdotique.

4. **15 citations celebrities = anecdotique** : Le credibility score est illustratif, pas statistique. 15 predictions ne constituent pas un echantillon representatif.

5. **Effet IA potentiellement trop recent** : L'ere LLM date de fin 2022. Avec seulement ~2 ans de recul, les effets structurels sur les langages n'ont peut-etre pas eu le temps de se materialiser dans les metriques de popularite.

6. **Gaps temporels SO** : Pas de Stack Overflow Survey en 2019 ni 2021. Les variations entre 2018→2020 et 2020→2022 couvrent 2 ans chacune, pas 1 an. Gere via `is_interpolated_monthly` mais imparfait.

7. **Modele entraine majoritairement sur donnees pre-LLM** : Le train set (<=2020) ne contient aucune observation de l'ere ChatGPT. Le modele extrapole des patterns pre-IA vers une ere post-IA, ce qui est fondamentalement risque.

8. **Overfitting des modeles non-lineaires** : XGBoost et LightGBM montrent un ecart CV/test de +0.18 a +0.20 en F1, signe que le signal est faible et bruité.

---

## 8. Conclusion

### Ce que les donnees disent vraiment

L'hypothese initiale — "l'IA generative va accelerer le declin des langages facilement generables" — n'est **pas supportee** par nos donnees. Le declin d'un langage est predit par des facteurs structurels anciens (age, type, niveau d'abstraction), pas par son exposition a l'IA.

C'est un resultat scientifiquement interessant *precisement parce qu'il est contre-intuitif*. Si l'IA generative avait un effet massif sur les choix de langages, on l'aurait detecte dans les donnees 2022-2024. Son absence suggere que :

- Les developpeurs ne choisissent pas un langage en fonction de la capacite de l'IA a le generer
- L'ecosysteme (emplois, frameworks, communaute) compte plus que la "generabilite"
- L'IA est un outil transversal qui beneficie a *tous* les langages, pas un facteur de differentiation

### Recommandations pratiques pour un dev en 2026

1. **Python** reste le choix le plus sur : ecosysteme IA/ML, communaute massive, momentum positif.
2. **Rust, Go, TypeScript** : langages en forte croissance, soutenus par les GAFAM.
3. **Eviter de commencer par** : PHP, Perl, VB.NET, Delphi — en declin structurel independamment de l'IA.
4. **L'IA comme outil, pas comme menace** : Apprenez a utiliser Copilot/Claude/ChatGPT *avec* votre langage, pas *a la place* de votre langage.

### Pistes pour aller plus loin

- Integrer les donnees de marche de l'emploi (LinkedIn, Indeed) comme source complementaire
- Analyser les pull requests GitHub par langage pour mesurer la part de code AI-generated
- Attendre 2027-2028 pour avoir un recul suffisant sur l'effet LLM
- Utiliser un dataset Twitter/Reddit specifique aux developpeurs pour le sentiment

---

## Annexes

### A. Features utilisees pour le modeling

| Feature | Description |
|---|---|
| usage_pct | Pourcentage d'utilisation actuel |
| delta_1obs / 3obs / 6obs / 12obs | Variations sur differents horizons |
| ma_6, ma_12 | Moyennes mobiles 6 et 12 mois |
| volatility_12 | Ecart-type glissant 12 mois |
| momentum_6 | Tendance recente (derive) |
| rank | Rang par popularite |
| distance_to_peak | Distance relative au pic historique |
| months_since_peak | Mois ecoules depuis le pic |
| obs_count | Nombre d'observations cumulees |
| ai_susceptibility_score | Score hybride manuel+data (NON predictif) |
| language_age | Age du langage en annees |
| is_static_typed | Typage statique (1) ou dynamique (0) |
| is_compiled | Compile (1) ou interprete (0) |
| level_num | Niveau : low=1, mid=2, high=3 |
| horizon_num | Horizon de prediction (6/12/24 obs) |
| max_alltime | Usage maximal historique |
| n_observations | Nombre total d'observations pour ce langage |

### B. Hyperparametres retenus

- **LogReg L2** (meilleur) : C=1.0, max_iter=1000, class_weight='balanced', solver='lbfgs'
- **XGBoost optimise** : max_depth=5, n_estimators=200, lr=0.05, subsample=0.7, colsample_bytree=0.7 (CV F1=0.74, test F1=0.54 — overfitting)
- **LightGBM optimise** : max_depth=5, n_estimators=200, lr=0.05, subsample=0.85, colsample_bytree=0.85, min_child_samples=50 (CV F1=0.74, test F1=0.57 — overfitting)

### C. Figures

| Figure | Description |
|---|---|
| fig_01 | Trajectoires des 20 langages les plus populaires |
| fig_02 | Comparaison pre/post LLM |
| fig_03 | Correlation SO vs GitHub |
| fig_04 | Top 5 chutes / hausses 2022-2024 |
| fig_05 | Heatmap de volatilite |
| fig_06 | Evolution des parts de marche (stacked area) |
| fig_07 | Calibration du seuil de declin |
| fig_08 | Matrice de correlation des features |
| fig_09 | Matrice de confusion (LogReg L2) |
| fig_10 | Importance par permutation |
| fig_11 | Regression : predit vs reel |
| fig_12 | SHAP summary plot |
| fig_13 | Analyse d'erreur par langage |
| fig_14 | Quadrant de pertinence |
