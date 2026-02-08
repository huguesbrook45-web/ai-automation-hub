import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Calculator, BookOpen, Zap, BarChart3, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

/**
 * Design Philosophy: Minimalist Utility-First
 * - Clean typography hierarchy with Poppins (headings) + Inter (body)
 * - Deep blue (#0066CC) accent on white/off-white backgrounds
 * - Generous whitespace and single-column layout
 * - Focus on clarity and immediate utility
 */

export default function Home() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("tools");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">AI Automation Hub</h1>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm">
              Resources
            </Button>
            <Button variant="ghost" size="sm">
              Tools
            </Button>
            <Button 
              onClick={() => navigate('/products')}
              size="sm" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Shop
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="border-b border-border py-16 md:py-24">
        <div className="container max-w-3xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  Automate Your Business in Hours, Not Months
                </h2>
                <p className="text-lg text-muted-foreground">
                  Ready-to-use automation blueprints, calculators, and proven workflows designed for solopreneurs and small teams.
                </p>
              </div>
              <div className="flex gap-4">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Explore Tools <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline">
                  View Blueprints
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Join 500+ solopreneurs saving 10+ hours per week
              </p>
            </div>

            {/* Right: Hero Image */}
            <div className="hidden md:flex items-center justify-center">
              <img
                src="https://private-us-east-1.manuscdn.com/sessionFile/3EVtUaLRhLpXd7FmSVSjbW/sandbox/GZVUcv4goDoWYO4C57XJsi-img-1_1770212623000_na1fn_aGVyby1hdXRvbWF0aW9uLXdvcmtmbG93.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvM0VWdFVhTFJoTHBYZDdGbVNWU2piVy9zYW5kYm94L0daVlVjdjRnb0RvV1lPNEM1N1hKc2ktaW1nLTFfMTc3MDIxMjYyMzAwMF9uYTFmbl9hR1Z5YnkxaGRYUnZiV0YwYVc5dUxYZHZjbXRtYkc5My5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=hK0zqeVksFQmlkx5J3Xf1htlknPuLyoYVoxnIjkbJC~7BfuzZeK1ZPN2ToifHzSho6Q3wrpChQpvIRA-l6R0l06fNrlVRyJ8GSwtFQzhac7F1UIp5ElPtmRtfB3kQOpK9PYadbAImDbYLUP~WHxJU7oH7404gUL2TGaLq~7ydpnfVqk~o2BUIYQKAGZTERe60CpOjQ6mb9QqskfrNCY8~ufIp2ifEOE1msPKfbLL6Jx3p5rfCW-D-QmOw2K8MUZ-MgwM2IRR33QYEk6ARoCUxssdtC42j0Gp3MzE~UjRvmPn1tFkZI4Y7bozKixWyZF0kcn2uH3Dj35hyLiNu70OIQ__"
                alt="AI Automation Workflow"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What You Get</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to automate your business operations without technical expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: Tools */}
            <Card className="p-8 border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Calculator className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Free Tools</h3>
              <p className="text-muted-foreground mb-4">
                ROI calculators, workflow analyzers, and automation templates ready to use immediately.
              </p>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                Explore Tools <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Card>

            {/* Feature 2: Blueprints */}
            <Card className="p-8 border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Automation Blueprints</h3>
              <p className="text-muted-foreground mb-4">
                Step-by-step guides for automating customer support, email workflows, and data management.
              </p>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                View Blueprints <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Card>

            {/* Feature 3: Recommendations */}
            <Card className="p-8 border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Recommended Tools</h3>
              <p className="text-muted-foreground mb-4">
                Curated list of affordable SaaS tools with proof-based recommendations and affiliate links.
              </p>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                Browse Tools <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Resource Library Preview */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Resource Library</h2>
            <p className="text-lg text-muted-foreground">
              Explore our collection of automation guides, templates, and case studies.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-border">
            {["tools", "blueprints", "guides"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 font-medium transition-colors ${
                  activeTab === tab
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="p-6 border border-border hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded">
                    {activeTab === "tools" ? "Free" : "Premium"}
                  </span>
                </div>
                <h4 className="font-semibold mb-2">
                  {activeTab === "tools"
                    ? `Automation Tool #${item}`
                    : activeTab === "blueprints"
                      ? `Blueprint: ${["Email", "Support", "Data", "Reporting"][item - 1]}`
                      : `Guide: Best Practice #${item}`}
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {activeTab === "tools"
                    ? "Free calculator and workflow analyzer"
                    : "Step-by-step implementation guide with templates"}
                </p>
                <Button variant="ghost" size="sm" className="text-primary">
                  Learn More <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/5 border-b border-border">
        <div className="container max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Automate?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start with our free tools, then explore premium blueprints to scale your business.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Tools</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blueprints</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Guides</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-sm text-muted-foreground mb-3">Get automation tips weekly</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 bg-secondary border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2026 AI Automation Hub. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
              <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
