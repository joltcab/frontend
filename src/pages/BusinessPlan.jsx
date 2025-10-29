
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, Target, DollarSign, Users, Calendar,
  Rocket, MapPin, Award, Zap, BarChart3, PieChart,
  CheckCircle, AlertCircle, ArrowRight, Building2,
  Settings, Clock // Added Settings and Clock icons
} from "lucide-react";
import { motion } from "framer-motion";

export default function BusinessPlan() {
  const [selectedScenario, setSelectedScenario] = useState("conservative");

  return (
    <div className="space-y-6 p-6">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#15B46A] to-[#0F9456] rounded-3xl p-8 text-white"
      >
        <div className="flex items-center gap-4 mb-4">
          <Rocket className="w-12 h-12" />
          <div>
            <h1 className="text-3xl font-bold">JoltCab Business Plan</h1>
            <p className="text-white/90 text-lg">Complete Strategy & Financial Projections</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
            <DollarSign className="w-8 h-8 mb-2" />
            <p className="text-2xl font-bold">$270K</p>
            <p className="text-sm text-white/80">Year 1 Revenue (Conservative)</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
            <Users className="w-8 h-8 mb-2" />
            <p className="text-2xl font-bold">10,000</p>
            <p className="text-sm text-white/80">Monthly Rides Target</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
            <TrendingUp className="w-8 h-8 mb-2" />
            <p className="text-2xl font-bold">15%</p>
            <p className="text-sm text-white/80">Commission Rate</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
            <Calendar className="w-8 h-8 mb-2" />
            <p className="text-2xl font-bold">6 Months</p>
            <p className="text-sm text-white/80">To Break-even</p>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="executive" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="executive">Executive</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="gtm">Go-to-Market</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
        </TabsList>

        {/* EXECUTIVE SUMMARY */}
        <TabsContent value="executive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#15B46A]" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Mission */}
              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#15B46A]" />
                  Mission Statement
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border-l-4 border-[#15B46A]">
                  "Democratizar el transporte mediante transparencia, negociación justa y 
                  tecnología que beneficia tanto a conductores como pasajeros, 
                  enfocados en mercados emergentes de LATAM."
                </p>
              </div>

              {/* Problem */}
              <div>
                <h3 className="text-xl font-bold mb-3">💔 El Problema</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-2">Para Conductores:</h4>
                    <ul className="text-sm text-red-800 space-y-1">
                      <li>• Uber cobra 25-30% de comisión</li>
                      <li>• Sin control sobre tarifas</li>
                      <li>• Puede ser desactivado arbitrariamente</li>
                      <li>• Ganancias impredecibles</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-2">Para Pasajeros:</h4>
                    <ul className="text-sm text-red-800 space-y-1">
                      <li>• Surge pricing impredecible (3-5x)</li>
                      <li>• Sin transparencia en precios</li>
                      <li>• Rutas forzadas sin opción</li>
                      <li>• Tarifas ocultas</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Solution */}
              <div>
                <h3 className="text-xl font-bold mb-3">✨ Nuestra Solución</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                    <h4 className="font-semibold text-green-900 mb-2">Negociación</h4>
                    <p className="text-sm text-green-800">
                      Pasajero propone precio, conductor acepta o contraoferta.
                      Ambos ganan.
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                    <h4 className="font-semibold text-green-900 mb-2">15% Comisión</h4>
                    <p className="text-sm text-green-800">
                      Casi 50% menos que Uber. Conductores ganan más,
                      platform sigue siendo rentable.
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                    <h4 className="font-semibold text-green-900 mb-2">B2B Focus</h4>
                    <p className="text-sm text-green-800">
                      Corporate accounts para revenue predecible y
                      contratos largos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Competitive Advantage */}
              <div>
                <h3 className="text-xl font-bold mb-3">🏆 Ventaja Competitiva</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                    <Award className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Lower Commission (15% vs 25-30%)</h4>
                      <p className="text-sm text-blue-800">Conductores ganan 15-20% más por viaje</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                    <Award className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Price Negotiation</h4>
                      <p className="text-sm text-blue-800">Pasajeros evitan surge pricing, mayor satisfacción</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                    <Award className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900">B2B Revenue Streams</h4>
                      <p className="text-sm text-blue-800">Corporate, Hotels, Partners = 40% del revenue total</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                    <Award className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900">LATAM-First Design</h4>
                      <p className="text-sm text-blue-800">Cash, local partners, cultural fit</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div>
                <h3 className="text-xl font-bold mb-3">📊 Key Metrics (Year 1 Target)</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                    <p className="text-sm text-purple-700 font-semibold">Monthly Rides</p>
                    <p className="text-3xl font-bold text-purple-900">10,000</p>
                    <p className="text-xs text-purple-600">+50% MoM growth</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                    <p className="text-sm text-green-700 font-semibold">Revenue</p>
                    <p className="text-3xl font-bold text-green-900">$270K</p>
                    <p className="text-xs text-green-600">Annual (Conservative)</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                    <p className="text-sm text-blue-700 font-semibold">Active Users</p>
                    <p className="text-3xl font-bold text-blue-900">2,500</p>
                    <p className="text-xs text-blue-600">4 rides/user/month</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                    <p className="text-sm text-orange-700 font-semibold">Break-even</p>
                    <p className="text-3xl font-bold text-orange-900">Month 6</p>
                    <p className="text-xs text-orange-600">With $50K capital</p>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* MARKET ANALYSIS */}
        <TabsContent value="market" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-[#15B46A]" />
                Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* TAM SAM SOM */}
              <div>
                <h3 className="text-xl font-bold mb-4">🎯 Market Size (LATAM Focus)</h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-blue-500">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-blue-900 text-lg">TAM (Total Addressable Market)</h4>
                        <p className="text-sm text-blue-700">Todo el mercado de ride-hailing en LATAM</p>
                      </div>
                      <p className="text-3xl font-bold text-blue-900">$12B</p>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      400M población urbana × $30 gasto/año en transporte
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border-l-4 border-green-500">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-green-900 text-lg">SAM (Serviceable Addressable Market)</h4>
                        <p className="text-sm text-green-700">Ciudades tier 1-2 donde podemos operar (3 años)</p>
                      </div>
                      <p className="text-3xl font-bold text-green-900">$1.2B</p>
                    </div>
                    <p className="text-xs text-green-600 mt-2">
                      10% del TAM - 50 ciudades principales
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border-l-4 border-purple-500">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-purple-900 text-lg">SOM (Serviceable Obtainable Market)</h4>
                        <p className="text-sm text-purple-700">Lo que realistamente podemos capturar (Año 3)</p>
                      </div>
                      <p className="text-3xl font-bold text-purple-900">$24M</p>
                    </div>
                    <p className="text-xs text-purple-600 mt-2">
                      2% del SAM - Enfoque en 5 ciudades principales
                    </p>
                  </div>
                </div>
              </div>

              {/* Target Cities */}
              <div>
                <h3 className="text-xl font-bold mb-4">📍 Target Cities (Priority Order)</h3>
                <div className="space-y-3">
                  {[
                    { city: "Ciudad de México", pop: "9.2M", uber: "Alto", opportunity: "9/10", why: "Mercado más grande, alta adopción tech, mucho corporate" },
                    { city: "Guadalajara", pop: "5.3M", uber: "Medio", opportunity: "8/10", why: "Tech hub, menos competencia, growing corporate sector" },
                    { city: "Monterrey", pop: "5.3M", uber: "Alto", opportunity: "8/10", why: "Industrial, muchas empresas, alto poder adquisitivo" },
                    { city: "Bogotá", pop: "11M", uber: "Alto", opportunity: "7/10", why: "Mercado enorme, transporte caótico, oportunidad B2B" },
                    { city: "Santiago", pop: "6.9M", uber: "Alto", opportunity: "7/10", why: "Economía fuerte, alto uso de apps, regulatory favorable" },
                  ].map((city, idx) => (
                    <div key={idx} className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-lg">{idx + 1}. {city.city}</h4>
                          <p className="text-sm text-gray-600">{city.pop} habitantes</p>
                        </div>
                        <Badge className="bg-[#15B46A]">{city.opportunity}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                        <div>
                          <span className="text-gray-600">Competencia Uber:</span>
                          <span className="ml-2 font-semibold">{city.uber}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 italic">{city.why}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competition */}
              <div>
                <h3 className="text-xl font-bold mb-4">🥊 Competitive Landscape</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Plataforma</th>
                        <th className="border p-2 text-left">Comisión</th>
                        <th className="border p-2 text-left">Surge Pricing</th>
                        <th className="border p-2 text-left">B2B</th>
                        <th className="border p-2 text-left">Negociación</th>
                        <th className="border p-2 text-left">Debilidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-2 font-semibold">Uber</td>
                        <td className="border p-2 text-red-600">25-30%</td>
                        <td className="border p-2 text-red-600">Sí (agresivo)</td>
                        <td className="border p-2 text-green-600">Sí (Uber for Business)</td>
                        <td className="border p-2 text-red-600">No</td>
                        <td className="border p-2 text-sm">Conductores insatisfechos, comisión alta</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border p-2 font-semibold">DiDi</td>
                        <td className="border p-2 text-orange-600">20-25%</td>
                        <td className="border p-2 text-green-600">Moderado</td>
                        <td className="border p-2 text-orange-600">Limitado</td>
                        <td className="border p-2 text-red-600">No</td>
                        <td className="border p-2 text-sm">Marca menos fuerte, problemas de seguridad</td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-semibold">Cabify</td>
                        <td className="border p-2 text-orange-600">20-25%</td>
                        <td className="border p-2 text-green-600">No</td>
                        <td className="border p-2 text-green-600">Sí (enfoque B2B)</td>
                        <td className="border p-2 text-red-600">No</td>
                        <td className="border p-2 text-sm">Mercado limitado, menor supply de conductores</td>
                      </tr>
                      <tr className="bg-green-50 font-semibold">
                        <td className="border p-2">JoltCab (Nosotros)</td>
                        <td className="border p-2 text-green-600">15%</td>
                        <td className="border p-2 text-green-600">No (negociación)</td>
                        <td className="border p-2 text-green-600">Sí (multi-tier)</td>
                        <td className="border p-2 text-green-600">✅ SÍ</td>
                        <td className="border p-2 text-sm text-green-700">Nueva marca, necesita awareness</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Customer Segments */}
              <div>
                <h3 className="text-xl font-bold mb-4">👥 Customer Segments</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      segment: "Millennials/Gen Z (22-40 años)",
                      size: "40%",
                      value: "$$$",
                      characteristics: ["Tech-savvy", "Price-conscious", "Usan apps diario", "Valoran transparencia"],
                      strategy: "Marketing digital, referrals, gamification"
                    },
                    {
                      segment: "Corporate Employees",
                      size: "20%",
                      value: "$$$$$",
                      characteristics: ["Alto ticket average", "Uso recurrente", "B2B contracts", "Menos price-sensitive"],
                      strategy: "Direct sales, partnerships con empresas"
                    },
                    {
                      segment: "Hotel Guests",
                      size: "15%",
                      value: "$$$$",
                      characteristics: ["Turistas", "Alto ticket", "Confiabilidad importante", "Pagos garantizados"],
                      strategy: "Partnerships con hoteles, concierge integration"
                    },
                    {
                      segment: "General Public (35+ años)",
                      size: "25%",
                      value: "$$",
                      characteristics: ["Menos tech-savvy", "Valoran seguridad", "Cash payment", "Word of mouth"],
                      strategy: "Traditional marketing, driver referrals"
                    }
                  ].map((seg, idx) => (
                    <div key={idx} className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-lg">{seg.segment}</h4>
                        <Badge variant="outline">{seg.size}</Badge>
                      </div>
                      <div className="mb-3">
                        <span className="text-sm text-gray-600">Value: </span>
                        <span className="text-[#15B46A] font-bold">{seg.value}</span>
                      </div>
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Characteristics:</p>
                        <ul className="text-sm text-gray-600 space-y-0.5">
                          {seg.characteristics.map((char, i) => (
                            <li key={i}>• {char}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Strategy:</p>
                        <p className="text-sm text-gray-600">{seg.strategy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* GO-TO-MARKET STRATEGY */}
        <TabsContent value="gtm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-[#15B46A]" />
                Go-to-Market Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Phase 1 */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-2xl font-bold mb-4 text-blue-900">🚀 Phase 1: MVP & Validation (Month 1-2)</h3>
                <p className="text-blue-800 mb-4 font-semibold">Goal: Validate product-market fit with 500 rides</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold mb-2 text-blue-900">📍 Geography:</h4>
                    <p className="text-sm text-blue-800 mb-2">
                      <span className="font-semibold">Target:</span> 1 colonia específica (ej: Polanco, CDMX)
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 100,000 habitantes aprox</li>
                      <li>• Alto poder adquisitivo</li>
                      <li>• Alta densidad de oficinas</li>
                      <li>• Área de 5km²</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2 text-blue-900">🎯 Strategy:</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg">
                        <p className="font-semibold text-sm mb-1">Supply (Conductores):</p>
                        <ul className="text-xs text-gray-700 space-y-0.5">
                          <li>✓ Partner con 1 fleet local (15-20 conductores)</li>
                          <li>✓ 0% comisión primeros 2 meses</li>
                          <li>✓ $500 USD bonus por completar 50 viajes</li>
                          <li>✓ Training presencial</li>
                        </ul>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="font-semibold text-sm mb-1">Demand (Pasajeros):</p>
                        <ul className="text-xs text-gray-700 space-y-0.5">
                          <li>✓ 100 early adopters (amigos, familia)</li>
                          <li>✓ 3 viajes gratis por usuario</li>
                          <li>✓ Volantes en oficinas</li>
                          <li>✓ WhatsApp groups locales</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2 text-blue-900">💰 Budget:</h4>
                    <div className="bg-white p-3 rounded-lg">
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Marketing: $2,000 (viajes gratis, volantes)</li>
                        <li>• Driver bonuses: $10,000</li>
                        <li>• Operations: $1,000</li>
                        <li className="font-bold pt-2 border-t">Total: $13,000</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2 text-blue-900">📊 Success Metrics:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="bg-white p-2 rounded text-center">
                        <p className="text-2xl font-bold text-blue-900">500</p>
                        <p className="text-xs text-blue-700">Total Rides</p>
                      </div>
                      <div className="bg-white p-2 rounded text-center">
                        <p className="text-2xl font-bold text-blue-900">15</p>
                        <p className="text-xs text-blue-700">Active Drivers</p>
                      </div>
                      <div className="bg-white p-2 rounded text-center">
                        <p className="text-2xl font-bold text-blue-900">4.5+</p>
                        <p className="text-xs text-blue-700">Avg Rating</p>
                      </div>
                      <div className="bg-white p-2 rounded text-center">
                        <p className="text-2xl font-bold text-blue-900">30%</p>
                        <p className="text-xs text-blue-700">Repeat Rate</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-2xl font-bold mb-4 text-green-900">🎯 Phase 2: Soft Launch (Month 3-4)</h3>
                <p className="text-green-800 mb-4 font-semibold">Goal: Scale to 5,000 rides/month + 5 corporate accounts</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold mb-2 text-green-900">📍 Geography:</h4>
                    <p className="text-sm text-green-800">
                      Expand to 5 colonias adjacentes (50km²)
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2 text-green-900">🎯 Strategy:</h4>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg">
                        <p className="font-semibold text-sm mb-2">B2C (Consumer):</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>✓ Referral program: $5 for referrer + referee</li>
                          <li>✓ Instagram/TikTok ads targeting area</li>
                          <li>✓ Street teams en hora pico</li>
                          <li>✓ Partnership con 10 negocios locales</li>
                          <li>✓ Local influencers (micro: 10-50K followers)</li>
                        </ul>
                      </div>

                      <div className="bg-white p-3 rounded-lg">
                        <p className="font-semibold text-sm mb-2">B2B (Corporate):</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>✓ Direct outreach a 50 empresas en zona</li>
                          <li>✓ Ofrecer 1 mes gratis (50 viajes)</li>
                          <li>✓ Dedicated account manager</li>
                          <li>✓ Custom reporting dashboard</li>
                          <li>✓ Target: 5 accounts @ $2K/mes cada una</li>
                        </ul>
                      </div>

                      <div className="bg-white p-3 rounded-lg">
                        <p className="font-semibold text-sm mb-2">Supply (Drivers):</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>✓ Scale to 60 conductores</li>
                          <li>✓ Reducir comisión a 10% (sigue bajo vs Uber)</li>
                          <li>✓ Weekly driver meetups</li>
                          <li>✓ Leaderboard + bonuses top performers</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2 text-green-900">💰 Budget:</h4>
                    <div className="bg-white p-3 rounded-lg">
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Marketing Digital: $8,000</li>
                        <li>• Street Marketing: $3,000</li>
                        <li>• B2B Sales: $5,000 (salaries)</li>
                        <li>• Driver incentives: $7,000</li>
                        <li>• Operations: $2,000</li>
                        <li className="font-bold pt-2 border-t">Total: $25,000</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2 text-green-900">📊 Success Metrics:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="bg-white p-2 rounded text-center">
                        <p className="text-2xl font-bold text-green-900">5,000</p>
                        <p className="text-xs text-green-700">Rides/Month</p>
                      </div>
                      <div className="bg-white p-2 rounded text-center">
                        <p className="text-2xl font-bold text-green-900">5</p>
                        <p className="text-xs text-green-700">Corporate Accounts</p>
                      </div>
                      <div className="bg-white p-2 rounded text-center">
                        <p className="text-2xl font-bold text-green-900">$50K</p>
                        <p className="text-xs text-green-700">MRR</p>
                      </div>
                      <div className="bg-white p-2 rounded text-center">
                        <p className="text-2xl font-bold text-green-900">50%</p>
                        <p className="text-xs text-green-700">D7 Retention</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border-l-4 border-purple-500">
                <h3 className="text-2xl font-bold mb-4 text-purple-900">📈 Phase 3: Scale (Month 5-12)</h3>
                <p className="text-purple-800 mb-4 font-semibold">Goal: 30,000 rides/month + Launch 2nd city</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold mb-2 text-purple-900">📍 Geography:</h4>
                    <p className="text-sm text-purple-800 mb-2">
                      • Full CDMX coverage
                    </p>
                    <p className="text-sm text-purple-800">
                      • Launch Guadalajara (Month 9)
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2 text-purple-900">🎯 Strategy:</h4>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg">
                        <p className="font-semibold text-sm mb-2">Growth Channels:</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>✓ TV/Radio ads (local)</li>
                          <li>✓ Out-of-home (billboards en zonas key)</li>
                          <li>✓ Partnership con universidades</li>
                          <li>✓ Event sponsorships</li>
                          <li>✓ PR push (tech media, local news)</li>
                        </ul>
                      </div>

                      <div className="bg-white p-3 rounded-lg">
                        <p className="font-semibold text-sm mb-2">B2B Expansion:</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>✓ Target 50 corporate accounts total</li>
                          <li>✓ Add Hotels partnership program</li>
                          <li>✓ Partner program (fleet owners)</li>
                          <li>✓ Dispatcher network</li>
                        </ul>
                      </div>

                      <div className="bg-white p-3 rounded-lg">
                        <p className="font-semibold text-sm mb-2">Product:</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>✓ Launch native mobile apps (iOS + Android)</li>
                          <li>✓ Advanced features (scheduled rides, car rentals)</li>
                          <li>✓ Loyalty program</li>
                          <li>✓ Subscription model (monthly pass)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2 text-purple-900">💰 Monthly Budget:</h4>
                    <div className="bg-white p-3 rounded-lg">
                      <ul className="text-sm text-purple-800 space-y-1">
                        <li>• Marketing: $20,000</li>
                        <li>• Sales Team (5 people): $15,000</li>
                        <li>• Operations Team (3): $10,000</li>
                        <li>• Tech/Product: $8,000</li>
                        <li>• Driver incentives: $10,000</li>
                        <li className="font-bold pt-2 border-t">Total: $63,000/mo</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2 text-purple-900">📊 Success Metrics (Month 12):</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="bg-white p-2 rounded text-center">
                        <p className="text-2xl font-bold text-purple-900">30K</p>
                        <p className="text-xs text-purple-700">Rides/Month</p>
                      </div>
                      <div className="bg-white p-2 rounded text-center">
                        <p className="text-2xl font-bold text-purple-900">$270K</p>
                        <p className="text-xs text-purple-700">Annual Revenue</p>
                      </div>
                      <div className="bg-white p-2 rounded text-center">
                        <p className="text-2xl font-bold text-purple-900">2</p>
                        <p className="text-xs text-purple-700">Cities</p>
                      </div>
                      <div className="bg-white p-2 rounded text-center">
                        <p className="text-2xl font-bold text-purple-900">50</p>
                        <p className="text-xs text-purple-700">Corporate Accounts</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marketing Tactics */}
              <div>
                <h3 className="text-xl font-bold mb-4">📣 Marketing Tactics Detalladas</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  
                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#15B46A]" />
                      Digital Marketing
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="font-semibold">Instagram/Facebook Ads:</p>
                        <ul className="text-xs text-gray-700 ml-4">
                          <li>• Targeting: 22-45 años, zona específica</li>
                          <li>• Budget: $50/día</li>
                          <li>• CTA: "Primer viaje gratis"</li>
                          <li>• Expected CAC: $5-8</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold">Google Ads:</p>
                        <ul className="text-xs text-gray-700 ml-4">
                          <li>• Keywords: "taxi cdmx", "uber alternativa"</li>
                          <li>• Budget: $30/día</li>
                          <li>• Landing page optimizada</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold">TikTok:</p>
                        <ul className="text-xs text-gray-700 ml-4">
                          <li>• Organic content (drivers, passengers)</li>
                          <li>• Challenges (#JoltCabChallenge)</li>
                          <li>• Influencer collabs</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#15B46A]" />
                      Guerrilla Marketing
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="font-semibold">Street Teams:</p>
                        <ul className="text-xs text-gray-700 ml-4">
                          <li>• 5am-9am: Estaciones de metro</li>
                          <li>• 12pm-2pm: Zonas de oficinas</li>
                          <li>• Repartir códigos QR para descuento</li>
                          <li>• Cost: $500/día (10 promotores)</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold">Local Partnerships:</p>
                        <ul className="text-xs text-gray-700 ml-4">
                          <li>• Cafeterías: Flyers en mesas</li>
                          <li>• Gyms: Patrocinio eventos</li>
                          <li>• Restaurants: Cross-promotion</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold">Events:</p>
                        <ul className="text-xs text-gray-700 ml-4">
                          <li>• Pop-up stands en eventos</li>
                          <li>• Sponsorship local events</li>
                          <li>• Free rides durante eventos</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-[#15B46A]" />
                      B2B Sales Strategy
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="font-semibold">Outreach:</p>
                        <ul className="text-xs text-gray-700 ml-4">
                          <li>• LinkedIn prospecting</li>
                          <li>• Cold email campaigns</li>
                          <li>• Referrals from existing clients</li>
                          <li>• Networking events</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold">Pitch:</p>
                        <ul className="text-xs text-gray-700 ml-4">
                          <li>• ROI calculator (vs taxis/Uber)</li>
                          <li>• Case studies</li>
                          <li>• Free trial (50 rides)</li>
                          <li>• Custom dashboard demo</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold">Closing:</p>
                        <ul className="text-xs text-gray-700 ml-4">
                          <li>• Dedicated account manager</li>
                          <li>• Monthly QBRs</li>
                          <li>• Custom billing/reporting</li>
                          <li>• Flexible contracts</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#15B46A]" />
                      Referral Program
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="font-semibold">Passenger Referral:</p>
                        <ul className="text-xs text-gray-700 ml-4">
                          <li>• $5 para quien refiere</li>
                          <li>• $5 para nuevo usuario</li>
                          <li>• Unlimited referrals</li>
                          <li>• Tracking automático</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold">Driver Referral:</p>
                        <ul className="text-xs text-gray-700 ml-4">
                          <li>• $50 por nuevo conductor</li>
                          <li>• Bonus cuando completa 50 viajes</li>
                          <li>• Leaderboard mensual</li>
                          <li>• Top 3: Bonus extra</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold">Corporate Referral:</p>
                        <ul className="text-xs text-gray-700 ml-4">
                          <li>• 1 mes gratis por referencia</li>
                          <li>• Partnership program</li>
                          <li>• Co-marketing opportunities</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* FINANCIALS */}
        <TabsContent value="financials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#15B46A]" />
                Financial Projections
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Scenario Selector */}
              <div className="flex gap-4 mb-6">
                <Button
                  variant={selectedScenario === "conservative" ? "default" : "outline"}
                  onClick={() => setSelectedScenario("conservative")}
                  className={selectedScenario === "conservative" ? "bg-[#15B46A]" : ""}
                >
                  Conservative
                </Button>
                <Button
                  variant={selectedScenario === "moderate" ? "default" : "outline"}
                  onClick={() => setSelectedScenario("moderate")}
                  className={selectedScenario === "moderate" ? "bg-[#15B46A]" : ""}
                >
                  Moderate
                </Button>
                <Button
                  variant={selectedScenario === "optimistic" ? "default" : "outline"}
                  onClick={() => setSelectedScenario("optimistic")}
                  className={selectedScenario === "optimistic" ? "bg-[#15B46A]" : ""}
                >
                  Optimistic
                </Button>
              </div>

              {/* Year 1 Projections */}
              <div>
                <h3 className="text-xl font-bold mb-4">📊 Year 1 Financial Projections</h3>
                
                {selectedScenario === "conservative" && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-bold text-lg mb-2 text-blue-900">Conservative Scenario</h4>
                      <p className="text-sm text-blue-700 mb-3">
                        Slower growth, focus on profitability, single city
                      </p>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Metric</th>
                              <th className="text-right p-2">Q1</th>
                              <th className="text-right p-2">Q2</th>
                              <th className="text-right p-2">Q3</th>
                              <th className="text-right p-2">Q4</th>
                              <th className="text-right p-2 font-bold">Year 1</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="p-2">Rides/Month</td>
                              <td className="text-right p-2">500</td>
                              <td className="text-right p-2">2,500</td>
                              <td className="text-right p-2">7,000</td>
                              <td className="text-right p-2">10,000</td>
                              <td className="text-right p-2 font-bold">-</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Total Rides</td>
                              <td className="text-right p-2">1,500</td>
                              <td className="text-right p-2">7,500</td>
                              <td className="text-right p-2">21,000</td>
                              <td className="text-right p-2">30,000</td>
                              <td className="text-right p-2 font-bold">60,000</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Avg Fare</td>
                              <td className="text-right p-2">$15</td>
                              <td className="text-right p-2">$15</td>
                              <td className="text-right p-2">$15</td>
                              <td className="text-right p-2">$15</td>
                              <td className="text-right p-2 font-bold">$15</td>
                            </tr>
                            <tr className="border-b bg-green-50">
                              <td className="p-2 font-semibold">Revenue (15%)</td>
                              <td className="text-right p-2">$3,375</td>
                              <td className="text-right p-2">$16,875</td>
                              <td className="text-right p-2">$47,250</td>
                              <td className="text-right p-2">$67,500</td>
                              <td className="text-right p-2 font-bold">$135,000</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">B2B Revenue</td>
                              <td className="text-right p-2">$0</td>
                              <td className="text-right p-2">$10,000</td>
                              <td className="text-right p-2">$40,000</td>
                              <td className="text-right p-2">$85,000</td>
                              <td className="text-right p-2 font-bold">$135,000</td>
                            </tr>
                            <tr className="border-b bg-green-100">
                              <td className="p-2 font-bold">Total Revenue</td>
                              <td className="text-right p-2">$3,375</td>
                              <td className="text-right p-2">$26,875</td>
                              <td className="text-right p-2">$87,250</td>
                              <td className="text-right p-2">$152,500</td>
                              <td className="text-right p-2 font-bold text-green-900">$270,000</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Marketing</td>
                              <td className="text-right p-2">$13,000</td>
                              <td className="text-right p-2">$25,000</td>
                              <td className="text-right p-2">$40,000</td>
                              <td className="text-right p-2">$42,000</td>
                              <td className="text-right p-2 font-bold">$120,000</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Operations</td>
                              <td className="text-right p-2">$1,000</td>
                              <td className="text-right p-2">$2,000</td>
                              <td className="text-right p-2">$5,000</td>
                              <td className="text-right p-2">$7,000</td>
                              <td className="text-right p-2 font-bold">$15,000</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Tech/Infrastructure</td>
                              <td className="text-right p-2">$1,500</td>
                              <td className="text-right p-2">$1,500</td>
                              <td className="text-right p-2">$1,500</td>
                              <td className="text-right p-2">$1,500</td>
                              <td className="text-right p-2 font-bold">$6,000</td>
                            </tr>
                            <tr className="border-b bg-red-50">
                              <td className="p-2 font-bold">Total Costs</td>
                              <td className="text-right p-2">$15,500</td>
                              <td className="text-right p-2">$28,500</td>
                              <td className="text-right p-2">$46,500</td>
                              <td className="text-right p-2">$50,500</td>
                              <td className="text-right p-2 font-bold text-red-900">$141,000</td>
                            </tr>
                            <tr className="bg-yellow-50 font-bold">
                              <td className="p-2">Net Profit/Loss</td>
                              <td className="text-right p-2 text-red-600">-$12,125</td>
                              <td className="text-right p-2 text-red-600">-$1,625</td>
                              <td className="text-right p-2 text-green-600">+$40,750</td>
                              <td className="text-right p-2 text-green-600">+$102,000</td>
                              <td className="text-right p-2 font-bold text-green-600">+$129,000</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 grid md:grid-cols-3 gap-3">
                        <div className="bg-white p-3 rounded">
                          <p className="text-xs text-gray-600">Break-even Month</p>
                          <p className="text-2xl font-bold text-green-600">Month 6</p>
                        </div>
                        <div className="bg-white p-3 rounded">
                          <p className="text-xs text-gray-600">ROI (with $50K investment)</p>
                          <p className="text-2xl font-bold text-green-600">258%</p>
                        </div>
                        <div className="bg-white p-3 rounded">
                          <p className="text-xs text-gray-600">Profit Margin</p>
                          <p className="text-2xl font-bold text-green-600">48%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedScenario === "moderate" && (
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-bold text-lg mb-2 text-green-900">Moderate Scenario</h4>
                      <p className="text-sm text-green-700 mb-3">
                        Healthy growth, expanding to 2 cities, strong B2B
                      </p>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Metric</th>
                              <th className="text-right p-2">Q1</th>
                              <th className="text-right p-2">Q2</th>
                              <th className="text-right p-2">Q3</th>
                              <th className="text-right p-2">Q4</th>
                              <th className="text-right p-2 font-bold">Year 1</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="p-2">Rides/Month</td>
                              <td className="text-right p-2">1,000</td>
                              <td className="text-right p-2">5,000</td>
                              <td className="text-right p-2">15,000</td>
                              <td className="text-right p-2">30,000</td>
                              <td className="text-right p-2 font-bold">-</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Total Rides</td>
                              <td className="text-right p-2">3,000</td>
                              <td className="text-right p-2">15,000</td>
                              <td className="text-right p-2">45,000</td>
                              <td className="text-right p-2">90,000</td>
                              <td className="text-right p-2 font-bold">153,000</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Avg Fare</td>
                              <td className="text-right p-2">$15</td>
                              <td className="text-right p-2">$16</td>
                              <td className="text-right p-2">$17</td>
                              <td className="text-right p-2">$17</td>
                              <td className="text-right p-2 font-bold">$16.5</td>
                            </tr>
                            <tr className="border-b bg-green-50">
                              <td className="p-2 font-semibold">B2C Revenue</td>
                              <td className="text-right p-2">$6,750</td>
                              <td className="text-right p-2">$36,000</td>
                              <td className="text-right p-2">$115,000</td>
                              <td className="text-right p-2">$230,000</td>
                              <td className="text-right p-2 font-bold">$387,750</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">B2B Revenue</td>
                              <td className="text-right p-2">$5,000</td>
                              <td className="text-right p-2">$30,000</td>
                              <td className="text-right p-2">$90,000</td>
                              <td className="text-right p-2">$175,000</td>
                              <td className="text-right p-2 font-bold">$300,000</td>
                            </tr>
                            <tr className="border-b bg-green-100">
                              <td className="p-2 font-bold">Total Revenue</td>
                              <td className="text-right p-2">$11,750</td>
                              <td className="text-right p-2">$66,000</td>
                              <td className="text-right p-2">$205,000</td>
                              <td className="text-right p-2">$405,000</td>
                              <td className="text-right p-2 font-bold text-green-900">$687,750</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Marketing</td>
                              <td className="text-right p-2">$20,000</td>
                              <td className="text-right p-2">$40,000</td>
                              <td className="text-right p-2">$80,000</td>
                              <td className="text-right p-2">$100,000</td>
                              <td className="text-right p-2 font-bold">$240,000</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Team (Sales+Ops)</td>
                              <td className="text-right p-2">$10,000</td>
                              <td className="text-right p-2">$25,000</td>
                              <td className="text-right p-2">$60,000</td>
                              <td className="text-right p-2">$75,000</td>
                              <td className="text-right p-2 font-bold">$170,000</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Tech/Infrastructure</td>
                              <td className="text-right p-2">$2,000</td>
                              <td className="text-right p-2">$3,000</td>
                              <td className="text-right p-2">$4,000</td>
                              <td className="text-right p-2">$6,000</td>
                              <td className="text-right p-2 font-bold">$15,000</td>
                            </tr>
                            <tr className="border-b bg-red-50">
                              <td className="p-2 font-bold">Total Costs</td>
                              <td className="text-right p-2">$32,000</td>
                              <td className="text-right p-2">$68,000</td>
                              <td className="text-right p-2">$144,000</td>
                              <td className="text-right p-2">$181,000</td>
                              <td className="text-right p-2 font-bold text-red-900">$425,000</td>
                            </tr>
                            <tr className="bg-yellow-50 font-bold">
                              <td className="p-2">Net Profit/Loss</td>
                              <td className="text-right p-2 text-red-600">-$20,250</td>
                              <td className="text-right p-2 text-red-600">-$2,000</td>
                              <td className="text-right p-2 text-green-600">+$61,000</td>
                              <td className="text-right p-2 text-green-600">+$224,000</td>
                              <td className="text-right p-2 font-bold text-green-600">+$262,750</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 grid md:grid-cols-3 gap-3">
                        <div className="bg-white p-3 rounded">
                          <p className="text-xs text-gray-600">Break-even Month</p>
                          <p className="text-2xl font-bold text-green-600">Month 5</p>
                        </div>
                        <div className="bg-white p-3 rounded">
                          <p className="text-xs text-gray-600">ROI (with $100K investment)</p>
                          <p className="text-2xl font-bold text-green-600">263%</p>
                        </div>
                        <div className="bg-white p-3 rounded">
                          <p className="text-xs text-gray-600">Profit Margin</p>
                          <p className="text-2xl font-bold text-green-600">38%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedScenario === "optimistic" && (
                  <div className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-bold text-lg mb-2 text-purple-900">Optimistic Scenario</h4>
                      <p className="text-sm text-purple-700 mb-3">
                        Aggressive growth, viral adoption, 3 cities, dominant B2B
                      </p>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Metric</th>
                              <th className="text-right p-2">Q1</th>
                              <th className="text-right p-2">Q2</th>
                              <th className="text-right p-2">Q3</th>
                              <th className="text-right p-2">Q4</th>
                              <th className="text-right p-2 font-bold">Year 1</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="p-2">Rides/Month</td>
                              <td className="text-right p-2">2,000</td>
                              <td className="text-right p-2">10,000</td>
                              <td className="text-right p-2">35,000</td>
                              <td className="text-right p-2">80,000</td>
                              <td className="text-right p-2 font-bold">-</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Total Rides</td>
                              <td className="text-right p-2">6,000</td>
                              <td className="text-right p-2">30,000</td>
                              <td className="text-right p-2">105,000</td>
                              <td className="text-right p-2">240,000</td>
                              <td className="text-right p-2 font-bold">381,000</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Avg Fare</td>
                              <td className="text-right p-2">$16</td>
                              <td className="text-right p-2">$17</td>
                              <td className="text-right p-2">$18</td>
                              <td className="text-right p-2">$18</td>
                              <td className="text-right p-2 font-bold">$17.5</td>
                            </tr>
                            <tr className="border-b bg-purple-50">
                              <td className="p-2 font-semibold">B2C Revenue</td>
                              <td className="text-right p-2">$14,400</td>
                              <td className="text-right p-2">$76,500</td>
                              <td className="text-right p-2">$283,500</td>
                              <td className="text-right p-2">$648,000</td>
                              <td className="text-right p-2 font-bold">$1,022,400</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">B2B Revenue</td>
                              <td className="text-right p-2">$15,000</td>
                              <td className="text-right p-2">$75,000</td>
                              <td className="text-right p-2">$250,000</td>
                              <td className="text-right p-2">$510,000</td>
                              <td className="text-right p-2 font-bold">$850,000</td>
                            </tr>
                            <tr className="border-b bg-purple-100">
                              <td className="p-2 font-bold">Total Revenue</td>
                              <td className="text-right p-2">$29,400</td>
                              <td className="text-right p-2">$151,500</td>
                              <td className="text-right p-2">$533,500</td>
                              <td className="text-right p-2">$1,158,000</td>
                              <td className="text-right p-2 font-bold text-purple-900">$1,872,400</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Marketing</td>
                              <td className="text-right p-2">$40,000</td>
                              <td className="text-right p-2">$80,000</td>
                              <td className="text-right p-2">$150,000</td>
                              <td className="text-right p-2">$200,000</td>
                              <td className="text-right p-2 font-bold">$470,000</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Team (Sales+Ops+Tech)</td>
                              <td className="text-right p-2">$25,000</td>
                              <td className="text-right p-2">$50,000</td>
                              <td className="text-right p-2">$120,000</td>
                              <td className="text-right p-2">$180,000</td>
                              <td className="text-right p-2 font-bold">$375,000</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Tech/Infrastructure</td>
                              <td className="text-right p-2">$5,000</td>
                              <td className="text-right p-2">$8,000</td>
                              <td className="text-right p-2">$12,000</td>
                              <td className="text-right p-2">$15,000</td>
                              <td className="text-right p-2 font-bold">$40,000</td>
                            </tr>
                            <tr className="border-b bg-red-50">
                              <td className="p-2 font-bold">Total Costs</td>
                              <td className="text-right p-2">$70,000</td>
                              <td className="text-right p-2">$138,000</td>
                              <td className="text-right p-2">$282,000</td>
                              <td className="text-right p-2">$395,000</td>
                              <td className="text-right p-2 font-bold text-red-900">$885,000</td>
                            </tr>
                            <tr className="bg-yellow-50 font-bold">
                              <td className="p-2">Net Profit/Loss</td>
                              <td className="text-right p-2 text-red-600">-$40,600</td>
                              <td className="text-right p-2 text-green-600">+$13,500</td>
                              <td className="text-right p-2 text-green-600">+$251,500</td>
                              <td className="text-right p-2 text-green-600">+$763,000</td>
                              <td className="text-right p-2 font-bold text-green-600">+$987,400</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 grid md:grid-cols-3 gap-3">
                        <div className="bg-white p-3 rounded">
                          <p className="text-xs text-gray-600">Break-even Month</p>
                          <p className="text-2xl font-bold text-green-600">Month 4</p>
                        </div>
                        <div className="bg-white p-3 rounded">
                          <p className="text-xs text-gray-600">ROI (with $150K investment)</p>
                          <p className="text-2xl font-bold text-green-600">658%</p>
                        </div>
                        <div className="bg-white p-3 rounded">
                          <p className="text-xs text-gray-600">Profit Margin</p>
                          <p className="text-2xl font-bold text-green-600">53%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Unit Economics */}
              <div>
                <h3 className="text-xl font-bold mb-4">💰 Unit Economics</h3>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold mb-3 text-green-900">Per Ride Economics:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between bg-white p-2 rounded">
                          <span>Average Fare:</span>
                          <span className="font-semibold">$15.00</span>
                        </div>
                        <div className="flex justify-between bg-white p-2 rounded">
                          <span>Driver Earnings (85%):</span>
                          <span className="text-gray-600">-$12.75</span>
                        </div>
                        <div className="flex justify-between bg-white p-2 rounded">
                          <span>JoltCab Commission (15%):</span>
                          <span className="font-semibold text-green-600">$2.25</span>
                        </div>
                        <div className="flex justify-between bg-white p-2 rounded">
                          <span>Payment Processing (2.9% + $0.30):</span>
                          <span className="text-red-600">-$0.74</span>
                        </div>
                        <div className="flex justify-between bg-green-200 p-2 rounded font-bold">
                          <span>Net Revenue per Ride:</span>
                          <span className="text-green-900">$1.51</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold mb-3 text-green-900">Customer Acquisition:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between bg-white p-2 rounded">
                          <span>CAC (Passenger):</span>
                          <span className="font-semibold">$8.00</span>
                        </div>
                        <div className="flex justify-between bg-white p-2 rounded">
                          <span>Avg Rides/Month:</span>
                          <span className="font-semibold">4</span>
                        </div>
                        <div className="flex justify-between bg-white p-2 rounded">
                          <span>Revenue/Passenger/Month:</span>
                          <span className="font-semibold text-green-600">$6.04</span>
                        </div>
                        <div className="flex justify-between bg-white p-2 rounded">
                          <span>Payback Period:</span>
                          <span className="font-semibold">1.3 months</span>
                        </div>
                        <div className="flex justify-between bg-green-200 p-2 rounded font-bold">
                          <span>LTV (12 months):</span>
                          <span className="text-green-900">$72.48</span>
                        </div>
                        <div className="flex justify-between bg-green-300 p-2 rounded font-bold">
                          <span>LTV:CAC Ratio:</span>
                          <span className="text-green-900">9.1x</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Funding Requirements */}
              <div>
                <h3 className="text-xl font-bold mb-4">💵 Funding Requirements & Use of Funds</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  
                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-bold text-lg mb-3 text-blue-900">Bootstrap ($50K)</h4>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span>Marketing:</span>
                        <span>$25K (50%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Operations:</span>
                        <span>$10K (20%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tech:</span>
                        <span>$8K (16%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Legal/Admin:</span>
                        <span>$5K (10%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Buffer:</span>
                        <span>$2K (4%)</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 italic">
                      Conservative path, 1 city, slower growth
                    </p>
                    <Badge className="mt-2 bg-blue-500">6-8 months to profitability</Badge>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-bold text-lg mb-3 text-green-900">Seed Round ($150K)</h4>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span>Marketing:</span>
                        <span>$60K (40%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Team:</span>
                        <span>$45K (30%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tech/Product:</span>
                        <span>$25K (17%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Operations:</span>
                        <span>$15K (10%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Legal/Buffer:</span>
                        <span>$5K (3%)</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 italic">
                      Moderate growth, 2 cities, native apps
                    </p>
                    <Badge className="mt-2 bg-green-500">4-5 months to profitability</Badge>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-bold text-lg mb-3 text-purple-900">Series A ($500K+)</h4>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span>Marketing:</span>
                        <span>$200K (40%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Team:</span>
                        <span>$150K (30%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tech/Product:</span>
                        <span>$75K (15%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expansion:</span>
                        <span>$50K (10%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Buffer:</span>
                        <span>$25K (5%)</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 italic">
                      Aggressive expansion, 5+ cities, market dominance
                    </p>
                    <Badge className="mt-2 bg-purple-500">3-4 months to profitability</Badge>
                  </div>

                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* OPERATIONS */}
        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#15B46A]" />
                Operations Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Team Structure */}
              <div>
                <h3 className="text-xl font-bold mb-4">👥 Team Structure</h3>
                
                <div className="space-y-4">
                  {/* Year 1 Team */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-bold text-lg mb-3 text-blue-900">Year 1 Team (Lean Startup)</h4>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-bold mb-2">Co-Founders (2)</h5>
                        <ul className="text-sm space-y-1 text-gray-700">
                          <li>• CEO (Operations, Business Dev)</li>
                          <li>• CTO (Tech, Product)</li>
                          <li>• Salary: Equity only (first 6 months)</li>
                          <li>• Then: $3K/month each</li>
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-bold mb-2">Contractors (Part-time)</h5>
                        <ul className="text-sm space-y-1 text-gray-700">
                          <li>• Customer Support (1) - $800/month</li>
                          <li>• Marketing Manager (1) - $1,200/month</li>
                          <li>• B2B Sales (1) - $1,500/month + commission</li>
                          <li>• Total: $3,500/month</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded">
                      <p className="text-sm font-semibold text-blue-900">Total Team Cost: ~$10K/month (after month 6)</p>
                    </div>
                  </div>

                  {/* Year 2 Team */}
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-bold text-lg mb-3 text-green-900">Year 2 Team (Growth Phase)</h4>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-bold mb-2">Leadership (3)</h5>
                        <ul className="text-sm space-y-1 text-gray-700">
                          <li>• CEO</li>
                          <li>• CTO</li>
                          <li>• COO (Operations)</li>
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-bold mb-2">Operations (5)</h5>
                        <ul className="text-sm space-y-1 text-gray-700">
                          <li>• Ops Manager</li>
                          <li>• Support Team (2)</li>
                          <li>• Driver Relations (2)</li>
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-bold mb-2">Growth (4)</h5>
                        <ul className="text-sm space-y-1 text-gray-700">
                          <li>• Marketing Manager</li>
                          <li>• B2B Sales (2)</li>
                          <li>• Product Manager</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-green-50 rounded">
                      <p className="text-sm font-semibold text-green-900">Total Team: 12 people | Cost: ~$40K/month</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Operations */}
              <div>
                <h3 className="text-xl font-bold mb-4">🔄 Daily Operations Flow</h3>
                
                <div className="space-y-3">
                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#15B46A]" />
                      Morning (6am - 12pm)
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>✓ Monitor overnight rides & issues</li>
                      <li>✓ Check driver availability & onboarding queue</li>
                      <li>✓ Review key metrics dashboard</li>
                      <li>✓ Respond to urgent support tickets</li>
                      <li>✓ Peak hour support (7-9am)</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#15B46A]" />
                      Afternoon (12pm - 6pm)
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>✓ B2B sales calls & meetings</li>
                      <li>✓ Driver verification & approvals</li>
                      <li>✓ Marketing campaign execution</li>
                      <li>✓ Product development sprint</li>
                      <li>✓ Team standup meeting</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#15B46A]" />
                      Evening (6pm - 12am)
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>✓ Peak hour support (6-9pm)</li>
                      <li>✓ Monitor live rides</li>
                      <li>✓ Process driver payouts</li>
                      <li>✓ Daily report generation</li>
                      <li>✓ Emergency on-call available</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Key Processes */}
              <div>
                <h3 className="text-xl font-bold mb-4">⚙️ Key Operational Processes</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-bold mb-3 text-[#15B46A]">Driver Onboarding (48hrs)</h4>
                    <ol className="text-sm text-gray-700 space-y-2">
                      <li className="flex gap-2">
                        <span className="font-bold">1.</span>
                        <div>
                          <p className="font-semibold">Application Submit</p>
                          <p className="text-xs text-gray-600">Driver fills form online</p>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">2.</span>
                        <div>
                          <p className="font-semibold">Document Upload</p>
                          <p className="text-xs text-gray-600">License, insurance, registration</p>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">3.</span>
                        <div>
                          <p className="font-semibold">AI Verification</p>
                          <p className="text-xs text-gray-600">Automated document check (2 hrs)</p>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">4.</span>
                        <div>
                          <p className="font-semibold">Background Check</p>
                          <p className="text-xs text-gray-600">Criminal & driving history (24 hrs)</p>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">5.</span>
                        <div>
                          <p className="font-semibold">Manual Review</p>
                          <p className="text-xs text-gray-600">Admin final approval (4 hrs)</p>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">6.</span>
                        <div>
                          <p className="font-semibold">Training & Activation</p>
                          <p className="text-xs text-gray-600">Video training + first ride bonus</p>
                        </div>
                      </li>
                    </ol>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-bold mb-3 text-[#15B46A]">Issue Resolution SLA</h4>
                    <div className="space-y-3">
                      <div className="bg-red-50 p-3 rounded">
                        <p className="font-semibold text-red-900 mb-1">P0 - Critical (15 min)</p>
                        <ul className="text-xs text-red-800 space-y-0.5">
                          <li>• Safety incident</li>
                          <li>• Payment failure</li>
                          <li>• System outage</li>
                        </ul>
                      </div>
                      <div className="bg-orange-50 p-3 rounded">
                        <p className="font-semibold text-orange-900 mb-1">P1 - High (1 hour)</p>
                        <ul className="text-xs text-orange-800 space-y-0.5">
                          <li>• Driver/passenger dispute</li>
                          <li>• Pricing error</li>
                          <li>• Account locked</li>
                        </ul>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded">
                        <p className="font-semibold text-yellow-900 mb-1">P2 - Medium (4 hours)</p>
                        <ul className="text-xs text-yellow-800 space-y-0.5">
                          <li>• App bug</li>
                          <li>• Refund request</li>
                          <li>• Feature request</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 p-3 rounded">
                        <p className="font-semibold text-green-900 mb-1">P3 - Low (24 hours)</p>
                        <ul className="text-xs text-green-800 space-y-0.5">
                          <li>• General inquiry</li>
                          <li>• Profile update</li>
                          <li>• Documentation</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-bold mb-3 text-[#15B46A]">Weekly Payout Process</h4>
                    <ol className="text-sm text-gray-700 space-y-2">
                      <li className="flex gap-2">
                        <span className="font-bold">Mon:</span>
                        <span>Calculate weekly earnings (automated)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">Tue:</span>
                        <span>Driver confirms bank details</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">Wed:</span>
                        <span>Admin reviews & approves batch</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">Thu:</span>
                        <span>Process transfers via Stripe</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">Fri:</span>
                        <span>Drivers receive funds (2-3 days)</span>
                      </li>
                    </ol>
                    <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                      <p className="font-semibold">Alternative: Instant Payout (0.5% fee)</p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-bold mb-3 text-[#15B46A]">Corporate Account Setup</h4>
                    <ol className="text-sm text-gray-700 space-y-2">
                      <li>1. Sales call & demo (1 hr)</li>
                      <li>2. Custom proposal & pricing</li>
                      <li>3. Contract negotiation (1-2 weeks)</li>
                      <li>4. Account setup & integration</li>
                      <li>5. Employee training session</li>
                      <li>6. Dedicated account manager assigned</li>
                      <li>7. Monthly QBR scheduled</li>
                    </ol>
                    <div className="mt-3 p-2 bg-purple-50 rounded text-xs">
                      <p className="font-semibold">Avg Deal Size: $2K-5K/month</p>
                      <p>Sales Cycle: 2-4 weeks</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech Infrastructure */}
              <div>
                <h3 className="text-xl font-bold mb-4">🖥️ Tech Infrastructure</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-bold mb-3">Core Stack</h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Frontend: React (Web) + React Native (Mobile)</p>
                          <p className="text-xs text-gray-600">Shared codebase, fast iteration</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Backend: Base44 + Deno Functions</p>
                          <p className="text-xs text-gray-600">Serverless, auto-scaling</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Database: PostgreSQL (Base44)</p>
                          <p className="text-xs text-gray-600">Managed, automatic backups</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Hosting: Vercel + Supabase</p>
                          <p className="text-xs text-gray-600">99.9% uptime SLA</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-bold mb-3">Third-Party Services</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span>Stripe (Payments)</span>
                        <Badge variant="outline">2.9% + $0.30</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Twilio (SMS)</span>
                        <Badge variant="outline">$0.0075/msg</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Google Maps API</span>
                        <Badge variant="outline">$200/mo</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Firebase (Push)</span>
                        <Badge variant="outline">Free tier</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Sendgrid (Email)</span>
                        <Badge variant="outline">$15/mo</Badge>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t font-semibold">
                        <span>Total Tech Cost:</span>
                        <span>~$500/mo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monitoring & Analytics */}
              <div>
                <h3 className="text-xl font-bold mb-4">📊 Key Metrics to Monitor Daily</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-blue-100">
                    <h4 className="font-bold mb-3 text-blue-900">Growth Metrics</h4>
                    <ul className="text-sm space-y-1 text-blue-800">
                      <li>• Total Rides (daily/weekly/monthly)</li>
                      <li>• New Users (passengers + drivers)</li>
                      <li>• Active Users (D1/D7/D30)</li>
                      <li>• Retention Rate</li>
                      <li>• Churn Rate</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-green-100">
                    <h4 className="font-bold mb-3 text-green-900">Financial Metrics</h4>
                    <ul className="text-sm space-y-1 text-green-800">
                      <li>• Revenue (B2C + B2B)</li>
                      <li>• GMV (Gross Merchandise Value)</li>
                      <li>• Take Rate (%)</li>
                      <li>• CAC (Customer Acquisition Cost)</li>
                      <li>• LTV (Lifetime Value)</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-purple-100">
                    <h4 className="font-bold mb-3 text-purple-900">Quality Metrics</h4>
                    <ul className="text-sm space-y-1 text-purple-800">
                      <li>• Avg Driver Rating</li>
                      <li>• Avg Passenger Rating</li>
                      <li>• Cancellation Rate</li>
                      <li>• ETA Accuracy</li>
                      <li>• Support Response Time</li>
                    </ul>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* ROADMAP */}
        <TabsContent value="roadmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#15B46A]" />
                Product Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Timeline Overview */}
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#15B46A] to-gray-300"></div>
                
                <div className="space-y-8">
                  {/* Q1 */}
                  <div className="relative pl-12">
                    <div className="absolute left-0 w-8 h-8 bg-[#15B46A] rounded-full flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-blue-500">
                      <h3 className="text-xl font-bold mb-2 text-blue-900">Q1: MVP & Launch</h3>
                      <p className="text-sm text-blue-700 mb-4">Jan-Mar | Focus: Build & Validate</p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-blue-900">Core Features</h4>
                          <ul className="text-sm space-y-1 text-blue-800">
                            <li>✓ Ride booking (passenger)</li>
                            <li>✓ Ride acceptance (driver)</li>
                            <li>✓ Real-time tracking</li>
                            <li>✓ In-app payments (Stripe)</li>
                            <li>✓ Ratings & reviews</li>
                            <li>✓ Basic admin panel</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-blue-900">Tech Milestones</h4>
                          <ul className="text-sm space-y-1 text-blue-800">
                            <li>✓ Web app (PWA)</li>
                            <li>✓ Driver & passenger portals</li>
                            <li>✓ Payment integration</li>
                            <li>✓ Maps & navigation</li>
                            <li>✓ SMS notifications</li>
                            <li>✓ Basic analytics</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-blue-50 rounded">
                        <p className="text-sm font-semibold text-blue-900">Goal: 500 rides | 50 active drivers | 200 users</p>
                      </div>
                    </div>
                  </div>

                  {/* Q2 */}
                  <div className="relative pl-12">
                    <div className="absolute left-0 w-8 h-8 bg-[#15B46A] rounded-full flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border-l-4 border-green-500">
                      <h3 className="text-xl font-bold mb-2 text-green-900">Q2: Growth & Iteration</h3>
                      <p className="text-sm text-green-700 mb-4">Apr-Jun | Focus: Scale & Optimize</p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-green-900">New Features</h4>
                          <ul className="text-sm space-y-1 text-green-800">
                            <li>✓ Price negotiation system</li>
                            <li>✓ Scheduled rides</li>
                            <li>✓ Corporate accounts (B2B)</li>
                            <li>✓ Wallet & credits</li>
                            <li>✓ Referral program</li>
                            <li>✓ Driver earnings dashboard</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-green-900">Tech Improvements</h4>
                          <ul className="text-sm space-y-1 text-green-800">
                            <li>✓ Native mobile apps (iOS/Android)</li>
                            <li>✓ Push notifications</li>
                            <li>✓ Advanced analytics</li>
                            <li>✓ AI document verification</li>
                            <li>✓ Background checks integration</li>
                            <li>✓ Performance optimization</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-green-50 rounded">
                        <p className="text-sm font-semibold text-green-900">Goal: 5,000 rides/mo | 5 corporate accounts | Break-even</p>
                      </div>
                    </div>
                  </div>

                  {/* Q3 */}
                  <div className="relative pl-12">
                    <div className="absolute left-0 w-8 h-8 bg-[#15B46A] rounded-full flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border-l-4 border-purple-500">
                      <h3 className="text-xl font-bold mb-2 text-purple-900">Q3: Expansion & New Revenue</h3>
                      <p className="text-sm text-purple-700 mb-4">Jul-Sep | Focus: Geographic & Product Expansion</p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-purple-900">New Features</h4>
                          <ul className="text-sm space-y-1 text-purple-800">
                            <li>✓ Hotel partnerships</li>
                            <li>✓ Dispatcher accounts</li>
                            <li>✓ Car rental packages</li>
                            <li>✓ Zone pricing</li>
                            <li>✓ Airport service</li>
                            <li>✓ Multi-city support</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-purple-900">Geographic</h4>
                          <ul className="text-sm space-y-1 text-purple-800">
                            <li>✓ Launch 2nd city (Guadalajara)</li>
                            <li>✓ Full CDMX coverage</li>
                            <li>✓ Inter-city trips</li>
                            <li>✓ Regional partnerships</li>
                            <li>✓ Multi-language support</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-purple-50 rounded">
                        <p className="text-sm font-semibold text-purple-900">Goal: 20,000 rides/mo | 20 corporate accounts | $150K revenue</p>
                      </div>
                    </div>
                  </div>

                  {/* Q4 */}
                  <div className="relative pl-12">
                    <div className="absolute left-0 w-8 h-8 bg-[#15B46A] rounded-full flex items-center justify-center text-white font-bold">
                      4
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg border-l-4 border-orange-500">
                      <h3 className="text-xl font-bold mb-2 text-orange-900">Q4: Scale & Profitability</h3>
                      <p className="text-sm text-orange-700 mb-4">Oct-Dec | Focus: Market Dominance</p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-orange-900">Advanced Features</h4>
                          <ul className="text-sm space-y-1 text-orange-800">
                            <li>✓ AI dynamic pricing</li>
                            <li>✓ AI driver matching</li>
                            <li>✓ Loyalty program</li>
                            <li>✓ Subscription model</li>
                            <li>✓ Advanced analytics</li>
                            <li>✓ WhatsApp booking</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-orange-900">Business</h4>
                          <ul className="text-sm space-y-1 text-orange-800">
                            <li>✓ Partner program (fleets)</li>
                            <li>✓ 50+ corporate accounts</li>
                            <li>✓ 3 cities operational</li>
                            <li>✓ Profitability achieved</li>
                            <li>✓ Series A preparation</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-orange-50 rounded">
                        <p className="text-sm font-semibold text-orange-900">Goal: 30,000 rides/mo | 50 corporate accounts | $270K annual revenue</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Priority Matrix */}
              <div>
                <h3 className="text-xl font-bold mb-4">🎯 Feature Priority Matrix</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border-4 border-red-500 rounded-lg p-4 bg-red-50">
                    <h4 className="font-bold mb-3 text-red-900">🔥 Critical (Do First)</h4>
                    <ul className="text-sm space-y-1 text-red-800">
                      <li>• Core booking flow</li>
                      <li>• Payment processing</li>
                      <li>• Real-time tracking</li>
                      <li>• Basic safety features</li>
                      <li>• Driver verification</li>
                    </ul>
                  </div>

                  <div className="border-4 border-orange-500 rounded-lg p-4 bg-orange-50">
                    <h4 className="font-bold mb-3 text-orange-900">⚡ High Priority (Do Soon)</h4>
                    <ul className="text-sm space-y-1 text-orange-800">
                      <li>• Price negotiation</li>
                      <li>• Corporate accounts</li>
                      <li>• Mobile apps</li>
                      <li>• Scheduled rides</li>
                      <li>• Referral program</li>
                    </ul>
                  </div>

                  <div className="border-4 border-blue-500 rounded-lg p-4 bg-blue-50">
                    <h4 className="font-bold mb-3 text-blue-900">📝 Medium Priority (Later)</h4>
                    <ul className="text-sm space-y-1 text-blue-800">
                      <li>• Car rental packages</li>
                      <li>• Zone pricing</li>
                      <li>• Hotel partnerships</li>
                      <li>• Multi-city support</li>
                      <li>• Advanced analytics</li>
                    </ul>
                  </div>

                  <div className="border-4 border-gray-500 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-bold mb-3 text-gray-900">💡 Nice to Have (Future)</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• AI chatbot</li>
                      <li>• Subscription model</li>
                      <li>• WhatsApp booking</li>
                      <li>• Loyalty tiers</li>
                      <li>• Carbon offset</li>
                    </ul>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* RISKS */}
        <TabsContent value="risks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#15B46A]" />
                Risks & Mitigation Strategies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Market Risks */}
              <div>
                <h3 className="text-xl font-bold mb-4">🌍 Market Risks</h3>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-red-900">Competition from Uber/DiDi</h4>
                        <p className="text-sm text-gray-700 mt-1">
                          Incumbents could lower prices or copy our features
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-semibold text-green-900 text-sm mb-1">Mitigation:</p>
                      <ul className="text-xs text-green-800 space-y-0.5">
                        <li>✓ Focus on niche (price-conscious, transparency)</li>
                        <li>✓ Build strong local partnerships (fleet owners)</li>
                        <li>✓ Superior driver economics (15% vs 30%)</li>
                        <li>✓ B2B focus (harder to replicate)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-red-900">Chicken & Egg Problem</h4>
                        <p className="text-sm text-gray-700 mt-1">
                          Need drivers to attract passengers, need passengers to attract drivers
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-semibold text-green-900 text-sm mb-1">Mitigation:</p>
                      <ul className="text-xs text-green-800 space-y-0.5">
                        <li>✓ Partner with existing fleet (20-30 drivers Day 1)</li>
                        <li>✓ Subsidize early rides ($3,000 budget for free rides)</li>
                        <li>✓ Geo-focus (1 small area first)</li>
                        <li>✓ Driver referral bonuses ($50 per new driver)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-orange-900">Regulatory Changes</h4>
                        <p className="text-sm text-gray-700 mt-1">
                          Government could impose new regulations or licenses
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-semibold text-green-900 text-sm mb-1">Mitigation:</p>
                      <ul className="text-xs text-green-800 space-y-0.5">
                        <li>✓ Legal consultation before launch</li>
                        <li>✓ Work with local taxi associations</li>
                        <li>✓ Lobby-friendly positioning (helping drivers)</li>
                        <li>✓ Flexible model (can pivot to dispatch if needed)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operational Risks */}
              <div>
                <h3 className="text-xl font-bold mb-4">⚙️ Operational Risks</h3>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-red-900">Safety Incidents</h4>
                        <p className="text-sm text-gray-700 mt-1">
                          Driver or passenger safety issues could damage reputation
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-semibold text-green-900 text-sm mb-1">Mitigation:</p>
                      <ul className="text-xs text-green-800 space-y-0.5">
                        <li>✓ Strict background checks (criminal + driving history)</li>
                        <li>✓ AI document verification</li>
                        <li>✓ Real-time ride monitoring</li>
                        <li>✓ SOS button + 24/7 support</li>
                        <li>✓ Insurance coverage ($1M liability)</li>
                        <li>✓ Share trip details with emergency contacts</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-orange-900">Payment Fraud</h4>
                        <p className="text-sm text-gray-700 mt-1">
                          Chargebacks, stolen cards, fake rides
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-semibold text-green-900 text-sm mb-1">Mitigation:</p>
                      <ul className="text-xs text-green-800 space-y-0.5">
                        <li>✓ Stripe fraud detection (built-in)</li>
                        <li>✓ 3D Secure for high-value transactions</li>
                        <li>✓ Driver GPS tracking (proof of service)</li>
                        <li>✓ Passenger verification (phone + email)</li>
                        <li>✓ ML fraud detection model</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-orange-900">Technical Downtime</h4>
                        <p className="text-sm text-gray-700 mt-1">
                          App crashes, server outages during peak hours
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-semibold text-green-900 text-sm mb-1">Mitigation:</p>
                      <ul className="text-xs text-green-800 space-y-0.5">
                        <li>✓ Use reliable infrastructure (Vercel + Supabase)</li>
                        <li>✓ 99.9% uptime SLA</li>
                        <li>✓ Auto-scaling (handles traffic spikes)</li>
                        <li>✓ Real-time monitoring (Sentry + Analytics)</li>
                        <li>✓ Fallback: WhatsApp booking during outages</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Risks */}
              <div>
                <h3 className="text-xl font-bold mb-4">💰 Financial Risks</h3>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-red-900">Running Out of Cash</h4>
                        <p className="text-sm text-gray-700 mt-1">
                          Burn rate too high, can't reach profitability
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-semibold text-green-900 text-sm mb-1">Mitigation:</p>
                      <ul className="text-xs text-green-800 space-y-0.5">
                        <li>✓ Conservative financial model (break-even Month 6)</li>
                        <li>✓ Low fixed costs (no office, contractors)</li>
                        <li>✓ B2B revenue (predictable, recurring)</li>
                        <li>✓ Flexible burn rate (can cut marketing if needed)</li>
                        <li>✓ Multiple funding options (angels, VCs, revenue)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-orange-900">Unit Economics Don't Work</h4>
                        <p className="text-sm text-gray-700 mt-1">
                          CAC too high, LTV too low, can't be profitable
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-semibold text-green-900 text-sm mb-1">Mitigation:</p>
                      <ul className="text-xs text-green-800 space-y-0.5">
                        <li>✓ Test pricing early (MVP phase)</li>
                        <li>✓ Multiple revenue streams (B2C + B2B)</li>
                        <li>✓ Low commission = high driver retention</li>
                        <li>✓ Referral program (organic growth)</li>
                        <li>✓ Can adjust commission if needed (15% → 18%)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-yellow-900">Pricing War with Uber</h4>
                        <p className="text-sm text-gray-700 mt-1">
                          Uber lowers prices, we can't compete
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-semibold text-green-900 text-sm mb-1">Mitigation:</p>
                      <ul className="text-xs text-green-800 space-y-0.5">
                        <li>✓ Don't compete on price alone</li>
                        <li>✓ Differentiate: transparency, negotiation</li>
                        <li>✓ Focus on niches (corporate, hotels)</li>
                        <li>✓ Build brand loyalty (better driver experience)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Risks */}
              <div>
                <h3 className="text-xl font-bold mb-4">👥 Team Risks</h3>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-red-900">Co-Founder Conflict</h4>
                        <p className="text-sm text-gray-700 mt-1">
                          Disagreements on strategy, equity, or direction
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-semibold text-green-900 text-sm mb-1">Mitigation:</p>
                      <ul className="text-xs text-green-800 space-y-0.5">
                        <li>✓ Clear roles & responsibilities from Day 1</li>
                        <li>✓ Vesting schedule (4 years, 1 year cliff)</li>
                        <li>✓ Written founders' agreement</li>
                        <li>✓ Regular check-ins & open communication</li>
                        <li>✓ Advisor/board for conflict resolution</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-orange-900">Can't Hire Fast Enough</h4>
                        <p className="text-sm text-gray-700 mt-1">
                          Growth outpaces hiring, quality suffers
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-semibold text-green-900 text-sm mb-1">Mitigation:</p>
                      <ul className="text-xs text-green-800 space-y-0.5">
                        <li>✓ Start with contractors (flexible)</li>
                        <li>✓ Automate operations where possible</li>
                        <li>✓ Build hiring pipeline early</li>
                        <li>✓ Partner with agencies for support/ops</li>
                        <li>✓ Strong onboarding process</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-yellow-900">Key Person Risk</h4>
                        <p className="text-sm text-gray-700 mt-1">
                          Founder gets sick, quits, or is unavailable
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-semibold text-green-900 text-sm mb-1">Mitigation:</p>
                      <ul className="text-xs text-green-800 space-y-0.5">
                        <li>✓ Document all processes & decisions</li>
                        <li>✓ Cross-training team members</li>
                        <li>✓ Build strong #2 in each department</li>
                        <li>✓ Key person insurance (if funded)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Summary Matrix */}
              <div>
                <h3 className="text-xl font-bold mb-4">📊 Risk Priority Matrix</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border-4 border-red-500 rounded-lg p-4 bg-red-50">
                    <h4 className="font-bold mb-3 text-red-900">🔴 High Impact + High Probability</h4>
                    <ul className="text-sm space-y-1 text-red-800">
                      <li>• Chicken & egg problem</li>
                      <li>• Running out of cash</li>
                      <li>• Competition from Uber</li>
                    </ul>
                    <p className="text-xs mt-2 font-semibold">Action: Address immediately</p>
                  </div>

                  <div className="border-4 border-orange-500 rounded-lg p-4 bg-orange-50">
                    <h4 className="font-bold mb-3 text-orange-900">🟠 High Impact + Low Probability</h4>
                    <ul className="text-sm space-y-1 text-orange-800">
                      <li>• Safety incident</li>
                      <li>• Regulatory shutdown</li>
                      <li>• Technical catastrophe</li>
                    </ul>
                    <p className="text-xs mt-2 font-semibold">Action: Prepare contingency</p>
                  </div>

                  <div className="border-4 border-yellow-500 rounded-lg p-4 bg-yellow-50">
                    <h4 className="font-bold mb-3 text-yellow-900">🟡 Low Impact + High Probability</h4>
                    <ul className="text-sm space-y-1 text-yellow-800">
                      <li>• Payment fraud (small scale)</li>
                      <li>• Driver churn</li>
                      <li>• Minor app bugs</li>
                    </ul>
                    <p className="text-xs mt-2 font-semibold">Action: Monitor & manage</p>
                  </div>

                  <div className="border-4 border-green-500 rounded-lg p-4 bg-green-50">
                    <h4 className="font-bold mb-3 text-green-900">🟢 Low Impact + Low Probability</h4>
                    <ul className="text-sm space-y-1 text-green-800">
                      <li>• Minor team conflicts</li>
                      <li>• Small technical issues</li>
                      <li>• Competitor minor feature</li>
                    </ul>
                    <p className="text-xs mt-2 font-semibold">Action: Low priority</p>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

    </div>
  );
}
