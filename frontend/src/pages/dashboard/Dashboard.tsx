import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, ListTodo, Scale, Video, ArrowRight, Clock, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const features = [
    {
      name: "Document Analysis",
      description: "AI-powered analysis of legal documents with risk scoring and clause breakdown.",
      icon: FileText,
      path: "/dashboard/agreement/summary",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    },
    {
      name: "Case Summary",
      description: "Search, review, and analyze landmark legal cases with detailed insights.",
      icon: Scale,
      path: "/dashboard/case/case-details",
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20"
    },
    {
      name: "1v1 Video Advisor",
      description: "Connect with legal experts in real-time for personalized guidance and document review.",
      icon: Video,
      path: "/dashboard/video-advisor",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Legal Dashboard</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Access all your legal tools and services in one place
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                <span className="text-primary font-bold">LK</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-800 p-8 shadow-xl mb-12"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-3xl">
            <motion.h2
              className="text-3xl md:text-4xl font-display font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Welcome to LegalKlarity
            </motion.h2>
            <motion.p
              className="text-primary-100 text-lg mb-8 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Simplify your legal journey with AI-powered document analysis and expert guidance. Your personal legal assistant is ready to help.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              onClick={() => navigate("/dashboard/role-selection")}
              className="bg-white text-primary-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-display font-bold text-foreground">
              Legal Tools
            </h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  onClick={() => navigate(feature.path)}
                  className="group cursor-pointer glass-card p-8 rounded-2xl border border-border hover:border-primary/30 relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                    <Icon className="w-24 h-24" />
                  </div>

                  <div className={`w-14 h-14 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 ring-1 ring-inset ${feature.border}`}>
                    <Icon className="h-7 w-7" />
                  </div>

                  <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {feature.name}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">{feature.description}</p>

                  <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Launch Tool <ArrowRight className="ml-1 w-4 h-4" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { label: "Agreements Analyzed", value: "24", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Cases Reviewed", value: "18", icon: Scale, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Processes Completed", value: "32", icon: ListTodo, color: "text-purple-500", bg: "bg-purple-500/10" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border shadow-sm flex items-center"
            >
              <div className={`rounded-lg ${stat.bg} p-3 mr-4`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden"
        >
          <div className="p-6 border-b border-border">
            <h3 className="text-xl font-display font-bold text-foreground">
              Recent Activity
            </h3>
          </div>
          <div className="divide-y divide-border">
            {[
              { title: "Rental Agreement Analysis", time: "2 hours ago", icon: FileText, type: "Analysis" },
              { title: "Case: Smith vs. Corporation Ltd.", time: "Yesterday", icon: Scale, type: "Research" },
              { title: "Consultation with Adv. Sharma", time: "2 days ago", icon: Video, type: "Meeting" }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
                className="p-6 flex items-center hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                    <activity.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.title}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> {activity.time}
                    </span>
                    <span className="mx-2 text-border">•</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {activity.type}
                    </span>
                  </div>
                </div>
                <div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground/50" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
