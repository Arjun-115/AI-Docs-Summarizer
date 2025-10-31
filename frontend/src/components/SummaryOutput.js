/* SummaryOutput.js */
import React from "react";

export default function SummaryOutput({summary}){
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const wordCount = summary ? summary.trim().split(/\s+/).length : 0;

  return (
    <div className="fade-in">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: '0 0 4px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              fontSize: '1.75rem',
              animation: 'pulse 2s infinite'
            }}>
              📋
            </span>
            AI-Generated Summary
          </h3>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            margin: '0',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span>📊</span>
            {wordCount} words • Extracted key points using LSA algorithm
          </p>
        </div>

        {summary && (
          <button
            onClick={copyToClipboard}
            className={`btn ${copied ? 'btn-primary' : 'btn-secondary'} tooltip`}
            style={{
              padding: '10px 18px',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'var(--transition)',
              minWidth: '100px'
            }}
          >
            {copied ? (
              <>
                <span style={{ animation: 'bounce 1s' }}>✅</span>
                Copied!
              </>
            ) : (
              <>
                <span>📋</span>
                Copy
              </>
            )}
          </button>
        )}
        {summary && <span className="tooltip-text">Copy summary to clipboard</span>}
      </div>

      <div style={{
        position: 'relative',
        backgroundColor: 'var(--secondary-color)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        minHeight: '140px',
        lineHeight: '1.8',
        boxShadow: 'var(--shadow)',
        transition: 'var(--transition)'
      }}
      onMouseEnter={(e) => e.target.style.boxShadow = 'var(--shadow-lg)'}
      onMouseLeave={(e) => e.target.style.boxShadow = 'var(--shadow)'}
      >
        {summary ? (
          <div style={{
            whiteSpace: 'pre-wrap',
            color: 'var(--text-primary)',
            fontSize: '1.05rem',
            fontWeight: '400',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-8px',
              left: '-8px',
              fontSize: '1.5rem',
              opacity: '0.1',
              animation: 'pulse 3s infinite'
            }}>
              ✨
            </div>
            {summary}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            fontSize: '1.125rem',
            minHeight: '100px'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '16px',
              opacity: '0.6',
              animation: 'bounce 2s infinite'
            }}>
              📝
            </div>
            <p style={{
              margin: '0',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              Your AI-generated summary will appear here
            </p>
            <p style={{
              margin: '8px 0 0 0',
              textAlign: 'center',
              fontSize: '0.875rem',
              opacity: '0.7'
            }}>
              Upload a PDF document to get started
            </p>
          </div>
        )}

        {/* Enhanced Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-3px',
          left: '-3px',
          right: '-3px',
          height: '6px',
          background: 'var(--gradient)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          opacity: '0.8'
        }}></div>

        <div style={{
          position: 'absolute',
          bottom: '-3px',
          right: '-3px',
          width: '20px',
          height: '20px',
          background: 'var(--gradient-secondary)',
          borderRadius: '50%',
          opacity: '0.6',
          animation: 'pulse 4s infinite'
        }}></div>
      </div>

      {/* Enhanced Additional Info */}
      {summary && (
        <div style={{
          marginTop: '20px',
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: 'var(--radius)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          boxShadow: 'var(--shadow)',
          transition: 'var(--transition)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <div style={{
            position: 'absolute',
            top: '-10px',
            left: '-10px',
            width: '30px',
            height: '30px',
            background: 'var(--gradient-accent)',
            borderRadius: '50%',
            opacity: '0.1',
            animation: 'pulse 3s infinite'
          }}></div>

          <span style={{
            fontSize: '1.25rem',
            animation: 'bounce 2s infinite'
          }}>
            💡
          </span>
          <div style={{ flex: 1 }}>
            <p style={{
              margin: '0 0 8px 0',
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              fontWeight: '600'
            }}>
              Pro Tip for Better Results
            </p>
            <p style={{
              margin: '0',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.5'
            }}>
              This summary captures the main ideas and key points from your document using advanced LSA algorithms.
              For best results, ensure your PDF contains clear, well-structured text with distinct paragraphs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
