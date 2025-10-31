/* FileUpload.js */
import React from "react";
import api from "../services/api";

export default function FileUpload({onSummary, onLoading}){
  const [file, setFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);
  const [grammarCorrection, setGrammarCorrection] = React.useState(false);
  const [humanize, setHumanize] = React.useState(false);
  const fileInputRef = React.useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if(!file) return;

    setLoading(true);
    setError(null);
    setSuccess(false);
    setProgress(0);
    onLoading(true);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try{
      const fd = new FormData();
      fd.append("file", file);
      fd.append("grammar_correction", grammarCorrection.toString());
      fd.append("humanize", humanize.toString());
      const res = await api.post("/api/summarize", fd);

      clearInterval(progressInterval);
      setProgress(100);
      setSuccess(true);
      onSummary(res.data.summary);

      setTimeout(() => {
        setSuccess(false);
        setProgress(0);
      }, 3000);

    }catch(err){
      clearInterval(progressInterval);
      console.error(err);
      setError("Upload failed. Please try again.");
      setProgress(0);
    }finally{
      setLoading(false);
      onLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: '500px', margin: '0 auto' }}>
      {/* Success/Error Messages */}
      {success && (
        <div className="success-message">
          <span>✅</span>
          <span>Document summarized successfully!</span>
        </div>
      )}

      {error && (
        <div className="error-message">
          <span>❌</span>
          <span>{error}</span>
        </div>
      )}

      {/* Drag and Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="tooltip"
        style={{
          border: `2px dashed ${dragActive ? 'var(--primary-color)' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '40px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'var(--transition)',
          backgroundColor: dragActive ? 'rgba(99, 102, 241, 0.08)' : 'var(--secondary-color)',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: dragActive ? 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)' : 'none',
          transition: 'var(--transition)'
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '16px',
            opacity: '0.8',
            animation: dragActive ? 'bounce 1s infinite' : 'none'
          }}>
            {dragActive ? '🎯' : '📎'}
          </div>
          <p style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '8px'
          }}>
            {file ? file.name : "Drop your PDF here or click to browse"}
          </p>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.875rem'
            }}>
            Supports PDF and image files (JPG, PNG, GIF, BMP, WebP) up to 10MB
            </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <span className="tooltip-text">Click or drag a PDF file here to upload</span>
      </div>

      {/* File Preview */}
      {file && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--secondary-color)',
          padding: '16px 20px',
          borderRadius: 'var(--radius)',
          marginBottom: '24px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow)',
          transition: 'var(--transition)'
        }}
        onMouseEnter={(e) => e.target.style.boxShadow = 'var(--shadow-lg)'}
        onMouseLeave={(e) => e.target.style.boxShadow = 'var(--shadow)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              fontSize: '2rem',
              animation: 'pulse 2s infinite'
            }}>
              📄
            </div>
            <div>
              <p style={{
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: '0 0 4px 0'
              }}>
                {file.name}
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                margin: '0'
              }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to summarize
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="tooltip"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '1.25rem',
              padding: '8px',
              borderRadius: '50%',
              transition: 'var(--transition)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#ef4444';
              e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--text-secondary)';
              e.target.style.backgroundColor = 'none';
              e.target.style.transform = 'scale(1)';
            }}
          >
            ✕
          </button>
          <span className="tooltip-text">Remove file</span>
        </div>
      )}

      {/* Progress Bar */}
      {loading && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {/* Options */}
      <div style={{
        backgroundColor: 'var(--secondary-color)',
        padding: '20px',
        borderRadius: 'var(--radius)',
        marginBottom: '24px',
        border: '1px solid var(--border-color)'
      }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          ⚙️ Summary Options
        </h3>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: 'var(--radius)',
            transition: 'var(--transition)',
            backgroundColor: grammarCorrection ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.05)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = grammarCorrection ? 'rgba(99, 102, 241, 0.1)' : 'transparent'}
          >
            <input
              type="checkbox"
              checked={grammarCorrection}
              onChange={(e) => setGrammarCorrection(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                accentColor: 'var(--primary-color)'
              }}
            />
            <div>
              <span style={{
                fontWeight: '500',
                color: 'var(--text-primary)'
              }}>
                📝 Grammar Correction
              </span>
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                margin: '2px 0 0 0'
              }}>
                Fix capitalization and punctuation
              </p>
            </div>
          </label>

          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: 'var(--radius)',
            transition: 'var(--transition)',
            backgroundColor: humanize ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.05)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = humanize ? 'rgba(99, 102, 241, 0.1)' : 'transparent'}
          >
            <input
              type="checkbox"
              checked={humanize}
              onChange={(e) => setHumanize(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                accentColor: 'var(--primary-color)'
              }}
            />
            <div>
              <span style={{
                fontWeight: '500',
                color: 'var(--text-primary)'
              }}>
                🤖 AI Humanizer
              </span>
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                margin: '2px 0 0 0'
              }}>
                Make summary more natural and human-like
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          type="submit"
          disabled={loading || !file}
          className={`btn ${loading ? '' : 'btn-primary'}`}
          style={{
            opacity: (loading || !file) ? 0.6 : 1,
            cursor: (loading || !file) ? 'not-allowed' : 'pointer',
            minWidth: '220px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {loading ? (
            <>
              <div className="spin" style={{ fontSize: '1rem' }}>⏳</div>
              Summarizing... {progress}%
            </>
          ) : (
            <>
              <span style={{
                fontSize: '1.25rem',
                animation: file ? 'bounce 2s infinite' : 'none'
              }}>
                🚀
              </span>
              Upload & Summarize
            </>
          )}
        </button>

        {!file && (
          <p style={{
            marginTop: '12px',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            fontStyle: 'italic'
          }}>
            💡 Select a PDF file first to enable summarization
          </p>
        )}
      </div>
    </form>
  );
}
