import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import SectionHeading from "@/components/SectionHeading";
import Stat from "@/components/Stat";
import Quote from "@/components/Quote";
import SourcesTable from "@/components/SourcesTable";
import Figure from "@/components/Figure";
import TrendBars from "@/components/TrendBars";
import ModelTable from "@/components/ModelTable";
import FeatureImportance from "@/components/FeatureImportance";
import PerLanguagePerf from "@/components/PerLanguagePerf";
import ScoreFormula from "@/components/ScoreFormula";
import RankingTable from "@/components/RankingTable";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <Nav />
      <Hero />
      <Ticker />

      {/* ---------------- 02 CONTEXTE ---------------- */}
      <section className="mx-auto max-w-[1400px] px-6">
        <SectionHeading
          id="contexte"
          index="02"
          kicker="L'hypothèse de départ"
          title={
            <>
              Si l'IA <em className="italic">génère</em> du code,
              <br /> certains langages devraient en mourir.
            </>
          }
        />

        <div className="grid md:grid-cols-12 gap-6 mt-6">
          <div className="md:col-span-7 space-y-4 text-ink/90 leading-relaxed text-lg">
            <p>
              Depuis ChatGPT (nov. 2022) et Copilot, l'industrie répète que le
              <em className="italic"> code manuel est mort</em>. Si c'est vrai, alors les
              langages dont le code est le plus facilement générable par LLM
              (JavaScript, PHP, Ruby, code web répétitif) devraient décliner plus vite
              que ceux qui résistent à la génération (Rust, C, Haskell).
            </p>
            <p className="text-muted">
              C'est l'hypothèse qu'on a testée empiriquement, sur un panel mensuel
              de 21 165 observations couvrant 60 langages et 20 ans de données.
            </p>
          </div>
          <div className="md:col-span-5 space-y-3">
            <Stat
              value="21 165"
              label="Observations"
              hint="Panel mensuel · 60 langages · 2004 à 2024"
              tone="accent"
            />
            <div className="grid grid-cols-2 gap-3">
              <Stat value="10" label="Sources" />
              <Stat value="38" label="Colonnes / features" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          <Quote
            text="It is our job to create computing technology such that nobody has to program."
            author="Jensen Huang"
            org="NVIDIA · Fév. 2024"
            status="non réalisée"
          />
          <Quote
            text="AI could write 90 % of code in 3 to 6 months."
            author="Dario Amodei"
            org="Anthropic · Mars 2025"
            status="non réalisée"
          />
          <Quote
            text="The hottest new programming language is English."
            author="Andrej Karpathy"
            org="Janv. 2023"
            status="en cours"
          />
          <Quote
            text="Let's wait 10 years."
            author="Linus Torvalds"
            org="C dans le kernel · Toujours dominant"
            status="réalisée"
          />
        </div>
      </section>

      {/* ---------------- 03 DONNÉES ---------------- */}
      <section className="mx-auto max-w-[1400px] px-6">
        <SectionHeading
          id="donnees"
          index="03"
          kicker="Pipeline de données"
          title={<>Dix sources, un panel mensuel cohérent.</>}
        />
        <div className="grid md:grid-cols-12 gap-6 mt-6">
          <div className="md:col-span-7">
            <SourcesTable />
          </div>
          <div className="md:col-span-5 space-y-3">
            <Stat
              value="0.861"
              label="Corrélation SO ↔ GitHub"
              hint="Les deux sources racontent la même histoire."
              tone="accent"
            />
            <Stat
              value="20+"
              label="Variantes normalisées"
              hint='Ex. "Visual Basic (.Net)" → VB.NET. HTML/CSS exclus (markup vs prog.)'
            />
            <Stat
              value="Strict"
              label="Split temporel"
              hint="Train ≤ Déc 2020 · Val 2021 à Juin 2022 · Test ≥ Juil 2022"
            />
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <Figure
            src="/figures/fig_03_so_vs_github_correlation.png"
            alt="Corrélation Stack Overflow vs GitHub"
            caption="Fig. 03 · Corrélation Stack Overflow vs GitHub par langage (r = 0.861)."
          />
          <Figure
            src="/figures/fig_08_correlation_matrix.png"
            alt="Matrice de corrélation des features"
            caption="Fig. 08 · Matrice de corrélation des features (38 colonnes du panel final)."
          />
        </div>
      </section>

      {/* ---------------- 04 EDA ---------------- */}
      <section className="mx-auto max-w-[1400px] px-6">
        <SectionHeading
          id="eda"
          index="04"
          kicker="Exploratoire"
          title={<>L'effet ChatGPT, vraiment ?</>}
        />
        <p className="text-lg text-ink/90 leading-relaxed max-w-3xl mt-4">
          Le "point de rupture" 2022 est visible dans les données. Mais à y regarder
          de plus près, l'accélération suit des tendances structurelles préexistantes.
        </p>

        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <Figure
            src="/figures/fig_01_trajectories_top20.png"
            alt="Trajectoires des 20 langages les plus populaires"
            caption="Fig. 01 · Trajectoires des 20 langages les plus populaires (2004 à 2024)."
          />
          <Figure
            src="/figures/fig_02_pre_vs_post_llm.png"
            alt="Comparaison pré/post LLM"
            caption="Fig. 02 · Comparaison des trajectoires pré ChatGPT vs post ChatGPT."
          />
        </div>

        <div className="mt-8">
          <TrendBars />
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <Figure
            src="/figures/fig_04_top5_decline_top5_growth.png"
            alt="Top 5 chutes et hausses 2022-2024"
            caption="Fig. 04 · Top 5 chutes et top 5 hausses sur la période post LLM."
          />
          <Figure
            src="/figures/fig_06_share_evolution_stacked.png"
            alt="Évolution des parts de marché"
            caption="Fig. 06 · Évolution stacked des parts de marché des principaux langages."
          />
        </div>

        <div className="mt-8">
          <Figure
            src="/figures/fig_05_volatility_heatmap.png"
            alt="Heatmap de volatilité"
            caption="Fig. 05 · Heatmap de volatilité 12 mois par langage et par année."
            ratio={21 / 9}
          />
        </div>
      </section>

      {/* ---------------- 05 MODELING ---------------- */}
      <section className="mx-auto max-w-[1400px] px-6">
        <SectionHeading
          id="modeling"
          index="05"
          kicker="Prédire le déclin"
          title={
            <>
              Cinq classifieurs, un gagnant
              <br />
              <span className="italic text-muted">contre-intuitif.</span>
            </>
          }
        />

        <div className="grid md:grid-cols-12 gap-6 mt-6">
          <div className="md:col-span-7">
            <ModelTable />
          </div>
          <div className="md:col-span-5 space-y-3">
            <Stat
              value="0.628"
              label="F1 macro · LogReg L2"
              hint="ROC-AUC 0.781 · PR-AUC 0.434 · CI95% [0.523, 0.714]"
              tone="accent"
            />
            <Stat
              value="+0.17"
              label="vs baselines"
              hint="Naïve majorité (0.459) · Métier momentum+delta (0.451)"
              tone="accent"
            />
            <Stat
              value="+0.20"
              label="Overfit XGBoost"
              hint="CV F1 = 0.74 vs test F1 = 0.54 · signal faible et bruité"
              tone="warn"
            />
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <Figure
            src="/figures/fig_09_confusion_matrix.png"
            alt="Matrice de confusion"
            caption="Fig. 09 · Matrice de confusion du LogReg L2 sur le test set."
          />
          <Figure
            src="/figures/fig_07_threshold_calibration.png"
            alt="Calibration du seuil"
            caption="Fig. 07 · Calibration du seuil de décision (décline / stable)."
          />
        </div>

        <div className="mt-8">
          <PerLanguagePerf />
        </div>
      </section>

      {/* ---------------- 06 LE TWIST ---------------- */}
      <section className="mx-auto max-w-[1400px] px-6">
        <SectionHeading
          id="twist"
          index="06"
          kicker="Le résultat le plus important"
          title={
            <>
              <em className="italic">ai_susceptibility</em> arrive au rang
              <span className="text-warn"> 17/21</span>.
            </>
          }
        />

        <p className="text-lg text-ink/90 leading-relaxed max-w-3xl mt-4">
          Notre score combinant facilité de génération LLM et taux d'adoption IA par
          langage n'est <em className="italic">pas prédictif</em> du déclin. Les vrais
          drivers sont structurels : âge, niveau d'abstraction, statut compilé.
        </p>

        <div className="mt-8 grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <FeatureImportance />
          </div>
          <div className="lg:col-span-5 space-y-3">
            <Stat
              value="#1"
              label="Top feature"
              hint="language_age · les vieux langages déclinent plus."
              tone="accent"
            />
            <Stat
              value="#3"
              label="is_compiled"
              hint="Compilé = moins de déclin. Inertie de l'écosystème."
              tone="accent"
            />
            <Stat
              value="#17"
              label="ai_susceptibility"
              hint="Notre hypothèse de départ. Pas prédictive."
              tone="warn"
            />
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <Figure
            src="/figures/fig_12_shap_summary.png"
            alt="SHAP summary plot"
            caption="Fig. 12 · SHAP summary plot : direction et magnitude de chaque feature."
          />
          <Figure
            src="/figures/fig_10_permutation_importance.png"
            alt="Importance par permutation"
            caption="Fig. 10 · Importance par permutation, méthode alternative au SHAP."
          />
        </div>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              t: "Effet de Jevons",
              d: "L'IA aide à écrire du JS, mais ne réduit pas la demande de JS. Elle l'augmente, comme la machine à vapeur a augmenté la consommation de charbon.",
            },
            {
              t: "Inertie",
              d: "COBOL est prédit mort depuis 1990. Les millions de lignes en prod rendent la migration plus coûteuse que le maintien.",
            },
            {
              t: "Proxy popularité",
              d: 'On a supposé "générable = vulnérable". Mais les plus générables (Python, JS) sont aussi les mieux documentés et les plus demandés.',
            },
            {
              t: "Fenêtre courte",
              d: "L'ère LLM date de fin 2022. Avec 2 ans de recul, les effets structurels n'ont peut-être pas eu le temps de s'incarner dans la popularité.",
            },
          ].map((x) => (
            <div key={x.t} className="shadow-card rounded-md p-5 bg-bg">
              <div className="text-[11px] uppercase tracking-[0.18em] text-accent mb-3">
                {x.t}
              </div>
              <p className="text-sm text-ink/85 leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <Figure
            src="/figures/fig_11_predicted_vs_actual.png"
            alt="Prédit vs réel"
            caption="Fig. 11 · Régression : variation prédite vs réelle sur le test set."
          />
          <Figure
            src="/figures/fig_13_error_analysis.png"
            alt="Analyse d'erreur"
            caption="Fig. 13 · Analyse d'erreur par langage : où le modèle se trompe."
          />
        </div>
      </section>

      {/* ---------------- 07 RANKING ---------------- */}
      <section className="mx-auto max-w-[1400px] px-6">
        <SectionHeading
          id="ranking"
          index="07"
          kicker="Le score final"
          title={
            <>
              60 langages, rangés
              <br />
              <span className="italic text-muted">par pertinence en 2026.</span>
            </>
          }
        />

        <div className="grid lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-7">
            <ScoreFormula />
          </div>
          <div className="lg:col-span-5">
            <Figure
              src="/figures/fig_14_pertinence_quadrant.png"
              alt="Quadrant de pertinence"
              caption="Fig. 14 · X = usage actuel, Y = P(décline), taille = score. Le quadrant en bas à droite est le sweet spot : usage élevé et faible probabilité de déclin."
              ratio={4 / 3}
            />
          </div>
        </div>

        <div className="mt-10">
          <RankingTable />
        </div>

        <p className="text-xs text-muted mt-4 max-w-3xl leading-relaxed">
          <span className="text-ink">Comment lire ce ranking :</span> ce classement
          mesure la pertinence pour un développeur qui choisit un langage à apprendre
          en 2026, pas la valeur intrinsèque. C reste incontournable en système /
          kernel, PHP propulse encore ~75 % du web, Fortran est solide en HPC. Le
          score pénalise la volatilité et le déclin <em className="italic">relatif</em>,
          ce qui défavorise les langages matures à usage stable mais non croissant.
        </p>
      </section>

      {/* ---------------- 08 SENTIMENT ---------------- */}
      <section className="mx-auto max-w-[1400px] px-6">
        <SectionHeading
          id="sentiment"
          index="08"
          kicker="NLP & track record"
          title={<>Le sentiment Twitter ne dit rien. Les CEOs disent souvent faux.</>}
        />

        <div className="grid md:grid-cols-12 gap-6 mt-6">
          <div className="md:col-span-7 space-y-4 text-ink/90 leading-relaxed">
            <p>
              Sur 5 000 tweets analysés via{" "}
              <span className="font-mono text-accent">cardiffnlp/twitter-roberta-base-sentiment-latest</span>,
              seuls <span className="num text-warn">13 tweets</span> ont pu être
              attribués à un langage (6 langages détectés). Le dataset Twitter est
              générique (entités Google, FIFA, Amazon) et non spécifique aux
              développeurs.
            </p>
            <p className="text-muted">
              Conséquence honnête : le sentiment est <em className="italic">exclu</em>{" "}
              du score final (poids = 0).
            </p>
          </div>
          <div className="md:col-span-5 space-y-3">
            <Stat
              value="13 / 5000"
              label="Tweets exploitables"
              hint="Signal trop faible pour être statistiquement valable."
              tone="warn"
            />
            <Stat
              value="0.72"
              label="Crédibilité CEOs"
              hint="9/15 prédictions réalisées · 3 en cours · 3 fausses"
            />
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Quote
            text="Anyone who's used Copilot daily will tell you it's writing 25 % of new code at Google."
            author="Sundar Pichai"
            org="Google · Oct. 2024"
            status="réalisée"
          />
          <Quote
            text="TypeScript va dominer le développement JS."
            author="Anders Hejlsberg"
            org="TS · +66 % contributeurs en 2024"
            status="réalisée"
          />
          <Quote
            text="Rust va remplacer C/C++ dans les systèmes critiques."
            author="Mark Russinovich"
            org="Microsoft Azure · Adoption Linux kernel"
            status="réalisée"
          />
          <Quote
            text="AI coders will surpass humans by end of 2025."
            author="Sam Altman"
            org="OpenAI · Janv. 2024"
            status="en cours"
          />
          <Quote
            text="Software is eating the world (and AI is eating software)."
            author="Marc Andreessen"
            org="a16z"
            status="en cours"
          />
          <Quote
            text="Don't bother learning to code."
            author="Jensen Huang"
            org="NVIDIA · Fév. 2024"
            status="non réalisée"
          />
        </div>

        <p className="text-xs text-muted mt-6 max-w-3xl">
          Disclaimer : 15 citations constituent un échantillon anecdotique, pas une
          analyse statistique. Cette partie est illustrative.
        </p>
      </section>

      {/* ---------------- 09 LIMITES ---------------- */}
      <section className="mx-auto max-w-[1400px] px-6">
        <SectionHeading
          id="limites"
          index="09"
          kicker="Honnêteté scientifique"
          title={<>Ce que cette étude ne prouve pas.</>}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[
            {
              n: "01",
              t: "Peu de vrais déclins",
              d: "Sur 60 langages, seuls ~12 montrent un déclin significatif. Le modèle apprend surtout à distinguer stables de quelques chutes.",
            },
            {
              n: "02",
              t: "TIOBE controversé",
              d: "L'indice TIOBE mesure la popularité via les requêtes moteurs, une méthodologie critiquée. 7134/21165 lignes en dépendent.",
            },
            {
              n: "03",
              t: "Sentiment trop faible",
              d: "Dataset Twitter générique. Seuls 13 tweets sur 5000 attribuables à un langage, donc exclus du score.",
            },
            {
              n: "04",
              t: "Train pré-LLM",
              d: "Train ≤ 2020 ne contient aucune obs de l'ère ChatGPT. Le modèle extrapole des patterns pré-IA vers post-IA.",
            },
            {
              n: "05",
              t: "Fenêtre courte",
              d: "L'ère LLM = fin 2022. Avec 2 ans de recul, les effets structurels n'ont peut-être pas eu le temps d'apparaître.",
            },
            {
              n: "06",
              t: "Gaps SO",
              d: "Pas de Stack Overflow Survey en 2019 ni 2021. Géré via is_interpolated_monthly, imparfait.",
            },
            {
              n: "07",
              t: "Overfit non-linéaire",
              d: "XGB et LGBM : écart CV/test de +0.18 à +0.20. Le signal est faible et bruité.",
            },
            {
              n: "08",
              t: "15 ≠ échantillon",
              d: "Le track record des CEOs est illustratif, pas statistique. 15 prédictions ne représentent personne.",
            },
          ].map((l) => (
            <div key={l.n} className="shadow-card rounded-md p-5 bg-bg">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-warn text-[11px] uppercase tracking-[0.18em] num">{l.n}</span>
              </div>
              <div className="font-medium mb-2">{l.t}</div>
              <p className="text-sm text-muted leading-relaxed">{l.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- 10 CONCLUSION ---------------- */}
      <section className="mx-auto max-w-[1400px] px-6 pb-24">
        <SectionHeading
          id="conclusion"
          index="10"
          kicker="Ce que les données disent vraiment"
          title={
            <>
              L'IA est un outil <em className="italic">transversal</em>,<br />
              pas un facteur de différenciation.
            </>
          }
        />

        <div className="grid md:grid-cols-12 gap-6 mt-6">
          <div className="md:col-span-7 space-y-4 text-lg text-ink/90 leading-relaxed">
            <p>
              L'hypothèse initiale, "l'IA générative va accélérer le déclin des
              langages facilement générables", <em className="italic">n'est pas supportée</em>{" "}
              par nos données. Si l'IA générative avait un effet massif sur le choix
              des langages, on l'aurait détecté dans les métriques 2022-2024. Son
              absence suggère que les développeurs ne choisissent pas un langage en
              fonction de la capacité de l'IA à le générer.
            </p>
            <p className="text-muted">
              L'écosystème (emplois, frameworks, communauté) compte plus que la
              "générabilité". L'IA bénéficie à <em className="italic">tous</em> les
              langages, pas à certains au détriment des autres.
            </p>
          </div>
          <div className="md:col-span-5 space-y-3">
            <Stat
              value="Python"
              label="Choix le plus sûr · 2026"
              hint="Écosystème IA/ML, communauté massive, momentum positif."
              tone="accent"
            />
            <Stat
              value="Rust · Go · TS"
              label="En forte croissance"
              hint="Soutenus par GAFAM, écosystèmes modernes."
            />
            <Stat
              value="PHP · Perl · VB"
              label="À éviter pour débuter"
              hint="En déclin structurel, indépendant de l'IA."
              tone="warn"
            />
          </div>
        </div>

        <div className="mt-16 shadow-card rounded-md bg-bg p-8 md:p-12">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted mb-4">
            La phrase à retenir
          </div>
          <p className="font-display text-3xl md:text-5xl leading-tight">
            L'IA ne décide pas quels langages déclinent.
            <br />
            <span className="text-accent">L'histoire, le marché et la structure le font.</span>
          </p>
        </div>
      </section>

      <footer className="border-t hairline mx-auto max-w-[1400px] px-6 py-10 flex flex-wrap items-baseline justify-between gap-4 text-xs text-muted">
        <div>
          <span className="text-accent">●</span> Partiels ML · Pertinence des langages
          de programmation à l'ère de l'IA générative
        </div>
        <div className="flex gap-6">
          <a
            href="https://github.com/nathan-serfaty/Partiel_ML"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent"
          >
            Code & data ↗
          </a>
          <a href="#intro" className="hover:text-accent">
            Retour haut ↑
          </a>
        </div>
      </footer>
    </main>
  );
}
