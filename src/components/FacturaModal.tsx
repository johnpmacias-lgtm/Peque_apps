import React from 'react';
import { useStore } from '../store/useStore';
import { X, Printer, Download, CheckCircle } from 'lucide-react';

export default function FacturaModal() {
  const { ultimaFactura, setUltimaFactura, restauranteConfig, tema } = useStore();
  const isDark = tema === 'dark';

  if (!ultimaFactura) return null;

  const handleClose = () => {
    setUltimaFactura(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const fecha = new Date(ultimaFactura.fecha_creacion);
  const fechaFormateada = fecha.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const horaFormateada = fecha.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const subtotal = ultimaFactura.total;
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 no-print">
      <div className={`rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col border ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="text-green-400" size={24} />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ¡Pago Exitoso!
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Factura generada correctamente
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className={`p-2 rounded-lg transition ${
              isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Invoice Content - Printable */}
        <div className="flex-1 overflow-y-auto p-5 print-area">
          <div className={`rounded-xl p-6 border ${
            isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            {/* Restaurant Header */}
            <div className="text-center mb-6 pb-4 border-b border-dashed border-gray-300 dark:border-gray-600">
              <div className="text-4xl mb-2">{restauranteConfig.logotipo}</div>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {restauranteConfig.nombre}
              </h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {restauranteConfig.direccion}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Tel: {restauranteConfig.telefono}
              </p>
            </div>

            {/* Invoice Info */}
            <div className="mb-4 pb-4 border-b border-dashed border-gray-300 dark:border-gray-600">
              <div className="flex justify-between text-sm mb-2">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Factura #:</span>
                <span className={`font-mono font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  F-{ultimaFactura.id.toString().slice(-6)}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Fecha:</span>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>{fechaFormateada}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Hora:</span>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>{horaFormateada}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Mesa:</span>
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {ultimaFactura.mesa_numero}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Mesero:</span>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>
                  {ultimaFactura.mesero_nombre}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="mb-4 pb-4 border-b border-dashed border-gray-300 dark:border-gray-600">
              <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                DETALLE DE PRODUCTOS
              </h4>
              <div className="space-y-2">
                {ultimaFactura.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {item.plato_nombre}
                      </span>
                      {item.notas && (
                        <p className={`text-xs italic ${isDark ? 'text-amber-400/70' : 'text-amber-600'}`}>
                          * {item.notas}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        x{item.cantidad}
                      </span>
                      <span className={`font-mono text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ${((ultimaFactura.total / ultimaFactura.items.reduce((sum, i) => sum + i.cantidad, 0)) * item.cantidad).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Subtotal:</span>
                <span className={`font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ${subtotal.toFixed(2)} {restauranteConfig.moneda}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>IVA (16%):</span>
                <span className={`font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ${iva.toFixed(2)} {restauranteConfig.moneda}
                </span>
              </div>
              <div className={`flex justify-between text-lg font-bold pt-2 border-t border-dashed ${
                isDark ? 'border-gray-600 text-white' : 'border-gray-300 text-gray-900'
              }`}>
                <span>TOTAL:</span>
                <span className="font-mono text-green-500">
                  ${total.toFixed(2)} {restauranteConfig.moneda}
                </span>
              </div>
            </div>

            {/* Notes */}
            {ultimaFactura.notas_generales && (
              <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                <p className={`text-xs ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                  <strong>Notas:</strong> {ultimaFactura.notas_generales}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className={`mt-6 pt-4 border-t border-dashed text-center ${
              isDark ? 'border-gray-600' : 'border-gray-300'
            }`}>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                ¡Gracias por su preferencia!
              </p>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Este documento es una representación impresa de su factura
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={`p-5 border-t flex gap-3 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={handleClose}
            className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition ${
              isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <Printer size={16} />
            Imprimir Factura
          </button>
        </div>
      </div>
    </div>
  );
}
