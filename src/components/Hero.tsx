import React from 'react';

// Simple SVG Icons for the AI models
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const OpenAIIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9995 3.753 6.0462 6.0462 0 0 0 .7427 7.0222 5.98 5.98 0 0 0 .511 4.9107 6.0462 6.0462 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.997-3.761 6.0462 6.0462 0 0 0-.7468-6.2121L22.282 9.821zM11.5577 2.4758a4.819 4.819 0 0 1 3.8491 2.3397l-.7665 1.3365a.603.603 0 0 0 .0316.6408l.3116.5193-1.319-2.2861a4.819 4.819 0 0 1-2.1068-.5504zm1.9056 4.0984l-1.329-2.3021a4.7895 4.7895 0 0 1 3.3912.4206l-1.637 2.8427a.603.603 0 0 0 .0834.7876l.4623.3698zm-6.2946.0456a4.819 4.819 0 0 1 3.0645-3.321L9.043 5.4387a.603.603 0 0 0-.612.2036l-.3698.4623L10.375 3.2575a4.7895 4.7895 0 0 1 1.761 3.018l-3.0886 1.7828a1.2059 1.2059 0 0 0-1.8787-1.4385zm-2.0945 6.0454a4.819 4.819 0 0 1 .5504-4.5168l1.3365.7665a.603.603 0 0 0-.6408.0316l-.5193.3116 2.2861 1.319a4.819 4.819 0 0 1-.7609-2.1155v4.89zm6.305 6.7454l-1.7828-3.0886a1.2059 1.2059 0 0 0 1.4385-1.8787l-3.221 2.0357a4.819 4.819 0 0 1 3.0645 1.1958v4.89l-1.7828-3.0886a1.2059 1.2059 0 0 0-1.2828-3.2428zm-3.018-1.761a4.7895 4.7895 0 0 1-3.018-1.761l2.8427-1.637a.603.603 0 0 0 .2036.612l.4623.3698-1.637 2.8427a1.2059 1.2059 0 0 0 1.1464-.4265zM13.2599 21.5242a4.819 4.819 0 0 1-3.8491-2.3397l.7665-1.3365a.603.603 0 0 0-.0316-.6408l-.3116-.5193 1.319 2.2861a4.819 4.819 0 0 1 2.1068.5504zm1.9056-4.0984l1.329 2.3021a4.7895 4.7895 0 0 1-3.3912-.4206l1.637-2.8427a.603.603 0 0 0-.0834-.7876l-.4623-.3698zm6.2946-.0456a4.819 4.819 0 0 1-3.0645 3.321l1.1903-2.1402a.603.603 0 0 0 .612-.2036l.3698-.4623-2.3063 2.8622a4.7895 4.7895 0 0 1-1.761-3.018l3.0886-1.7828a1.2059 1.2059 0 0 0 1.8787 1.4385zm2.0945-6.0454a4.819 4.819 0 0 1-.5504 4.5168l-1.3365-.7665a.603.603 0 0 0-.6408.0316l-.5193.3116 2.2861-1.319a4.819 4.819 0 0 1 .7609 2.1155v-4.89zm-6.305-6.7454l1.7828 3.0886a1.2059 1.2059 0 0 0 1.4385-1.8787l-3.221 2.0357a4.819 4.819 0 0 1 3.0645 1.1958v4.89l-1.7828-3.0886a1.2059 1.2059 0 0 0-1.2828-3.2428z"/>
  </svg>
);

const AnthropicIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M11.909 3.03348C12.4435 2.15574 13.5565 2.15574 14.0909 3.03348L22.1818 16.3262C22.756 17.269 22.078 18.5 20.9754 18.5H16.8926L13.0001 11.5L9.10747 18.5H5.02458C3.92193 18.5 3.24395 17.269 3.81816 16.3262L11.909 3.03348Z" fill="#D97757"/>
    </svg>
);

const MetaIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#0668E1]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 11.83c-1.1-2.07-2.58-3.41-4.14-3.41-2.47 0-4.04 2.19-4.04 4.54 0 2.21 1.48 4.09 3.84 4.09 1.51 0 2.91-1.1 4.34-3.46 1.13 2.08 2.58 3.46 4.14 3.46 2.47 0 4.04-2.19 4.04-4.54 0-2.21-1.48-4.09-3.84-4.09-1.51 0-2.91 1.1-4.34 3.41zM7.85 15.35c-1.23 0-2.03-1.12-2.03-2.39 0-1.39.88-2.61 2.03-2.61.53 0 1.05.23 1.54.85-1.02 1.63-1.54 2.87-1.54 4.15zm8.3-4.15c1.23 0 2.03 1.12 2.03 2.39 0 1.39-.88 2.61-2.03 2.61-.53 0-1.05-.23-1.54-.85 1.02-1.63 1.54-2.87 1.54-4.15z"/>
    </svg>
);

const MistralIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#C89D33]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 19V5h4l4 6 4-6h4v14h-4v-8l-4 6-4-6v8H4z"/>
  </svg>
);

const XIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
);

const CohereIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#F93822]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" />
    </svg>
);

const LogoButton: React.FC<{ icon: React.ReactNode; label?: string }> = ({ icon }) => (
  <div className="w-10 h-10 rounded-full bg-[#1e1e1e] border border-[#333] flex items-center justify-center hover:bg-[#2a2a2a] transition-colors cursor-pointer group">
    <div className="group-hover:scale-110 transition-transform">
        {icon}
    </div>
  </div>
);

const Hero: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center mt-[-60px] relative z-10">
      
      {/* Radial Gradient Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[200px] md:h-[400px] bg-blue-500/10 rounded-full blur-[80px] md:blur-[100px] -z-10 pointer-events-none"></div>

      {/* Logos */}
      <div className="flex flex-wrap justify-center items-center gap-3 mb-8 max-w-[90%]">
        <LogoButton icon={<GoogleIcon />} />
        <LogoButton icon={<OpenAIIcon />} />
        <LogoButton icon={<AnthropicIcon />} />
        <LogoButton icon={<MetaIcon />} />
        <LogoButton icon={<MistralIcon />} />
        <LogoButton icon={<XIcon />} />
        <LogoButton icon={<CohereIcon />} />
      </div>

      <h1 className="text-3xl md:text-5xl font-semibold text-white mb-4 tracking-tight leading-tight">
        Find the best AI for you
      </h1>
      
      <p className="text-textSecondary text-sm md:text-lg max-w-2xl font-light px-2">
        Compare answers across top AI models, share your feedback and power our public <span className="text-blue-400 cursor-pointer hover:underline font-normal">leaderboard</span>
      </p>
    </div>
  );
};

export default Hero;
