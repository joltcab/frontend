import React, { useState } from "react";
import { joltcab } from "@/lib/joltcab-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackendDiagnostic() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [expandedTests, setExpandedTests] = useState([]);

  const runDiagnostic = async () => {
    setLoading(true);
    setError(null);
    try {
      // Hacer múltiples checks del sistema
      const checks = await Promise.allSettled([
        fetch('http://localhost:4000/health').then(r => r.json()),
        joltcab.stats.dashboard(),
        joltcab.entities.User.list(),
        joltcab.entities.Admin.list(),
      ]);

      const passed = checks.filter(c => c.status === 'fulfilled').length;
      const failed = checks.filter(c => c.status === 'rejected').length;
      
      const results = {
        overall_status: failed === 0 ? 'healthy' : (passed > failed ? 'warning' : 'critical'),
        timestamp: new Date().toISOString(),
        tests: [
          {
            name: 'Backend Server',
            status: checks[0].status === 'fulfilled' ? 'pass' : 'fail',
            message: checks[0].status === 'fulfilled' ? 'Server is running' : 'Server is down',
            details: checks[0].status === 'fulfilled' ? checks[0].value : null,
          },
          {
            name: 'Dashboard Stats',
            status: checks[1].status === 'fulfilled' ? 'pass' : 'fail',
            message: checks[1].status === 'fulfilled' ? 'Stats endpoint working' : 'Stats endpoint failed',
          },
          {
            name: 'User Database',
            status: checks[2].status === 'fulfilled' ? 'pass' : 'fail',
            message: checks[2].status === 'fulfilled' ? `${checks[2].value?.length || 0} users found` : 'User query failed',
          },
          {
            name: 'Admin Database',
            status: checks[3].status === 'fulfilled' ? 'pass' : 'fail',
            message: checks[3].status === 'fulfilled' ? `${checks[3].value?.length || 0} admins found` : 'Admin query failed',
          },
        ],
        summary: {
          total: 4,
          passed: passed,
          failed: failed,
          warnings: 0,
        },
      };
      
      setResults(results);
      
      // Auto-expand failed tests
      const failedTests = results.tests
        .map((t, i) => ({ test: t, index: i }))
        .filter(({ test }) => test.status === 'fail')
        .map(({ index }) => index);
      setExpandedTests(failedTests);
      
    } catch (error) {
      console.error('Diagnostic error:', error);
      setError(error.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleTest = (index) => {
    setExpandedTests(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pass': return 'text-green-600 bg-green-100';
      case 'fail': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'fail': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Backend Diagnostic</h2>
          <p className="text-gray-600">Comprehensive backend health check</p>
        </div>
        <Button
          onClick={runDiagnostic}
          disabled={loading}
          className="bg-[#15B46A] hover:bg-[#0F9456]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running Diagnostic...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Run Diagnostic
            </>
          )}
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-500 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Diagnostic Failed</h3>
                <p className="text-red-700 text-sm whitespace-pre-wrap">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Card */}
          <Card className={`border-2 ${
            results.overall_status === 'pass' ? 'border-green-500 bg-green-50' :
            results.overall_status === 'fail' ? 'border-red-500 bg-red-50' :
            'border-yellow-500 bg-yellow-50'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(results.overall_status)}
                    <h3 className="text-2xl font-bold text-gray-900">
                      Overall Status: {results.overall_status.toUpperCase()}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Tested at {new Date(results.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{results.summary.passed}</p>
                    <p className="text-sm text-gray-600">Passed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-600">{results.summary.warnings}</p>
                    <p className="text-sm text-gray-600">Warnings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-600">{results.summary.failed}</p>
                    <p className="text-sm text-gray-600">Failed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          <div className="space-y-4">
            {results.tests.map((test, index) => (
              <Card key={index} className="overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleTest(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {expandedTests.includes(index) ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                      {getStatusIcon(test.status)}
                      <h3 className="font-semibold text-gray-900">{test.name}</h3>
                    </div>
                    <Badge className={getStatusColor(test.status)}>
                      {test.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedTests.includes(index) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="border-t bg-gray-50 p-4">
                        <div className="space-y-2">
                          <div className="p-3 bg-white rounded-lg">
                            <p className="font-medium text-gray-900 mb-2">
                              {test.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {test.message}
                            </p>
                            {test.details && (
                              <pre className="mt-3 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-64">
                                {JSON.stringify(test.details, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
          </div>

          {/* Recommendations */}
          {(results.summary.failed > 0 || results.summary.warnings > 0) && (
            <Card className="border-2 border-blue-500 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-900">Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-blue-800">
                  {results.summary.failed > 0 && (
                    <>
                      <li>• Review and fix all <strong>FAILED</strong> tests immediately</li>
                      <li>• Check API keys in Admin Panel → Integration Settings</li>
                      <li>• Verify all required services are configured</li>
                    </>
                  )}
                  {results.summary.warnings > 0 && (
                    <>
                      <li>• Initialize missing configurations using seed functions</li>
                      <li>• Run <code>seedRoles</code> to set up RBAC system</li>
                      <li>• Run <code>seedSystemConfig</code> for base configurations</li>
                      <li>• Run <code>seedEmailTemplates</code> and <code>seedSMSTemplates</code></li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}

      {/* Initial State */}
      {!results && !loading && !error && (
        <Card className="p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Backend Diagnostic Tool
          </h3>
          <p className="text-gray-600 mb-6">
            Run a comprehensive check of your backend infrastructure
          </p>
          <Button
            onClick={runDiagnostic}
            size="lg"
            className="bg-[#15B46A] hover:bg-[#0F9456]"
          >
            <Search className="w-5 h-5 mr-2" />
            Start Diagnostic
          </Button>
        </Card>
      )}
    </div>
  );
}