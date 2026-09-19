import { Archive, Brain, ChartBar, Database, FileText, FlaskConical, GitCompare, Lock, ShieldCheck } from "lucide-react"

import {
  AUGMENTATION_ABLATION,
  LABORATORY_MODELS,
  LABORATORY_OVERVIEW,
  LABORATORY_SOURCES,
  LOGISTIC_TUNING,
  SELECTED_MODEL_DETAILS,
} from "@/features/laboratory/laboratory-dev-snapshot"
import { ConfusionMatrix, MetricValue, SectionHeading, TechnicalBadge } from "@/features/laboratory/components/laboratory-primitives"
import { Card, CardContent, CardHeader } from "@/shared/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table"

const percentage = (value: number) => value.toFixed(4)

export function LaboratoryPage() {
  return (
    <main className="space-y-10 lg:space-y-12" aria-labelledby="laboratory-title">
      <section className="relative isolate overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-100 via-violet-50 to-white p-6 shadow-[0_16px_35px_rgba(109,40,147,0.1)] dark:border-violet-400/25 dark:from-violet-950/65 dark:via-slate-900 dark:to-slate-900 sm:p-8 lg:p-10">
        <div aria-hidden="true" className="absolute -right-16 -top-16 size-64 rounded-full bg-violet-400/30 blur-3xl dark:bg-violet-500/25" />
        <div aria-hidden="true" className="absolute right-12 top-1/2 hidden size-32 -translate-y-1/2 rotate-12 rounded-[2rem] border border-violet-300/65 bg-white/25 sm:block dark:border-violet-300/20 dark:bg-violet-400/5" />
        <div aria-hidden="true" className="absolute -bottom-12 right-1/3 size-28 rounded-full border-[10px] border-violet-200/55 dark:border-violet-400/10" />
        <div className="relative max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <TechnicalBadge><FlaskConical className="mr-1 size-3" /> LABORATORY · DEV</TechnicalBadge>
            <TechnicalBadge className="border-slate-200 bg-white/70 text-slate-700 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-200"><Lock className="mr-1 size-3" /> TEST sealed</TechnicalBadge>
          </div>
          <h1 id="laboratory-title" className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Model evidence, made readable.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">A static CIVIKA technical snapshot of the project’s versioned DEV evaluation evidence. It is not a live system view and it contains no TEST results.</p>
        </div>
      </section>

      <section aria-labelledby="technical-overview-title">
        <SectionHeading eyebrow="Technical overview" title="A controlled DEV evaluation" description="The comparison uses grouped validation so comments from the same video do not cross train and validation folds." icon={<FlaskConical className="size-5" />} />
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MetricValue label="Evidence" value="DEV only" detail={`${LABORATORY_OVERVIEW.preparedRows} prepared rows`} icon={<Database className="size-4" />} tone="evidence" />
          <MetricValue label="Protocol" value="3 grouped folds" detail="StratifiedGroupKFold · VideoId" icon={<GitCompare className="size-4" />} />
          <MetricValue label="DEV composition" value={`${LABORATORY_OVERVIEW.developmentRows} comments`} detail={`${LABORATORY_OVERVIEW.videoGroups} video groups`} />
          <MetricValue label="Selected model" value="Logistic Regression" detail="Human decision before TEST" icon={<ShieldCheck className="size-4" />} tone="selected" />
          <MetricValue label="Frozen artifact" value="Available" detail="Logistic Regression · DEV-only" icon={<Archive className="size-4" />} tone="artifact" />
        </dl>
      </section>

      <section aria-labelledby="model-comparison-title">
        <Card className="overflow-hidden border-violet-200 bg-gradient-to-br from-white via-violet-50/45 to-white dark:border-violet-400/20 dark:from-slate-900 dark:via-violet-500/5 dark:to-slate-900">
          <CardHeader><SectionHeading eyebrow="Model comparison" title="Four classical candidates, one DEV protocol" description="Highest observed DEV F1 and selected model are different facts. Selection was a human decision based on the combined evidence available." icon={<GitCompare className="size-5" />} /></CardHeader>
          <CardContent>
            <Table>
              <TableCaption>DEV-only comparison. Values are validation means across three grouped folds unless stated otherwise.</TableCaption>
              <TableHeader><TableRow><TableHead>Model</TableHead><TableHead>F1 toxic</TableHead><TableHead>Std</TableHead><TableHead>Precision</TableHead><TableHead>Recall</TableHead><TableHead>Macro-F1</TableHead><TableHead>Accuracy</TableHead><TableHead>Train–val gap</TableHead></TableRow></TableHeader>
              <TableBody>{LABORATORY_MODELS.map((model) => <TableRow key={model.id} className={model.selected ? "bg-violet-100/55 dark:bg-violet-500/10" : undefined}><TableCell><div className="min-w-44"><p className="font-semibold text-slate-900 dark:text-white">{model.name}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{model.configuration}</p><div className="mt-2 flex flex-wrap gap-1.5">{model.selected && <TechnicalBadge className="bg-violet-600 text-white dark:bg-violet-400 dark:text-violet-950">Selected</TechnicalBadge>}{model.highestDevF1Observed && <TechnicalBadge className="border-violet-300 bg-white/70 dark:bg-slate-800/70">Highest DEV F1 observed</TechnicalBadge>}</div></div></TableCell><TableCell className="min-w-28 font-semibold tabular-nums"><span>{percentage(model.metrics.f1)}</span><div aria-hidden="true" className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-violet-100 dark:bg-violet-500/15"><div className="h-full rounded-full bg-violet-500 dark:bg-violet-300" style={{ width: `${model.metrics.f1 * 100}%` }} /></div></TableCell><TableCell className="tabular-nums">{percentage(model.metrics.std)}</TableCell><TableCell className="tabular-nums">{percentage(model.metrics.precision)}</TableCell><TableCell className="tabular-nums">{percentage(model.metrics.recall)}</TableCell><TableCell className="tabular-nums">{percentage(model.metrics.macroF1)}</TableCell><TableCell className="tabular-nums">{percentage(model.metrics.accuracy)}</TableCell><TableCell className="tabular-nums">{model.metrics.trainValidationGap.toFixed(2)} pp</TableCell></TableRow>)}</TableBody>
            </Table>
            <p className="mt-5 rounded-xl border border-violet-100 bg-violet-50/50 p-4 text-sm leading-6 text-slate-600 dark:border-violet-400/15 dark:bg-violet-500/5 dark:text-slate-300">LinearSVC has the highest observed mean toxic F1 in this DEV comparison. Logistic Regression was selected by the team because its observed fold stability and probability output better matched the preferred product trade-off. Neither statement demonstrates global superiority.</p>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="selected-model-title">
        <Card className="overflow-hidden border-violet-300 bg-gradient-to-br from-violet-100/85 via-violet-50/50 to-white shadow-[0_12px_28px_rgba(109,40,147,0.08)] dark:border-violet-300/25 dark:from-violet-500/18 dark:via-slate-900 dark:to-slate-900">
          <CardHeader><SectionHeading eyebrow="Selected model" title="Logistic Regression" description="Selected by a human decision before TEST, using performance, observed stability across video groups, and the availability of predict_proba." icon={<ShieldCheck className="size-5" />} /></CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
            <div className="space-y-4"><div className="rounded-xl border border-violet-200/80 bg-white/70 p-4 dark:border-violet-400/20 dark:bg-slate-900/45"><p className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">Frozen configuration</p><code className="mt-2 block break-words text-sm leading-6 text-slate-700 dark:text-slate-200">{SELECTED_MODEL_DETAILS.classifier}</code><code className="mt-3 block break-words text-sm leading-6 text-slate-700 dark:text-slate-200">TF-IDF: {SELECTED_MODEL_DETAILS.tfidf}</code><p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Preprocessing: {SELECTED_MODEL_DETAILS.preprocessing}</p></div><div className="grid gap-3 sm:grid-cols-2"><MetricValue label="Fold F1 range" value="0.5446–0.5590" detail="std 0.0059" /><MetricValue label="Artifact partition" value="DEV only" detail="808 rows · 9 VideoId groups" /></div></div>
            <dl className="space-y-3 rounded-xl border border-violet-100 bg-white/60 p-4 text-sm dark:border-violet-400/15 dark:bg-slate-900/35"><div><dt className="font-medium text-slate-900 dark:text-white">Experiment runtime</dt><dd className="mt-1 text-slate-600 dark:text-slate-300">{SELECTED_MODEL_DETAILS.experimentRuntime}</dd></div><div><dt className="font-medium text-slate-900 dark:text-white">Final artifact runtime</dt><dd className="mt-1 text-slate-600 dark:text-slate-300">{SELECTED_MODEL_DETAILS.artifactRuntime}</dd></div><div><dt className="font-medium text-slate-900 dark:text-white">Artifact SHA-256</dt><dd className="mt-1 break-all font-mono text-xs text-slate-600 dark:text-slate-300">{SELECTED_MODEL_DETAILS.artifactSha256}</dd></div><div><dt className="font-medium text-slate-900 dark:text-white">Generated</dt><dd className="mt-1 text-slate-600 dark:text-slate-300">{SELECTED_MODEL_DETAILS.generatedAt}</dd></div></dl>
            <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white/55 p-4 dark:border-slate-700 dark:bg-slate-900/35"><p className="text-sm font-semibold text-slate-900 dark:text-white">Interpretation limits</p><ul className="mt-2 grid gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:grid-cols-2">{SELECTED_MODEL_DETAILS.limitations.map((item) => <li key={item}>• {item}</li>)}</ul></div>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="fold-analysis-title">
        <SectionHeading eyebrow="Fold analysis" title="Variation is part of the evidence" description="Validation metrics and confusion matrices are shown by fold. Matrix rows are actual classes and columns are predicted classes." icon={<ChartBar className="size-5" />} />
        <div className="mt-5 grid gap-5 xl:grid-cols-2">{LABORATORY_MODELS.map((model) => <Card key={model.id} className="border-violet-100 bg-gradient-to-br from-white to-violet-50/35 p-5 dark:border-violet-400/15 dark:from-slate-900 dark:to-violet-500/5"><h3 className="text-base font-semibold text-slate-900 dark:text-white">{model.name}</h3><Table><TableCaption>Validation evidence by grouped fold.</TableCaption><TableHeader><TableRow><TableHead>Fold</TableHead><TableHead>F1 toxic</TableHead><TableHead>Precision</TableHead><TableHead>Recall</TableHead><TableHead>Accuracy</TableHead></TableRow></TableHeader><TableBody>{model.folds.map((fold) => <TableRow key={fold.fold}><TableCell>{fold.fold}</TableCell><TableCell>{percentage(fold.f1)}</TableCell><TableCell>{percentage(fold.precision)}</TableCell><TableCell>{percentage(fold.recall)}</TableCell><TableCell>{percentage(fold.accuracy)}</TableCell></TableRow>)}</TableBody></Table><div className="mt-4 grid gap-3 sm:grid-cols-3">{model.folds.map((fold) => <div key={fold.fold} className="rounded-lg border border-violet-100/80 bg-white/65 p-2 dark:border-violet-400/15 dark:bg-slate-900/40"><p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Fold {fold.fold}</p><ConfusionMatrix matrix={fold.confusionMatrix} model={model.name} fold={fold.fold} /></div>)}</div></Card>)}</div>
      </section>

      <section aria-labelledby="experiments-title" className="grid gap-5 xl:grid-cols-2">
        <Card className="border-violet-200 bg-gradient-to-br from-violet-50/80 to-white p-6 dark:border-violet-400/20 dark:from-violet-500/10 dark:to-slate-900"><SectionHeading eyebrow="Experiments" title="Logistic Regression tuning" description="A bounded DEV-only search. The final C range was intentionally closed at 5.0." icon={<Brain className="size-5" />} /><ol className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">{LOGISTIC_TUNING.rounds.map((round) => <li key={round} className="rounded-lg border border-violet-100 bg-white/65 px-3 py-2 dark:border-violet-400/15 dark:bg-slate-900/35">{round}</li>)}</ol><div className="mt-5 space-y-2" aria-label="Logistic Regression C tuning evolution">{LOGISTIC_TUNING.evolution.map(([c, f1]) => <div key={c} className="grid grid-cols-[3rem_1fr_3.5rem] items-center gap-2 text-xs"><span>C={c}</span><div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-violet-100 dark:bg-violet-500/15"><div className="h-full rounded-full bg-violet-500 dark:bg-violet-300" style={{ width: `${f1 * 100}%` }} /></div><span className="text-right tabular-nums">{f1.toFixed(4)}</span></div>)}</div></Card>
        <Card className="border-violet-200 bg-gradient-to-br from-white to-violet-50/65 p-6 dark:border-violet-400/20 dark:from-slate-900 dark:to-violet-500/10"><SectionHeading eyebrow="Experiments" title="MultinomialNB augmentation" description="A separate train-only ablation, not part of the homogeneous four-model comparison." icon={<FlaskConical className="size-5" />} /><dl className="mt-5 space-y-4 text-sm"><div><dt className="font-semibold text-slate-900 dark:text-white">Model</dt><dd className="mt-1 text-slate-600 dark:text-slate-300">{AUGMENTATION_ABLATION.model}</dd></div><div><dt className="font-semibold text-slate-900 dark:text-white">Method</dt><dd className="mt-1 text-slate-600 dark:text-slate-300">{AUGMENTATION_ABLATION.technique}</dd></div><div><dt className="font-semibold text-slate-900 dark:text-white">Observed result</dt><dd className="mt-1 text-slate-600 dark:text-slate-300">{AUGMENTATION_ABLATION.result}</dd></div><div className="rounded-lg border border-violet-100 bg-violet-50/50 p-3 text-slate-600 dark:border-violet-400/15 dark:bg-violet-500/5 dark:text-slate-300">{AUGMENTATION_ABLATION.conclusion}</div></dl></Card>
      </section>

      <section aria-labelledby="technical-sources-title"><Card className="border-violet-100 bg-gradient-to-br from-white to-violet-50/40 p-6 dark:border-violet-400/15 dark:from-slate-900 dark:to-violet-500/5"><SectionHeading eyebrow="Technical reports" title="Versioned sources behind this snapshot" description="Laboratory summarizes versioned project evidence. It does not load these files at runtime or replace their full reports." icon={<FileText className="size-5" />} /><ul className="mt-5 grid gap-3 lg:grid-cols-2">{LABORATORY_SOURCES.map((source) => <li key={source.path} className="rounded-xl border border-violet-100 bg-white/70 p-4 dark:border-violet-400/15 dark:bg-slate-900/35"><p className="font-semibold text-slate-900 dark:text-white">{source.label}</p><code className="mt-1 block break-all text-xs text-violet-700 dark:text-violet-300">{source.path}</code><p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">{source.description}</p></li>)}</ul></Card></section>
    </main>
  )
}
