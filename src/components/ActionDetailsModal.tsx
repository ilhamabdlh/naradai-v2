import { useState, useEffect } from "react";
import { X, CheckCircle, Clock, Circle, Share2, Copy, Mail, MessageSquare, Package, Zap, AlertTriangle, Target } from "lucide-react";

interface ActionDetailsModalProps {
  action: any;
  onClose: () => void;
  onStatusChange: (actionId: string | number, status: string) => void;
  currentStatus: string;
}

export function ActionDetailsModal({ action, onClose, onStatusChange, currentStatus }: ActionDetailsModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  const statuses = [
    { value: "not-started", label: "Not Started", icon: Circle, color: "#94a3b8" },
    { value: "in-progress", label: "In Progress", icon: Clock, color: "#f59e0b" },
    { value: "completed", label: "Completed", icon: CheckCircle, color: "#10b981" },
  ];

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    onStatusChange(action.id, status);
  };
  
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      "not-started": "Not Started",
      "in-progress": "In Progress",
      "completed": "Completed",
    };
    return statusMap[status] || "Not Started";
  };

  const handleShare = (method: string) => {
    const shareText = `Priority Action: ${action.title}\n\n${action.description}\n\nRecommendation: ${action.recommendation}\n\nImpact: ${action.impact} | Effort: ${action.effort}`;
    
    if (method === "copy") {
      navigator.clipboard.writeText(shareText);
      setShowShareMenu(false);
    } else if (method === "email") {
      window.location.href = `mailto:?subject=${encodeURIComponent(action.title)}&body=${encodeURIComponent(shareText)}`;
      setShowShareMenu(false);
    } else if (method === "slack") {
      alert("Slack integration coming soon!");
      setShowShareMenu(false);
    }
  };

  const iconMap: Record<string, any> = { Package, MessageSquare, Zap, AlertTriangle, Target };
  
  const getIconComponent = () => {
    if (typeof action.icon === 'string') {
      return iconMap[action.icon] || Package;
    }
    return action.icon || Package;
  };
  const Icon = getIconComponent();

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', width: '520px', maxHeight: '85vh', overflowY: 'auto', border: '1px solid #e2e8f0' }}>
        {/* Header */}
        <div style={{ position: 'sticky', top: 0, backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(to bottom right, #ede9fe, #cffafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon style={{ width: '20px', height: '20px', color: '#7c3aed' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>{action.title}</h2>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>{action.description}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: '6px', borderRadius: '6px', border: 'none', background: 'none', cursor: 'pointer' }}>
            <X style={{ width: '18px', height: '18px', color: '#64748b' }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Status Selection */}
          <div>
            <label style={{ fontSize: '12px', color: '#475569', marginBottom: '8px', display: 'block' }}>Action Status</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {statuses.map((status) => {
                const StatusIcon = status.icon;
                const isSelected = selectedStatus === status.value;
                return (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => setSelectedStatus(status.value)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #8b5cf6' : '2px solid #e2e8f0',
                      backgroundColor: isSelected ? '#f5f3ff' : 'white',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <StatusIcon style={{ width: '16px', height: '16px', margin: '0 auto 4px', color: isSelected ? '#7c3aed' : status.color }} />
                    <div style={{ fontSize: '11px', color: isSelected ? '#5b21b6' : '#475569' }}>{status.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Metrics */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 500, color: '#0f172a', marginBottom: '8px' }}>Key Metrics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Mentions</div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>{(action.mentions || 0).toLocaleString()}</div>
              </div>
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Sentiment</div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: (action.sentiment || 0) < 0 ? '#dc2626' : '#10b981' }}>
                  {(action.sentiment || 0) > 0 ? "+" : ""}{(action.sentiment || 0).toFixed(2)}
                </div>
              </div>
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Trend</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', textTransform: 'capitalize' }}>{action.trend || "stable"}</div>
              </div>
            </div>
          </div>

          {/* AI Recommendation */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 500, color: '#0f172a', marginBottom: '8px' }}>AI Recommendation</h3>
            <div style={{ backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '8px', padding: '10px' }}>
              <p style={{ fontSize: '12px', color: '#0f172a', margin: 0, lineHeight: 1.5 }}>{action.recommendation}</p>
            </div>
          </div>

          {/* Impact & Effort */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: 500, color: '#0f172a', marginBottom: '8px' }}>Expected Impact</h3>
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{action.impact}</div>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: 500, color: '#0f172a', marginBottom: '8px' }}>Required Effort</h3>
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{action.effort}</div>
              </div>
            </div>
          </div>

          {/* Share */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}
            >
              <Share2 style={{ width: '14px', height: '14px' }} />
              Share Action
            </button>
            
            {showShareMenu && (
              <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: '8px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <button onClick={() => handleShare("copy")} style={{ width: '100%', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', color: '#475569' }}>
                  <Copy style={{ width: '14px', height: '14px' }} /> Copy to clipboard
                </button>
                <button onClick={() => handleShare("email")} style={{ width: '100%', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', borderTop: '1px solid #f1f5f9', background: 'none', cursor: 'pointer', fontSize: '12px', color: '#475569' }}>
                  <Mail style={{ width: '14px', height: '14px' }} /> Send via email
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'sticky', bottom: 0, backgroundColor: 'white', borderTop: '1px solid #e2e8f0', padding: '12px 16px', display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white', color: '#475569', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => { handleStatusChange(selectedStatus); onClose(); }}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'linear-gradient(to right, #8b5cf6, #06b6d4)', color: 'white', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}
          >
            Mark as {getStatusLabel(selectedStatus)}
          </button>
        </div>
      </div>
    </div>
  );
}
