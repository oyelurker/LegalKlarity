import { useState } from "react";
import { Search, FileText, AlertCircle, Loader2, Printer, Share2, CheckCircle2, ExternalLink, DollarSign } from "lucide-react";
import { agreementProcessAsync } from "../../../store/agreementSlice";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { motion, AnimatePresence } from "framer-motion";

// Predefined common agreement types
const COMMON_AGREEMENTS = [
    "Rental Agreement",
    "Employment Contract",
    "Loan Agreement",
    "Marriage Contract",
    "Service Agreement",
    "Non-Disclosure Agreement",
    "Partnership Agreement",
    "Sales Agreement"
];

export default function AgreementProcess() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [showDetails, setShowDetails] = useState<any>(false);
    const [query, setQuery] = useState("");

    const handleView = async (agreementType?: string) => {
        const typeToUse = agreementType || query;

        // Validate that the agreement type is in our predefined list
        if (!COMMON_AGREEMENTS.includes(typeToUse)) {
            toast.error("Please select a valid agreement type from the options provided.");
            return;
        }

        setLoading(true);
        setQuery(typeToUse);

        try {
            if (!user || !user.uid) {
                toast.error("You must be logged in to view agreement processes.");
                return;
            }

            const response: any = await dispatch(agreementProcessAsync({ uid: user.uid, processType: typeToUse })).unwrap();

            if (response?.statusCode === 200 || response?.success === true) {
                setShowDetails(response.data);
                toast.success("Process information loaded successfully!");
                setLoading(false);
            } else {
                toast.error(response?.message || "Failed to fetch process details");
                setLoading(false);
            }
        } catch (error) {
            toast.error("Error fetching process details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleView();
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[100px]" />
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
                            <FileText className="h-8 w-8" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
                        Document Process <span className="text-gradient">Guide</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Get step-by-step guidance for drafting, reviewing, and executing legal documents
                    </p>
                </motion.div>

                {/* Search & Selection Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-8 rounded-2xl border border-white/10 mb-12"
                >
                    <div className="max-w-3xl mx-auto mb-8">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Or enter an agreement type (must be from the list below)"
                                className="block w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all"
                            />
                        </div>
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={() => handleView()}
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
                                        Find Process
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8">
                        <h2 className="text-lg font-semibold text-foreground mb-6 text-center">Common Agreement Types</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {COMMON_AGREEMENTS.map((agreement) => (
                                <button
                                    key={agreement}
                                    onClick={() => handleView(agreement)}
                                    disabled={loading}
                                    className={`p-4 text-center rounded-xl border transition-all duration-300 ${query === agreement
                                            ? "border-primary/50 bg-primary/10 text-primary shadow-lg shadow-primary/5"
                                            : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:border-white/20 hover:text-foreground"
                                        }`}
                                >
                                    <FileText className={`h-6 w-6 mx-auto mb-3 ${query === agreement ? "text-primary" : "text-muted-foreground"}`} />
                                    <span className="text-sm font-medium block">
                                        {agreement}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Results */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="glass-panel p-12 rounded-2xl border border-white/10 flex flex-col items-center justify-center"
                        >
                            <div className="relative mb-4">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                                <Loader2 className="h-12 w-12 text-primary animate-spin relative z-10" />
                            </div>
                            <p className="text-muted-foreground font-medium">Analyzing agreement process details...</p>
                        </motion.div>
                    ) : showDetails ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            {/* Process Overview Card */}
                            <div className="glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                                <div className="flex items-start relative z-10">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary shadow-inner shadow-primary/5">
                                            <FileText className="h-8 w-8" />
                                        </div>
                                    </div>
                                    <div className="ml-6">
                                        <h2 className="text-3xl font-display font-bold text-foreground mb-2">
                                            {query ? `${query} Process` : 'Document Process'}
                                        </h2>
                                        <p className="text-lg text-muted-foreground">
                                            Complete guide with steps, requirements, and resources
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Process Steps */}
                                {showDetails.processSteps && Array.isArray(showDetails.processSteps) && (
                                    <div className="glass-card p-8 rounded-2xl border border-white/10 h-full">
                                        <h3 className="text-xl font-display font-bold text-foreground mb-6 flex items-center">
                                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/10 text-blue-500 mr-3 border border-blue-500/20">
                                                1
                                            </span>
                                            Process Steps
                                        </h3>
                                        <div className="space-y-6">
                                            {showDetails.processSteps.map((step: string, index: number) => (
                                                <div key={index} className="flex group">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-white/10 text-muted-foreground text-xs group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                                            {index + 1}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-muted-foreground group-hover:text-foreground transition-colors">{step}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Required Documents */}
                                {showDetails.requiredDocuments && Array.isArray(showDetails.requiredDocuments) && (
                                    <div className="glass-card p-8 rounded-2xl border border-white/10 h-full">
                                        <h3 className="text-xl font-display font-bold text-foreground mb-6 flex items-center">
                                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-500 mr-3 border border-emerald-500/20">
                                                2
                                            </span>
                                            Required Documents
                                        </h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            {showDetails.requiredDocuments.map((doc: string, index: number) => (
                                                <div key={index} className="flex items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                                    <div className="flex-shrink-0 mr-3">
                                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                                    </div>
                                                    <p className="text-foreground font-medium">{doc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Online Creation Resources */}
                                {showDetails.creationLinks && Array.isArray(showDetails.creationLinks) && (
                                    <div className="glass-card p-8 rounded-2xl border border-white/10 h-full">
                                        <h3 className="text-xl font-display font-bold text-foreground mb-6 flex items-center">
                                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-purple-500/10 text-purple-500 mr-3 border border-purple-500/20">
                                                3
                                            </span>
                                            Create Agreement Online
                                        </h3>
                                        <div className="space-y-4">
                                            {showDetails.creationLinks.map((link: any, index: number) => (
                                                <div key={index} className="border border-white/10 rounded-xl p-4 bg-white/5 hover:bg-white/10 transition-all group">
                                                    {link.url && link.url !== 'N/A' ? (
                                                        <a
                                                            href={link.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-between"
                                                        >
                                                            <div>
                                                                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">{link.name || link.document}</h4>
                                                                {link.disclaimer && (
                                                                    <p className="mt-1 text-sm text-muted-foreground">{link.disclaimer}</p>
                                                                )}
                                                            </div>
                                                            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                        </a>
                                                    ) : (
                                                        <div>
                                                            <h4 className="font-medium text-foreground">{link.name || link.document}</h4>
                                                            {link.disclaimer && (
                                                                <p className="mt-1 text-sm text-muted-foreground italic">{link.disclaimer}</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Pricing Information */}
                                {showDetails.priceInfo && Array.isArray(showDetails.priceInfo) && (
                                    <div className="glass-card p-8 rounded-2xl border border-white/10 h-full">
                                        <h3 className="text-xl font-display font-bold text-foreground mb-6 flex items-center">
                                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-amber-500/10 text-amber-500 mr-3 border border-amber-500/20">
                                                4
                                            </span>
                                            Pricing Information
                                        </h3>
                                        <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-6">
                                            <ul className="space-y-4">
                                                {showDetails.priceInfo.map((priceItem: any, index: number) => (
                                                    <li key={index} className="flex items-start">
                                                        <DollarSign className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                                                        <span className="text-foreground/90">
                                                            {typeof priceItem === 'string' ? priceItem : `${priceItem.document}: ${priceItem.price}`}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Expert Help */}
                            {showDetails.needExpert && (
                                <div className="glass-card p-8 rounded-2xl border border-white/10 border-l-4 border-l-red-500/50">
                                    <h3 className="text-xl font-display font-bold text-foreground mb-6 flex items-center">
                                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-500/10 text-red-500 mr-3 border border-red-500/20">
                                            <AlertCircle className="h-4 w-4" />
                                        </span>
                                        When to Seek Legal Expertise
                                    </h3>
                                    <div className="bg-red-500/5 rounded-xl p-6">
                                        {Array.isArray(showDetails.needExpert) ? (
                                            <ul className="space-y-3">
                                                {showDetails.needExpert.map((item: string, index: number) => (
                                                    <li key={index} className="flex items-start">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 mr-3" />
                                                        <span className="text-foreground/90">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-foreground/90 whitespace-pre-line">{showDetails.needExpert}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-center gap-4 py-6">
                                <button
                                    onClick={() => window.print()}
                                    className="px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-foreground font-medium transition-all flex items-center justify-center gap-2"
                                >
                                    <Printer className="h-5 w-5" />
                                    Print Guide
                                </button>
                                <button
                                    onClick={() => {
                                        navigator.share ?
                                            navigator.share({
                                                title: "LegalKlarity - Agreement Process",
                                                text: `Process guide for ${query}`,
                                                url: window.location.href,
                                            }) :
                                            alert("Sharing not supported on this browser.");
                                    }}
                                    className="btn-primary px-8 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                >
                                    <Share2 className="h-5 w-5" />
                                    Share Guide
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        // Empty state
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="glass-panel p-16 rounded-2xl border border-white/10 text-center max-w-2xl mx-auto"
                        >
                            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 text-primary mb-6">
                                <FileText className="h-10 w-10" />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-foreground mb-3">Find Agreement Processes</h3>
                            <p className="text-muted-foreground">
                                Select an agreement type from the options above to get step-by-step guidance on how to create, review, and execute legal documents.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

