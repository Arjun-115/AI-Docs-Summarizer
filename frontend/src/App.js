  // src/App.js
import React from "react";
import FileUpload from "./components/FileUpload";
import SummaryOutput from "./components/SummaryOutput";

function App(){
  const [summary, setSummary] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <div className="fade-in">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div style={{ textAlign: 'center' }}>
            <div className="loading-spinner"></div>
            <p style={{
              marginTop: '16px',
              color: 'var(--text-primary)',
              fontWeight: '600'
            }}>
              Processing your document...
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div style={{
        background: 'url(/git.gif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center',
        marginBottom: '40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '20px',
            animation: 'bounce 2s infinite'
          }}>
            📄✨
          </div>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            marginBottom: '16px',
            textShadow: '0 4px 8px rgba(0,0,0,0.4)',
            background: 'url(/git.gif)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',

          }}>
            AI Document & Image Analyzer
          </h1>
          <p style={{
            fontSize: '1.25rem',
            opacity: '0.95',
            maxWidth: '700px',
            margin: '0 auto 24px',
            lineHeight: '1.7',
            fontWeight: '300'
          }}>
            Transform lengthy documents and images into concise, intelligent summaries and descriptions using advanced AI technology.
            Upload your PDF or image files and get instant analysis in seconds.
          </p>

          <div className="tooltip" style={{ display: 'inline-block' }}>
            <button
              className="btn btn-secondary"
              style={{
                background: 'rgba(243, 35, 149, 0.89)',
                border: '2px solid rgba(206, 206, 229, 0.95)',
                color: 'Black',
                backdropFilter: 'blur(10px)',
                fontSize: '1rem',
                padding: '12px 24px'
              }}
              onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              🚀 Get Started
            </button>
            <span className="tooltip-text">Click to jump to upload section</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px 60px',
        display: 'flex',
        gap: '40px',
        alignItems: 'flex-start'
      }}>
        {/* Features Section - Left Side */}
        <div style={{
          flex: '0 0 300px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          position: 'sticky',
          top: '20px'
        }}>
          <div className="card text-center slide-in-left" style={{ animationDelay: '0.1s' }}>
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '16px',
              animation: 'bounce 3s infinite'
            }}>
              ⚡
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '8px',
              background: 'var(--gradient-accent)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Lightning Fast
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Get summaries in seconds using optimized LSA algorithms
            </p>
          </div>

          <div className="card text-center fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '16px',
              animation: 'pulse 3s infinite'
            }}>
              🎯
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '8px',
              background: 'var(--gradient-secondary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Highly Accurate
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Extract key points and main ideas with high precision
            </p>
          </div>
        </div>

        {/* Main Content Area - Right Side */}
        <div style={{
          flex: 1,
          display: 'grid',
          gap: '40px',
          minWidth: 0
        }}>
          {/* Upload Section */}
          <div id="upload-section" className="card fade-in-up">
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '16px',
                animation: 'pulse 2s infinite'
              }}>
                📤
              </div>
              <h2 style={{
                fontSize: '1.875rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
              📄 Upload Your Document
            </h2>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem'
            }}>
              Select a PDF or image file to generate an AI-powered summary or description
            </p>
            </div>
            <FileUpload onSummary={setSummary} onLoading={setIsLoading} />
          </div>

          {/* Summary Section */}
          {summary && (
            <div className="card slide-in-right">
              <SummaryOutput summary={summary} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
