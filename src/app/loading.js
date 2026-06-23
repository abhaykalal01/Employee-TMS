export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6 py-20">
            <div className="w-full max-w-3xl space-y-6">
                <div className="h-12 w-full rounded-full bg-slate-800 skeleton" />
                <div className="h-72 rounded-3xl bg-slate-900/80 skeleton" />
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="h-28 rounded-3xl bg-slate-900/80 skeleton" />
                    <div className="h-28 rounded-3xl bg-slate-900/80 skeleton" />
                    <div className="h-28 rounded-3xl bg-slate-900/80 skeleton" />
                </div>
            </div>
        </div>
    );
}
