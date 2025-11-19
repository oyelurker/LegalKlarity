import {NavBarDemo} from '../../components/ui/navbar-demo';

const TubelightNavbarDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6">
          Tubelight Navbar Component
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">
          A beautiful animated navbar with tubelight effects. This demo showcases the interactive navbar with smooth animations.
        </p>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-12">
          <div className="h-96 flex items-center justify-center bg-slate-50 dark:bg-slate-700 rounded-xl relative overflow-hidden">
            {/* This is a placeholder to demonstrate the navbar position */}
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Navbar would appear at the top/bottom of the screen
            </p>
            
            {/* Demonstrating the navbar would be fixed */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <NavBarDemo />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">Animated Effects</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Smooth tubelight animations that follow the active tab with a glowing effect.
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">Responsive Design</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Adapts to mobile and desktop views with appropriate icon/text display.
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">Easy Integration</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Simple API to customize navigation items with icons and links.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TubelightNavbarDemo;