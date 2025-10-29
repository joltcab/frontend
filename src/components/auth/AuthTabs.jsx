import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function AuthTabs({ role, roleLabel, roleIcon: RoleIcon, signUpForm: SignUpForm }) {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 hover:bg-white/50"
          onClick={() => window.location.href = createPageUrl("Register")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Registration Options
        </Button>

        {/* Sign Up Card */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center space-y-2 bg-gradient-to-r from-[#15B46A] to-[#0F9456] text-white rounded-t-xl">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <RoleIcon className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Sign Up as {roleLabel}
            </CardTitle>
            <CardDescription className="text-base text-white/90">
              Create your account and start using JoltCab
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <SignUpForm onSuccess={() => {}} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}