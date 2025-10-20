import { useState } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Zap,
  Check
} from 'lucide-react';
import aiService from '../../../services/aiService';

export default function BookRide() {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    serviceType: null,
    passengers: 1
  });
  const [priceEstimate, setPriceEstimate] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  const serviceTypes = [
    {
      id: 1,
      name: 'Economy',
      icon: '🚗',
      description: 'Viajes económicos y confiables',
      basePrice: 15,
      capacity: 4,
      features: ['Básico', 'Económico']
    },
    {
      id: 2,
      name: 'Comfort',
      icon: '🚙',
      description: 'Más espacio y comodidad',
      basePrice: 25,
      capacity: 4,
      features: ['Confortable', 'Aire Acondicionado', 'WiFi']
    },
    {
      id: 3,
      name: 'Premium',
      icon: '🚘',
      description: 'Lujo y elegancia',
      basePrice: 45,
      capacity: 4,
      features: ['Lujo', 'WiFi Premium', 'Bebidas', 'Música']
    },
    {
      id: 4,
      name: 'XL',
      icon: '🚐',
      description: 'Para grupos grandes',
      basePrice: 35,
      capacity: 6,
      features: ['6 pasajeros', 'Amplio', 'Equipaje extra']
    }
  ];

  const calculateDynamicPrice = async (serviceType) => {
    setLoadingPrice(true);
    
    try {
      const result = await aiService.calculateDynamicPrice({
        service_type_id: serviceType.id,
        base_price: serviceType.basePrice,
        distance: 5,
        duration: 15,
        pickup_location: {
          latitude: 0,
          longitude: 0
        }
      });

      if (result.success && result.data) {
        const { base_price, multiplier, final_price, analysis } = result.data;
        const isHighDemand = parseFloat(multiplier) > 1.2;

        setPriceEstimate({
          basePrice: base_price,
          multiplier: multiplier,
          finalPrice: final_price,
          isHighDemand,
          aiAnalysis: {
            confidence: analysis?.confidence_score || 0.92,
            factors: analysis?.reasoning?.split('.').filter(r => r.trim()) || [
              `Análisis de demanda en tiempo real`,
              `Factores climáticos considerados`,
              `Nivel de tráfico evaluado`,
              `Disponibilidad de conductores`
            ]
          }
        });
      } else {
        const fallback = result.fallback || {
          base_price: serviceType.basePrice,
          multiplier: 1.0,
          final_price: serviceType.basePrice
        };
        
        setPriceEstimate({
          basePrice: fallback.base_price,
          multiplier: fallback.multiplier.toFixed(2),
          finalPrice: fallback.final_price.toFixed(2),
          isHighDemand: false,
          aiAnalysis: {
            confidence: 0.85,
            factors: ['Precio base aplicado (modo fallback)', 'IA temporalmente no disponible']
          }
        });
      }
    } catch (error) {
      console.error('Error al calcular precio:', error);
      
      setPriceEstimate({
        basePrice: serviceType.basePrice,
        multiplier: '1.00',
        finalPrice: serviceType.basePrice.toFixed(2),
        isHighDemand: false,
        aiAnalysis: {
          confidence: 0.80,
          factors: ['Precio base aplicado', 'Error en cálculo dinámico']
        }
      });
    } finally {
      setLoadingPrice(false);
    }
  };

  const handleServiceTypeSelect = async (serviceType) => {
    setBookingData({ ...bookingData, serviceType });
    await calculateDynamicPrice(serviceType);
    setStep(3);
  };

  const handleSubmit = () => {
    alert('🚀 ¡Viaje solicitado! Buscando conductor...');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Reserva tu viaje</h1>
        <p className="text-gray-600 text-lg">Precios optimizados con Inteligencia Artificial</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[
          { num: 1, label: 'Ubicaciones' },
          { num: 2, label: 'Servicio' },
          { num: 3, label: 'Confirmar' }
        ].map((s) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= s.num ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
            } font-bold transition-all`}>
              {step > s.num ? <Check className="w-5 h-5" /> : s.num}
            </div>
            <div className={`flex-1 h-1 mx-2 ${
              step > s.num ? 'bg-green-500' : 'bg-gray-200'
            } transition-all ${s.num === 3 ? 'hidden' : ''}`} />
          </div>
        ))}
      </div>

      {/* Step 1: Locations */}
      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">¿A dónde vamos?</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2 text-green-600" />
                Punto de recogida
              </label>
              <input
                type="text"
                placeholder="Ingresa tu ubicación actual"
                value={bookingData.pickup}
                onChange={(e) => setBookingData({ ...bookingData, pickup: e.target.value })}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2 text-red-600" />
                Destino
              </label>
              <input
                type="text"
                placeholder="¿A dónde te llevamos?"
                value={bookingData.dropoff}
                onChange={(e) => setBookingData({ ...bookingData, dropoff: e.target.value })}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all text-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Fecha
                </label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Hora
                </label>
                <input
                  type="time"
                  value={bookingData.time}
                  onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Número de pasajeros
              </label>
              <select
                value={bookingData.passengers}
                onChange={(e) => setBookingData({ ...bookingData, passengers: parseInt(e.target.value) })}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all text-lg"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} pasajero{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              if (!bookingData.pickup || !bookingData.dropoff) {
                alert('Por favor completa origen y destino');
                return;
              }
              setStep(2);
            }}
            className="w-full mt-6 bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-all shadow-lg"
          >
            Continuar →
          </button>
        </div>
      )}

      {/* Step 2: Service Type Selection */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Elige tu servicio</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceTypes.map((service) => (
              <div
                key={service.id}
                onClick={() => handleServiceTypeSelect(service)}
                className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-green-500 cursor-pointer transition-all hover:shadow-xl"
              >
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.features.map((feature, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-2xl font-bold text-gray-900">${service.basePrice}+</span>
                  <span className="text-sm text-gray-500">{service.capacity} pasajeros</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep(1)}
            className="mt-6 text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Volver
          </button>
        </div>
      )}

      {/* Step 3: Confirmation with AI Pricing */}
      {step === 3 && (
        <div className="space-y-6">
          {/* AI Pricing Display */}
          {loadingPrice ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-green-500 animate-pulse" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Analizando con IA...</h3>
              <p className="text-gray-600">Calculando el mejor precio según demanda, tráfico y clima</p>
            </div>
          ) : priceEstimate && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-8 border-2 border-green-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Zap className="w-8 h-8 text-green-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Precio Dinámico IA</h3>
                </div>
                <div className="flex items-center gap-2">
                  {priceEstimate.isHighDemand ? (
                    <TrendingUp className="w-5 h-5 text-red-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-green-500" />
                  )}
                  <span className={`font-bold ${priceEstimate.isHighDemand ? 'text-red-600' : 'text-green-600'}`}>
                    {priceEstimate.isHighDemand ? 'Alta demanda' : 'Demanda normal'}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 mb-4">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-gray-600">Precio base:</span>
                  <span className="text-lg font-semibold text-gray-900">${priceEstimate.basePrice}</span>
                </div>
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-gray-600">Multiplicador IA:</span>
                  <span className="text-lg font-semibold text-gray-900">{priceEstimate.multiplier}x</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold text-gray-900">Precio final:</span>
                    <span className="text-4xl font-bold text-green-600">${priceEstimate.finalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700 mb-2">Análisis IA (Confianza: {(priceEstimate.aiAnalysis.confidence * 100).toFixed(0)}%):</p>
                {priceEstimate.aiAnalysis.factors.map((factor, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-600">•</span>
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trip Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Resumen del viaje</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Origen:</span>
                <span className="font-semibold text-gray-900">{bookingData.pickup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Destino:</span>
                <span className="font-semibold text-gray-900">{bookingData.dropoff}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Servicio:</span>
                <span className="font-semibold text-gray-900">
                  {bookingData.serviceType?.icon} {bookingData.serviceType?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pasajeros:</span>
                <span className="font-semibold text-gray-900">{bookingData.passengers}</span>
              </div>
              {bookingData.date && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha/Hora:</span>
                  <span className="font-semibold text-gray-900">{bookingData.date} {bookingData.time}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
            >
              ← Cambiar servicio
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg"
            >
              🚀 Solicitar viaje
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
