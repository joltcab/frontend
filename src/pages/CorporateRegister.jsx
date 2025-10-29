import React from "react";
import { Briefcase } from "lucide-react";
import AuthTabs from "../components/auth/AuthTabs";
import CorporateSignUpForm from "../components/auth/CorporateSignUpForm";

export default function CorporateRegister() {
  return (
    <AuthTabs
      role="corporate"
      roleLabel="Corporate"
      roleIcon={Briefcase}
      signUpForm={CorporateSignUpForm}
    />
  );
}