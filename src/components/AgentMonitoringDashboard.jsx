/**
 * Agent Monitoring Dashboard
 * Real-time visualization of all 9 agents with metrics, status indicators,
 * performance charts, and system health overview
 */

import React, { useState, useEffect } from 'react';

const AgentMonitoringDashboard = ({ monitoring = {}, metrics = {} }) => {
  const [agents, setAgents] = useState([]);
  const [systemHealth, setSystemHealth] = useState('healthy');
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    // In production, subscribe to real-time updates
    if (monitoring.agents) {
      setAgents(monitoring.agents);
      setSystemHealth(monitoring.health || 'healthy');
    }
  }, [monitoring]);

  const healthColor = {
    healthy: '#4CAF50',
    degraded: '#FFC107',
    critical: '#F44336'
  };

  const statusColor = {
    idle: '#9E9E9E',
    running: '#2196F3',
    completed: '#4CAF50',
    failed: '#F44336',
    blocked: '#FF9800',
    disabled: '#757575'
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <h2>🤖 Agent Monitoring Dashboard</h2>

      {/* System Health Banner */}
      <div style={{
        padding: '15px',
        backgroundColor: healthColor[systemHealth] || '#2196F3',
        color: 'white',
        borderRadius: '4px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0 }}>
            {systemHealth === 'healthy' ? '✅' : systemHealth === 'degraded' ? '⚠️' : '🚨'} System Health: {systemHealth.toUpperCase()}
          </h3>
          <p style={{ margin: '5px 0 0 0' }}>
            {agents.filter(a => a.healthy).length} / {agents.length} agents healthy
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {metrics.systemHealth || 'N/A'}%
          </div>
          <small>System Score</small>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
        <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <small>Total Executions</small>
          <h3 style={{ margin: '5px 0', color: '#2196F3' }}>
            {agents.reduce((sum, a) => sum + a.executionCount, 0)}
          </h3>
        </div>

        <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <small>Success Rate</small>
          <h3 style={{ margin: '5px 0', color: '#4CAF50' }}>
            {metrics.overallSuccessRate || 'N/A'}%
          </h3>
        </div>

        <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <small>Agents Running</small>
          <h3 style={{ margin: '5px 0', color: '#FF9800' }}>
            {agents.filter(a => a.status === 'running').length}
          </h3>
        </div>

        <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <small>Failed Agents</small>
          <h3 style={{ margin: '5px 0', color: '#F44336' }}>
            {agents.filter(a => a.status === 'failed' || !a.healthy).length}
          </h3>
        </div>
      </div>

      {/* Agents Grid */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Agent Status Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
          {agents.map((agent) => (
            <div
              key={agent.name}
              onClick={() => setSelectedAgent(selectedAgent === agent.name ? null : agent.name)}
              style={{
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '4px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${statusColor[agent.status]}`,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0 }}>{agent.name}</h4>
                <span style={{
                  padding: '4px 8px',
                  backgroundColor: statusColor[agent.status],
                  color: 'white',
                  borderRadius: '3px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {agent.status.toUpperCase()}
                </span>
              </div>

              <div style={{ marginTop: '10px', fontSize: '13px', color: '#666' }}>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Progress:</span>
                    <span>{agent.progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', backgroundColor: '#ddd', borderRadius: '2px', overflow: 'hidden', marginTop: '4px' }}>
                    <div style={{
                      width: `${agent.progress}%`,
                      height: '100%',
                      backgroundColor: agent.healthy ? '#4CAF50' : '#F44336',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>

                <div style={{ marginBottom: '6px' }}>
                  <small>Executions: <strong>{agent.executionCount}</strong> | Failures: <strong>{agent.failureCount}</strong></small>
                </div>

                <div style={{ marginBottom: '6px' }}>
                  <small>Tokens: <strong>{agent.tokensUsed}</strong> | Uptime: <strong>{agent.uptime}%</strong></small>
                </div>

                {agent.currentTask && (
                  <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '3px' }}>
                    <small><strong>Current Task:</strong> {agent.currentTask}</small>
                  </div>
                )}

                {agent.lastError && (
                  <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#ffebee', borderRadius: '3px' }}>
                    <small><strong>Error:</strong> {agent.lastError}</small>
                  </div>
                )}
              </div>

              {selectedAgent === agent.name && (
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <div><small><strong>Last Execution:</strong> {agent.lastExecution || 'N/A'}</small></div>
                    <div><small><strong>Avg Execution Time:</strong> {Math.round(agent.averageExecutionTime)}ms</small></div>
                    <div><strong>Health:</strong> <span style={{ color: agent.healthy ? '#4CAF50' : '#F44336' }}>
                      {agent.healthy ? '✅ Healthy' : '❌ Unhealthy'}
                    </span></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* System Metrics */}
      {metrics && Object.keys(metrics).length > 0 && (
        <div>
          <h3>System Metrics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            {metrics.cpu !== undefined && (
              <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <small>CPU Usage</small>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginTop: '8px' }}>
                  <h3 style={{ margin: 0 }}>{metrics.cpu.toFixed(1)}</h3>
                  <span>%</span>
                </div>
                <div style={{ width: '100%', height: '4px', backgroundColor: '#ddd', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(metrics.cpu, 100)}%`,
                    height: '100%',
                    backgroundColor: metrics.cpu > 80 ? '#F44336' : metrics.cpu > 50 ? '#FF9800' : '#4CAF50'
                  }} />
                </div>
              </div>
            )}

            {metrics.memory !== undefined && (
              <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <small>Memory Usage</small>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginTop: '8px' }}>
                  <h3 style={{ margin: 0 }}>{metrics.memory.toFixed(1)}</h3>
                  <span>%</span>
                </div>
                <div style={{ width: '100%', height: '4px', backgroundColor: '#ddd', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(metrics.memory, 100)}%`,
                    height: '100%',
                    backgroundColor: metrics.memory > 85 ? '#F44336' : metrics.memory > 60 ? '#FF9800' : '#4CAF50'
                  }} />
                </div>
              </div>
            )}

            {metrics.errorRate !== undefined && (
              <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <small>Error Rate</small>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginTop: '8px' }}>
                  <h3 style={{ margin: 0 }}>{metrics.errorRate.toFixed(2)}</h3>
                  <span>%</span>
                </div>
                <div style={{ width: '100%', height: '4px', backgroundColor: '#ddd', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(metrics.errorRate * 20, 100)}%`,
                    height: '100%',
                    backgroundColor: metrics.errorRate > 5 ? '#F44336' : metrics.errorRate > 2 ? '#FF9800' : '#4CAF50'
                  }} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentMonitoringDashboard;
