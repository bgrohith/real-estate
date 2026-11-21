import React, { useState } from 'react';
import { X, Calculator, IndianRupee, PieChart, ShieldCheck, HelpCircle, Landmark } from 'lucide-react';
import { calculateEMI, INDIAN_STAMP_DUTY_RATES, formatIndianPrice } from '../utils/formatters';

interface EMICalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPrice?: number;
  city?: string;
}

export const EMICalculatorModal: React.FC<EMICalculatorModalProps> = ({
  isOpen,
  onClose,
  defaultPrice = 25000000,
  city = 'Mumbai',
}) => {
  const [propertyPrice, setPropertyPrice] = useState<number>(defaultPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');

  if (!isOpen) return null;

  const downPayment = Math.round((propertyPrice * downPaymentPercent) / 100);
  const loanAmount = propertyPrice - downPayment;

  const { monthlyEMI, totalInterest, totalPayment } = calculateEMI(
    loanAmount,
    interestRate,
    tenureYears
  );

  const stampDutyRate = INDIAN_STAMP_DUTY_RATES[selectedState] || 6.0;
  const stampDutyAmount = Math.round((propertyPrice * stampDutyRate) / 100);
  const registrationCharges = 30000; // Flat standard Indian max registration charge

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-sapphire-950 via-sapphire-900 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4" />
            <span>Financial Estimator</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-white">
            Home Loan EMI & Stamp Duty Calculator
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Simulate monthly loan commitments, Indian stamp duty, registration charges, and Section 80C tax deductions.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Top Result Banner */}
          <div className="p-5 bg-gradient-to-br from-sapphire-50 to-indigo-50/50 rounded-2xl border border-sapphire-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Estimated Monthly EMI
              </span>
              <p className="text-3xl font-serif font-bold text-sapphire-900 mt-1">
                ₹ {monthlyEMI.toLocaleString('en-IN')} <span className="text-xs font-sans text-slate-500 font-normal">/ month</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Principal: ₹ {loanAmount.toLocaleString('en-IN')} • Interest: ₹ {totalInterest.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="w-full sm:w-auto p-3 bg-white rounded-xl border border-sapphire-200 shadow-sm text-xs space-y-1 text-slate-700">
              <div className="flex justify-between gap-4">
                <span>Stamp Duty ({stampDutyRate}%):</span>
                <strong className="text-slate-900">₹ {stampDutyAmount.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span>Registration Fee:</span>
                <strong className="text-slate-900">₹ {registrationCharges.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="space-y-4 text-xs">
            {/* Property Price */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Property Value</span>
                <span className="text-sapphire-800 font-bold">{formatIndianPrice(propertyPrice)}</span>
              </div>
              <input
                type="range"
                min={2000000}
                max={300000000}
                step={500000}
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="w-full accent-sapphire-600"
              />
            </div>

            {/* Down Payment */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Down Payment ({downPaymentPercent}%)</span>
                <span className="text-sapphire-800 font-bold">{formatIndianPrice(downPayment)}</span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-sapphire-600"
              />
            </div>

            {/* Interest Rate & Tenure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Interest Rate</span>
                  <span className="text-sapphire-800 font-bold">{interestRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min={7.5}
                  max={12.0}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-sapphire-600"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Loan Tenure</span>
                  <span className="text-sapphire-800 font-bold">{tenureYears} Years</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-sapphire-600"
                />
              </div>
            </div>

            {/* Indian State Stamp Duty Selector */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State of Acquisition (Governs Stamp Duty)
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sapphire-600"
              >
                {Object.keys(INDIAN_STAMP_DUTY_RATES).map((st) => (
                  <option key={st} value={st}>
                    {st} ({INDIAN_STAMP_DUTY_RATES[st]}% Stamp Duty)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bank Tie-ups Strip */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <h4 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-sapphire-700" />
              Pre-approved Banking Partners
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-center text-slate-600 font-medium">
              <div className="p-2 bg-white rounded-lg border border-slate-200">SBI: <strong>8.50%</strong></div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">HDFC: <strong>8.65%</strong></div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">ICICI: <strong>8.75%</strong></div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">Kotak: <strong>8.70%</strong></div>
            </div>
          </div>

          {/* Tax Saving Notice */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Income Tax Benefit:</strong> Claim up to ₹ 1.5 Lakh under Section 80C on principal repayment, and up to ₹ 2 Lakh under Section 24(b) on interest paid annually.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EMICalculatorModal;
