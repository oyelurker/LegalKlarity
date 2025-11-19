import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { registerAsync } from '../../store/authSlice';
import { useAppDispatch } from '../../hooks/redux';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Register: React.FC = () => {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    language: '',
    region: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};


    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});

    // Check if we're in mock mode
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      try {
        // Mock registration
        const result = await dispatch(registerAsync({
          email: formData.email,
          displayName: formData.name,
          region: formData.region,
          language: formData.language,
        })).unwrap();

        if (result.user) {
          toast.success("Account created successfully (mock)!");
          setLoading(false);
          navigate("/login");
        } else {
          toast.error("Failed to create account.");
        }
        return;
      } catch (apiError: any) {
        toast.error(apiError.message || "Failed to create account.");
        setLoading(false);
        return;
      }
    }

    // Firebase registration
    try {
      if (!auth) {
        throw new Error("Firebase auth is not initialized");
      }

      await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      // Call backend API to create Firestore user profile via authService
      try {
        const result = await dispatch(registerAsync({
          email: formData.email,
          displayName: formData.name,
          region: formData.region,
          language: formData.language,
        })).unwrap();
        // console.log("Registration result:", result); // Debug log

        if (result.user) {
          toast.success("Account created successfully!");
          setLoading(false);
          navigate("/login");
        } else {
          toast.error("Failed to create account.");
        }
      } catch (apiError: any) {
        toast.error(apiError.message || "Failed to create account.");
        setLoading(false);
        return;
      }

    } catch (error: any) {
      let message = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'Email is already in use.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      }
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-12">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[600px] bg-blue-600/5 rounded-full blur-[100px] opacity-30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full space-y-8 relative z-10 px-4"
      >
        <div className="glass-panel p-8 md:p-10 rounded-2xl shadow-2xl border border-white/20">
          <div className="text-center">
            <div className="mx-auto h-14 w-14 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="text-white text-2xl font-bold">LK</span>
            </div>
            <h2 className="mt-6 text-3xl font-display font-bold text-foreground">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Join LegalKlarity to simplify your legal journey
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm shadow-sm mb-2 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200">
                <div className="flex items-center">
                  <span className="mr-2">⚠️</span>
                  {errors.general}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                placeholder="Enter your full name"
                required
                className="bg-white/50 dark:bg-slate-800/50"
              />
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                placeholder="your.email@gov.in"
                required
                className="bg-white/50 dark:bg-slate-800/50"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-foreground mb-1">
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2.5 bg-white/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-colors dark:bg-slate-800/50 dark:border-slate-600 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="bn">Bengali (বাংলা)</option>
                  <option value="te">Telugu (తెలుగు)</option>
                  <option value="mr">Marathi (मराठी)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                  <option value="ur">Urdu (اردو)</option>
                  <option value="gu">Gujarati (ગુજરાતી)</option>
                  <option value="kn">Kannada (ಕನ್ನಡ)</option>
                  <option value="ml">Malayalam (മലയാളം)</option>
                  <option value="or">Odia (ଓଡ଼ିଆ)</option>
                  <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
                  <option value="as">Assamese (অসমীয়া)</option>
                  <option value="ma">Maithili (मैथिली)</option>
                  <option value="sa">Sanskrit (संस्कृतम्)</option>
                  <option value="sd">Sindhi (سنڌي)</option>
                  <option value="ks">Kashmiri (کٲشُر)</option>
                  <option value="ne">Nepali (नेपाली)</option>
                  <option value="bho">Bhojpuri (भोजपुरी)</option>
                  <option value="ta">Santali (ᱥᱟᱱᱛᱟᱲᱤ)</option>
                  <option value="dog">Dogri (डोगरी)</option>
                  <option value="mni">Manipuri (মৈতৈলোন্)</option>
                  <option value="kok">Konkani (कोंकणी)</option>
                  <option value="doi">Dogri (डोगरी)</option>
                  <option value="brj">Braj (ब्रज भाषा)</option>
                  <option value="raj">Rajasthani (राजस्थानी)</option>
                  <option value="bh">Bihari (बिहारी)</option>
                  <option value="ch">Chhattisgarhi (छत्तीसगढ़ी)</option>
                  <option value="mag">Magahi (मगही)</option>
                  <option value="awa">Awadhi (अवधी)</option>
                  <option value="gom">Goan Konkani (कोंकणी)</option>
                  <option value="lep">Lepcha (ᰛᰩᰵᰛᰧᰵ)</option>
                  <option value="mtr">Mundari (ᱢᱩᱱᱫᱟᱨᱤ)</option>
                  <option value="ho">Ho (ᱦᱚ)</option>
                  <option value="sat">Santal (ᱥᱟᱱᱛᱟᱲᱤ)</option>
                  <option value="khn">Khasi (Ka Khasi)</option>
                  <option value="grt">Garo (A·chik)</option>
                  <option value="lus">Mizo (Mizo tawng)</option>
                  <option value="njz">Naga (Naga languages)</option>
                  <option value="en-IN">Other (Other Indian Language)</option>
                </select>
                <p className="mt-1 text-xs text-muted-foreground">
                  Select your Language
                </p>
              </div>
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-foreground mb-1">
                  Region/State
                </label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2.5 bg-white/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-colors dark:bg-slate-800/50 dark:border-slate-600 dark:text-white"
                >
                  <option value="">Select Region</option>
                  <option value="andhra-pradesh">Andhra Pradesh</option>
                  <option value="arunachal-pradesh">Arunachal Pradesh</option>
                  <option value="assam">Assam</option>
                  <option value="bihar">Bihar</option>
                  <option value="chhattisgarh">Chhattisgarh</option>
                  <option value="goa">Goa</option>
                  <option value="gujarat">Gujarat</option>
                  <option value="haryana">Haryana</option>
                  <option value="himachal-pradesh">Himachal Pradesh</option>
                  <option value="jharkhand">Jharkhand</option>
                  <option value="karnataka">Karnataka</option>
                  <option value="kerala">Kerala</option>
                  <option value="madhya-pradesh">Madhya Pradesh</option>
                  <option value="maharashtra">Maharashtra</option>
                  <option value="manipur">Manipur</option>
                  <option value="meghalaya">Meghalaya</option>
                  <option value="mizoram">Mizoram</option>
                  <option value="nagaland">Nagaland</option>
                  <option value="odisha">Odisha</option>
                  <option value="punjab">Punjab</option>
                  <option value="rajasthan">Rajasthan</option>
                  <option value="sikkim">Sikkim</option>
                  <option value="tamil-nadu">Tamil Nadu</option>
                  <option value="telangana">Telangana</option>
                  <option value="tripura">Tripura</option>
                  <option value="uttar-pradesh">Uttar Pradesh</option>
                  <option value="uttarakhand">Uttarakhand</option>
                  <option value="west-bengal">West Bengal</option>
                  <option value="delhi">Delhi</option>
                  <option value="chandigarh">Chandigarh</option>
                  <option value="puducherry">Puducherry</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                placeholder="Create a strong password"
                required
                className="bg-white/50 dark:bg-slate-800/50"
              />
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                placeholder="Confirm your password"
                required
                className="bg-white/50 dark:bg-slate-800/50"
              />
            </div>
            <Button
              type="submit"
              loading={loading}
              className="w-full btn-primary py-3 text-base"
              size="lg"
            >
              Create Account
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary-700 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
