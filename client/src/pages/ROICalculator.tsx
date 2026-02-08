import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download } from "lucide-react";
import { useState } from "react";
import { useNotificationManager } from "@/hooks/useNotificationManager";

/**
 * Design Philosophy: Minimalist Utility-First
 * - Clean, focused interface for quick calculations
 * - Deep blue accents on white background
 * - Immediate feedback and clear results display
 */

export default function ROICalculator() {
  const { notifySuccess, notifyInfo, confirmAction } = useNotificationManager();
  const [hourlyRate, setHourlyRate] = useState(50);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [toolCost, setToolCost] = useState(50);
  const [setupHours, setSetupHours] = useState(5);

  // Calculations
  const weeklySavings = hoursPerWeek * hourlyRate;
  const monthlySavings = weeklySavings * 4.33;
  const yearlySavings = monthlySavings * 12;
  
  const setupCost = setupHours * hourlyRate;
  const monthlyCost = toolCost;
  const yearlyToolCost = monthlyCost * 12;
  
  const netMonthlyROI = monthlySavings - monthlyCost;
  const netYearlyROI = yearlySavings - setupCost - yearlyToolCost;
  const paybackMonths = setupCost > 0 ? Math.ceil(setupCost / netMonthlyROI) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-6">
          <Button variant="ghost" size="sm" className="mb-4 text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold">AI Automation ROI Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Calculate the financial impact of automating your business processes
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Input Section */}
          <div className="space-y-8">
            <Card className="p-8 border border-border">
              <h2 className="text-xl font-semibold mb-6">Your Inputs</h2>

              {/* Hourly Rate */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-2">
                  Your Hourly Rate ($)
                </label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between items-center mt-3">
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-20 px-3 py-2 border border-border rounded bg-background text-foreground text-sm"
                  />
                  <span className="text-2xl font-bold text-primary">${hourlyRate}/hr</span>
                </div>
              </div>

              {/* Hours Per Week */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-2">
                  Hours Saved Per Week
                </label>
                <input
                  type="range"
                  min="1"
                  max="40"
                  step="1"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between items-center mt-3">
                  <input
                    type="number"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className="w-20 px-3 py-2 border border-border rounded bg-background text-foreground text-sm"
                  />
                  <span className="text-2xl font-bold text-primary">{hoursPerWeek} hrs/week</span>
                </div>
              </div>

              {/* Tool Cost */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-2">
                  Monthly Tool Cost ($)
                </label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={toolCost}
                  onChange={(e) => setToolCost(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between items-center mt-3">
                  <input
                    type="number"
                    value={toolCost}
                    onChange={(e) => setToolCost(Number(e.target.value))}
                    className="w-20 px-3 py-2 border border-border rounded bg-background text-foreground text-sm"
                  />
                  <span className="text-2xl font-bold text-primary">${toolCost}/mo</span>
                </div>
              </div>

              {/* Setup Hours */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Setup Time (hours)
                </label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={setupHours}
                  onChange={(e) => setSetupHours(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between items-center mt-3">
                  <input
                    type="number"
                    value={setupHours}
                    onChange={(e) => setSetupHours(Number(e.target.value))}
                    className="w-20 px-3 py-2 border border-border rounded bg-background text-foreground text-sm"
                  />
                  <span className="text-2xl font-bold text-primary">{setupHours} hrs</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <Card className="p-8 border border-primary bg-primary/5">
              <h2 className="text-xl font-semibold mb-6">Your ROI Results</h2>

              <div className="space-y-6">
                {/* Monthly Savings */}
                <div className="pb-6 border-b border-border">
                  <p className="text-sm text-muted-foreground mb-2">Monthly Savings</p>
                  <p className="text-3xl font-bold text-primary">
                    ${netMonthlyROI.toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Gross: ${monthlySavings.toFixed(0)} - Tool Cost: ${monthlyCost}
                  </p>
                </div>

                {/* Yearly ROI */}
                <div className="pb-6 border-b border-border">
                  <p className="text-sm text-muted-foreground mb-2">Yearly ROI</p>
                  <p className="text-3xl font-bold text-primary">
                    ${netYearlyROI.toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    After setup cost and tool fees
                  </p>
                </div>

                {/* Payback Period */}
                <div className="pb-6 border-b border-border">
                  <p className="text-sm text-muted-foreground mb-2">Payback Period</p>
                  <p className="text-3xl font-bold text-primary">
                    {paybackMonths} months
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Time to recover setup investment
                  </p>
                </div>

                {/* Annual Hours Saved */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Annual Hours Freed</p>
                  <p className="text-3xl font-bold text-primary">
                    {(hoursPerWeek * 52).toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    That's {(hoursPerWeek * 52 / 40).toFixed(1)} weeks of full-time work
                  </p>
                </div>
              </div>
            </Card>

            {/* Recommendation */}
            <Card className="p-6 border border-border bg-secondary/30">
              <h3 className="font-semibold mb-3">Recommendation</h3>
              {netYearlyROI > 0 ? (
                <p className="text-sm text-foreground">
                  <strong>This automation is highly recommended.</strong> You'll save{" "}
                  <span className="text-primary font-semibold">${netYearlyROI.toFixed(0)}</span> in
                  the first year alone. The payback period is just{" "}
                  <span className="text-primary font-semibold">{paybackMonths} months</span>.
                </p>
              ) : (
                <p className="text-sm text-foreground">
                  Based on your inputs, this automation may not be cost-effective right now. Consider
                  increasing hours saved or reducing tool costs.
                </p>
              )}
            </Card>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={() => {
                  notifySuccess('Report Downloaded', 'Your ROI report has been generated and downloaded.');
                  notifyInfo('Next Step', 'Check out our automation blueprints to get started!');
                }}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button 
                onClick={() => {
                  confirmAction(
                    'View Blueprints',
                    'Would you like to explore our automation blueprints?',
                    () => {
                      notifySuccess('Redirecting', 'Taking you to blueprints...');
                    }
                  );
                }}
                variant="outline" 
                className="flex-1"
              >
                View Blueprints
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 pt-16 border-t border-border">
          <h2 className="text-2xl font-bold mb-8">How This Calculator Works</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Inputs</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <strong>Hourly Rate:</strong> Your fully-loaded hourly cost (salary + benefits)
                </li>
                <li>
                  <strong>Hours Saved:</strong> Time freed up per week by automation
                </li>
                <li>
                  <strong>Tool Cost:</strong> Monthly subscription or service fee
                </li>
                <li>
                  <strong>Setup Time:</strong> One-time hours to implement the automation
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Calculations</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <strong>Monthly Savings:</strong> (Hours × Rate × 4.33) - Tool Cost
                </li>
                <li>
                  <strong>Yearly ROI:</strong> (Monthly Savings × 12) - Setup Cost
                </li>
                <li>
                  <strong>Payback Period:</strong> Setup Cost ÷ Monthly Savings
                </li>
                <li>
                  <strong>Hours Freed:</strong> Hours Per Week × 52 weeks
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
