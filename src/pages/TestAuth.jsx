import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Terminal, User, Database, CheckCircle, XCircle, Loader2, AlertTriangle, UserPlus, Copy } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function TestAuth() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [testCredentials, setTestCredentials] = useState([]);

  const addResult = (test, status, message, details = null) => {
    setResults(prev => [...prev, { 
      test, 
      status, 
      message, 
      details,
      timestamp: new Date().toISOString() 
    }]);
  };

  const createTestUsers = async () => {
    setLoading(true);
    setResults([]);
    setTestCredentials([]);

    try {
      addResult("🔧 Creating Test Users", "running", "Calling backend function...");

      const response = await base44.functions.invoke('createTestUsers', {});
      
      if (response.data.success) {
        addResult("✅ Test Users", "success", response.data.message, response.data.results);
        
        // Extraer credenciales
        const creds = response.data.results
          .filter(r => r.status === 'created' || r.status === 'exists')
          .map(r => ({
            email: r.email,
            password: r.password || 'Use Forgot Password',
            role: r.user?.role || 'unknown'
          }));
        
        setTestCredentials(creds);
      } else {
        addResult("❌ Test Users", "error", response.data.error || "Unknown error", response.data);
      }

    } catch (error) {
      addResult("❌ Error", "error", error.message, error);
    }

    setLoading(false);
  };

  const quickLogin = async (email, password) => {
    setLoading(true);
    try {
      addResult("Login", "running", `Trying to login as ${email}...`);
      await base44.auth.login(email, password);
      const user = await base44.auth.me();
      setCurrentUser(user);
      addResult("Login", "success", "Logged in successfully!", user);
      
      // Redirigir al dashboard correcto
      setTimeout(() => {
        const dashboards = {
          user: "UserDashboard",
          driver: "DriverDashboard",
          corporate: "CorporateDashboard",
          hotel: "HotelDashboard",
          dispatcher: "DispatcherDashboard",
          admin: "AdminPanel"
        };
        window.location.href = createPageUrl(dashboards[user.role] || "UserDashboard");
      }, 1500);
      
    } catch (error) {
      addResult("Login", "error", error.message, error);
    }
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const quickRegister = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      const email = `test${Date.now()}@joltcab.com`;
      const password = "test123456";
      
      addResult("Register", "running", "Registering new user...");
      
      // Registrar con Base44
      await base44.auth.register(email, password);
      addResult("Register", "success", "Registration successful!");
      
      // Login
      addResult("Login", "running", "Logging in...");
      await base44.auth.login(email, password);
      addResult("Login", "success", "Login successful!");
      
      // Actualizar perfil
      addResult("Profile", "running", "Updating profile...");
      await base44.auth.updateMe({
        full_name: "Test User",
        role: "user",
        phone: "+1234567890",
        status: "active"
      });
      
      const user = await base44.auth.me();
      setCurrentUser(user);
      addResult("Profile", "success", "Profile updated!", user);
      
      addResult("✅ Complete", "success", `Account created: ${email} / ${password}`);
      
    } catch (error) {
      addResult("Error", "error", error.message, error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6 border-2 border-indigo-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal className="w-8 h-8 text-indigo-600" />
                <div>
                  <CardTitle className="text-2xl">🔬 Authentication Testing Tool</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Create test users and test login</p>
                </div>
              </div>
              {currentUser && (
                <Badge className="bg-green-100 text-green-800 px-4 py-2">
                  <User className="w-4 h-4 mr-2" />
                  {currentUser.email}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={createTestUsers} 
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700"
                  size="lg"
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
                  Create Test Users
                </Button>
                
                <Button 
                  onClick={quickRegister} 
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
                  Quick Register New User
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {testCredentials.length > 0 && (
          <Card className="mb-6 border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <CheckCircle className="w-5 h-5" />
                Test User Credentials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testCredentials.map((cred, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <Badge className="mb-2">{cred.role}</Badge>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold">{cred.email}</span>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => copyToClipboard(cred.email)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-sm text-gray-600">{cred.password}</span>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => copyToClipboard(cred.password)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      {cred.password !== 'Use Forgot Password' && (
                        <Button 
                          onClick={() => quickLogin(cred.email, cred.password)}
                          disabled={loading}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Login
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription>
                  <p className="font-semibold mb-2">👆 Click "Create Test Users" to create test accounts</p>
                  <p className="text-sm">This will create 6 test users (passenger, driver, admin, etc.)</p>
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {results.map((result, index) => (
                  <Alert 
                    key={index}
                    className={
                      result.status === 'success' ? 'bg-green-50 border-green-200' :
                      result.status === 'error' ? 'bg-red-50 border-red-200' :
                      result.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                      result.status === 'running' ? 'bg-blue-50 border-blue-200' :
                      'bg-gray-50 border-gray-200'
                    }
                  >
                    <div className="flex items-start gap-3">
                      {result.status === 'success' && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />}
                      {result.status === 'error' && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
                      {result.status === 'running' && <Loader2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />}
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{result.test}</p>
                        <p className="text-sm text-gray-600">{result.message}</p>
                        
                        {result.details && (
                          <details className="mt-2">
                            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                              🔍 Show details
                            </summary>
                            <pre className="mt-2 p-3 bg-gray-900 text-green-400 text-xs rounded overflow-x-auto max-h-64">
                              {JSON.stringify(result.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Alert className="mt-6 bg-amber-50 border-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <AlertDescription>
            <p className="font-semibold text-amber-900 mb-2">📋 Steps:</p>
            <ol className="text-sm text-amber-800 space-y-1 list-decimal list-inside">
              <li>Click "Create Test Users" to generate test accounts</li>
              <li>Copy the credentials that appear</li>
              <li>Go back to the login page</li>
              <li>Use: <strong>test@joltcab.com</strong> / <strong>test123456</strong></li>
              <li>If it doesn't work, click "Quick Register New User" instead</li>
            </ol>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}