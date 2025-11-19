import { motion } from "framer-motion";
import { Building, User, Building2, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const exampleAgreements: Record<string, string[]> = {
  enterprise: [
    "MoA / LLP Agreement",
    "Vendor / Client Contract",
    "Employment Agreement",
    "Service Agreement",
    "IP Assignment Agreement"
  ],
  individual: [
    "Rental / Lease Agreement",
    "Loan Agreement",
    "Sale Agreement (Property/Vehicle)",
    "Will / Inheritance Agreement",
    "Power of Attorney"
  ],
  institutional: [
    "Internship Agreement",
    "Offer Letter / Employment Contract",
    "Freelance Project Contract",
    "NDA (Non-Disclosure Agreement)"
  ],
};

const roles = [
  {
    id: "enterprise",
    title: "Enterprise",
    description: "For businesses, corporations, and commercial entities seeking legal solutions.",
    icon: <Building className="w-8 h-8" />,
    color: "from-blue-500/20 to-indigo-500/20 text-blue-400",
    borderColor: "group-hover:border-blue-500/50",
    glow: "group-hover:shadow-blue-500/20"
  },
  {
    id: "individual",
    title: "Individual",
    description: "For individuals managing personal legal documents and agreements.",
    icon: <User className="w-8 h-8" />,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400",
    borderColor: "group-hover:border-emerald-500/50",
    glow: "group-hover:shadow-emerald-500/20"
  },
  {
    id: "institutional",
    title: "Institutional",
    description: "For educational institutions, NGOs, and organizations managing multiple agreements.",
    icon: <Building2 className="w-8 h-8" />,
    color: "from-purple-500/20 to-pink-500/20 text-purple-400",
    borderColor: "group-hover:border-purple-500/50",
    glow: "group-hover:shadow-purple-500/20"
  }
];

const RoleSelection = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const handleSelect = (roleId: string) => {
    navigate(`/dashboard/agreement/summary`);
  };

  const handleFlip = (roleId: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [roleId]: !prev[roleId]
    }));
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Select Your <span className="text-gradient">User Type</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the category that best represents you to access personalized legal tools and agreement templates.
            </p>
          </motion.div>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="h-full perspective-1000"
            >
              <div className={`relative h-full group rounded-2xl transition-all duration-500 ${role.glow} hover:shadow-2xl`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />

                <div className={`glass-card h-full p-8 rounded-2xl border border-white/10 ${role.borderColor} transition-colors duration-300 relative z-10 flex flex-col`}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <div className="text-white">
                      {role.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl font-display font-bold text-foreground text-center mb-4">
                    {role.title}
                  </h3>

                  <p className="text-muted-foreground text-center mb-8 flex-grow">
                    {role.description}
                  </p>

                  {/* Flip Card Container */}
                  <div className="relative h-48 mb-8 perspective-1000 group-hover:scale-105 transition-transform duration-300">
                    <motion.div
                      className="w-full h-full relative preserve-3d transition-transform duration-700"
                      animate={{ rotateY: flippedCards[role.id] ? 180 : 0 }}
                    >
                      {/* Front */}
                      <div className="absolute inset-0 backface-hidden">
                        <div className="w-full h-full rounded-xl bg-white/5 dark:bg-white/5 border border-white/10 flex flex-col items-center justify-center p-6 backdrop-blur-sm">
                          <p className="text-sm text-muted-foreground mb-4 text-center">View available agreements for {role.title}</p>
                          <button
                            onClick={() => handleFlip(role.id)}
                            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors"
                          >
                            Show Examples
                          </button>
                        </div>
                      </div>

                      {/* Back */}
                      <div className="absolute inset-0 backface-hidden rotate-y-180">
                        <div className="w-full h-full rounded-xl bg-white/10 dark:bg-slate-800/50 border border-white/10 p-4 backdrop-blur-md overflow-y-auto custom-scrollbar">
                          <ul className="space-y-2">
                            {exampleAgreements[role.id].map((doc, i) => (
                              <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                                <Check size={12} className="mt-1 text-primary shrink-0" />
                                <span>{doc}</span>
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={() => handleFlip(role.id)}
                            className="mt-4 w-full text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <button
                    className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 group/btn"
                    onClick={() => handleSelect(role.id)}
                  >
                    Select {role.title}
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="glass-panel p-8 rounded-2xl border border-white/10 text-center max-w-3xl mx-auto"
        >
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Not Sure Which Category Fits You?
          </h3>
          <p className="text-muted-foreground mb-6">
            Each category provides tailored legal tools and agreement templates. You can always change your selection later in your account settings.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 text-sm font-medium">
            <button className="text-primary hover:text-primary-400 transition-colors">
              Learn more about user categories
            </button>
            <span className="hidden sm:block text-border">|</span>
            <button className="text-primary hover:text-primary-400 transition-colors">
              Contact support for help
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelection;

