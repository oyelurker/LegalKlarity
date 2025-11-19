import React, { useState } from "react";
import { Search, Scale, BookOpen, ArrowRight, Loader2, Gavel } from "lucide-react";
import { caseSummaryAsync, searchCaseAsync } from "../../../store/caseSlice";
import { useAppDispatch } from "../../../hooks/redux";
import { toast } from "react-toastify";
import CaseDetail from "./CaseDetail";
import { motion } from "framer-motion";

function Spinner({ loading, detailLoading }: { loading: boolean; detailLoading: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="relative mb-4">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Loader2 className="h-12 w-12 text-primary animate-spin relative z-10" />
            </div>
            <p className="text-muted-foreground font-medium">
                {loading ? "Searching cases..." : detailLoading ? "Loading case summary..." : "Processing..."}
            </p>
        </div>
    );
}

function stripBoldTags(text: string) {
    return text.replace(/<\/?b>/g, "");
}

const CasesList: React.FC = () => {
    const dispatch = useAppDispatch();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCase, setSelectedCase] = useState<any | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const handleSearch = async (searchQuery?: string) => {
        setLoading(true);
        setSelectedCase(null); // Hide detail on new search
        const queryToUse = searchQuery || query;
        if (!queryToUse || queryToUse.trim() === "") {
            setLoading(false);
            toast.error("Please enter a search query.");
            return;
        }
        try {
            const response: any = await dispatch(searchCaseAsync(queryToUse)).unwrap();

            if (response?.statusCode === 200 || response?.success === true) {
                setResults(response.data);
                setLoading(false);
                toast.success(response.message || "Search completed successfully!");
            } else {
                toast.error(response?.message || "Failed to fetch search results");
                setLoading(false);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error("Error fetching search results.");
        }
        setLoading(false);
    };

    const handleCaseSummary = async (tid: string) => {
        setDetailLoading(true);
        try {
            if (!tid) {
                toast.error("Invalid case ID.");
                setDetailLoading(false);
                return;
            }
            const response: any = await dispatch(caseSummaryAsync(tid)).unwrap();
            if (response?.statusCode === 200 || response?.success === true) {
                setSelectedCase(response.data);
                toast.success(response.message || "Case summary fetched successfully!");
                setDetailLoading(false);
            } else {
                toast.error(response?.message || "Failed to fetch case summary");
                setDetailLoading(false);
            }
        } catch (error) {
            toast.error("Error fetching case summary.");
        } finally {
            setDetailLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center mb-6">
                        <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-lg shadow-primary/10">
                            <Scale className="h-8 w-8" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
                        Legal Case <span className="text-gradient">Explorer</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Search and analyze landmark Indian legal cases with AI-powered summaries
                    </p>
                </motion.div>

                {/* Search Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-8 rounded-2xl border border-white/10 mb-12 max-w-4xl mx-auto"
                >
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Search by case title, citation, keywords, or legal topics..."
                            className="block w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all"
                        />
                    </div>

                    <div className="flex justify-center mb-8">
                        <button
                            onClick={() => handleSearch()}
                            disabled={loading}
                            className="btn-primary py-3 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5" />
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <Search className="h-5 w-5" />
                                    Search Cases
                                </>
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-4">Popular Topics:</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {['Constitutional Law', 'Criminal Law', 'Civil Law', 'Corporate Law'].map((topic) => (
                                <button
                                    key={topic}
                                    onClick={() => handleSearch(topic)}
                                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-foreground transition-colors"
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Results or Detail */}
                {loading || detailLoading ? (
                    <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center">
                        <Spinner loading={loading} detailLoading={detailLoading} />
                    </div>
                ) : selectedCase ? (
                    <CaseDetail caseItem={selectedCase} />
                ) : (
                    <div className="space-y-6">
                        {results.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="glass-panel p-8 rounded-2xl border border-white/10"
                            >
                                <div className="flex items-center mb-8">
                                    <BookOpen className="h-6 w-6 text-primary mr-3" />
                                    <h2 className="text-2xl font-display font-bold text-foreground">
                                        Search Results <span className="text-muted-foreground text-lg font-normal ml-2">({results.length} cases found)</span>
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {results.map((caseItem, index) => (
                                        <motion.div
                                            key={caseItem.tid}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="glass-card p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-300 group flex flex-col h-full"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                                                    <Gavel size={18} />
                                                </div>
                                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                                                    {caseItem.publishdate}
                                                </span>
                                            </div>

                                            <h3 className="font-display font-semibold text-foreground text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                                {stripBoldTags(caseItem.title)}
                                            </h3>

                                            <div className="space-y-2 mb-6 flex-grow">
                                                <p className="text-xs text-muted-foreground flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    {caseItem.docsource}
                                                </p>
                                                <p className="text-xs font-medium text-primary/80 bg-primary/5 px-2 py-1 rounded w-fit">
                                                    {caseItem.citation}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleCaseSummary(caseItem.tid)}
                                                disabled={detailLoading}
                                                className="w-full py-2 rounded-lg bg-white/5 hover:bg-primary hover:text-white border border-white/10 hover:border-primary/50 text-sm font-medium transition-all flex items-center justify-center gap-2 group/btn"
                                            >
                                                View Summary
                                                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            !loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="glass-panel p-16 rounded-2xl border border-white/10 text-center max-w-2xl mx-auto"
                                >
                                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 text-primary mb-6">
                                        <Scale className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-2xl font-display font-bold text-foreground mb-3">Start Your Legal Research</h3>
                                    <p className="text-muted-foreground">
                                        Enter a legal topic, case name, or citation above to explore landmark Indian court decisions with AI-powered insights.
                                    </p>
                                </motion.div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CasesList;

