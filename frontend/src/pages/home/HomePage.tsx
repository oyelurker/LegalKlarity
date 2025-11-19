import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Shield, Zap, Globe, Users, FileText, CheckCircle2, Play } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { value: "10M+", label: "Documents Processed" },
    { value: "99.9%", label: "Uptime Reliability" },
    { value: "50+", label: "Legal Experts" },
    { value: "24/7", label: "Dedicated Support" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">

      {/* Hero Section with Premium Gradient Background */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50 mix-blend-screen animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] opacity-30" />
          <div className="absolute top-1/3 left-0 w-[600px] h-[500px] bg-indigo-500/10 rounded-full blur-[80px] opacity-30" />
        </div>

        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-primary-600 dark:text-primary-300 mb-8 shadow-lg shadow-primary/5"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              The Future of Legal Tech is Here
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 leading-[1.1]"
            >
              Demystifying Legal <br className="hidden md:block" />
              Documents with <span className="text-gradient">AI Intelligence</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Transform how you interact with legal documents. Our AI-powered platform makes complex legal language accessible, actionable, and collaborative for everyone.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={() => navigate("/dashboard")}
                className="btn-primary group text-lg px-8 py-4 inline-flex items-center"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => navigate("/demo")}
                className="btn-secondary group text-lg px-8 py-4 inline-flex items-center"
              >
                <Play className="mr-2 h-5 w-5 fill-current" />
                Watch Demo
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-16 pt-8 border-t border-border/50"
            >
              <p className="text-sm text-muted-foreground mb-6 font-medium uppercase tracking-wider">Trusted by innovative legal teams</p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Placeholders for logos - using text for now but styled like logos */}
                {['LawFirm Co', 'LegalTech Inc', 'Global Counsel', 'Justice AI', 'Modern Law'].map((company) => (
                  <span key={company} className="text-xl font-display font-bold text-foreground/40 hover:text-primary transition-colors cursor-default">
                    {company}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section with Glass Cards */}
      <section className="py-20 relative">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-8 rounded-2xl text-center border-t-4 border-t-primary/20 hover:border-t-primary transition-colors"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-display">{stat.value}</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-secondary/30 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Revolutionary Legal Technology
            </h2>
            <p className="text-xl text-muted-foreground">
              Our platform combines cutting-edge AI with legal expertise to deliver unprecedented value and clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: "AI-Powered Insights", desc: "Advanced legal intelligence that understands context and provides actionable recommendations instantly." },
              { icon: Shield, title: "Enterprise Security", desc: "Bank-grade encryption and security protocols to ensure your sensitive legal data remains protected." },
              { icon: Zap, title: "Lightning Fast", desc: "Process complex legal documents in seconds, not hours, with our optimized AI processing engine." },
              { icon: Globe, title: "Global Compliance", desc: "Built-in compliance checks for international legal frameworks and jurisdiction-specific regulations." },
              { icon: Users, title: "Collaborative Workspace", desc: "Seamlessly work together with colleagues and clients in real-time with granular role-based access." },
              { icon: FileText, title: "Smart Templates", desc: "Generate customized legal documents from scratch using our library of AI-verified templates." }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-background rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/20 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />

                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-display group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-900 dark:bg-primary-950 text-white">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-800 to-primary-950 opacity-90"></div>
        </div>

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 text-white">
              Ready to Transform Your <br /> Legal Workflow?
            </h2>
            <p className="text-xl text-primary-100 mb-12 max-w-2xl mx-auto">
              Join thousands of legal professionals who have already revolutionized their practice with LegalKlarity's intelligent platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="px-10 py-5 bg-white text-primary-900 font-bold rounded-full hover:bg-gray-100 transition shadow-2xl hover:shadow-white/20 text-lg"
              >
                Get Started for Free
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="px-10 py-5 bg-transparent border border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition text-lg backdrop-blur-sm"
              >
                Contact Sales
              </button>
            </div>
            <p className="mt-8 text-sm text-primary-200/60">
              No credit card required for 14-day trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

