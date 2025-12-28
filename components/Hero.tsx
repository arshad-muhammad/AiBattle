import React from 'react';

const LogoBubble: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg cursor-default hover:scale-110 transition-transform`} style={{ backgroundColor: color }}>
    {label}
  </div>
);

const Hero: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center mt-[-60px]">
      {/* Logos */}
      <div className="flex items-center gap-3 mb-6 opacity-90">
        {/* Approximating the logos from the image with colored circles/initials */}
        <LogoBubble color="#EA4335" label="G" /> {/* Google Red */}
        <LogoBubble color="#10A37F" label="O" /> {/* OpenAI Green */}
        <LogoBubble color="#D97757" label="A" /> {/* Anthropic Orange */}
        <LogoBubble color="#0668E1" label="M" /> {/* Meta Blue */}
        <LogoBubble color="#C89D33" label="Mi" /> {/* Mistral Gold */}
        <LogoBubble color="#000000" label="X" /> {/* xAI Black */}
        <LogoBubble color="#F93822" label="Co" /> {/* Cohere Red */}
      </div>

      <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3 tracking-tight">
        Find the best AI for you
      </h1>
      
      <p className="text-textSecondary text-sm md:text-base max-w-2xl">
        Compare answers across top AI models, share your feedback and power our public <span className="text-blue-400 cursor-pointer hover:underline">leaderboard</span>
      </p>
    </div>
  );
};

export default Hero;
