// ... keep existing code ...

const defaultTemplates = [
  // ... keep existing templates ...
  {
    template_key: "admin_access_verification",
    message: "JoltCab: {{admin_name}} requested access. Your verification code: {{code}}. Valid for 10 minutes. Contact us if you didn't request support.",
    variables: ["admin_name", "code"],
    is_active: true,
    category: "authentication"
  }
];

// ... keep rest of existing code ...