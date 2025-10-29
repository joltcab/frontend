// ... keep existing code ...

const defaultTemplates = [
  // ... keep existing templates ...
  {
    template_key: "admin_access_verification",
    subject: "🔐 Admin Access Verification Code - JoltCab",
    body_html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #15B46A 0%, #0F9456 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">🔐 Admin Access Request</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; color: #333;">Hi {{user_name}},</p>
          
          <p style="font-size: 14px; color: #666; line-height: 1.6;">
            <strong>{{admin_name}}</strong> from our support team has requested temporary access to your JoltCab account for <strong>{{reason}}</strong>.
          </p>

          <div style="background: #f8f9fa; border-left: 4px solid #15B46A; padding: 15px; margin: 20px 0;">
            <p style="font-size: 24px; font-weight: bold; color: #15B46A; margin: 0; text-align: center; letter-spacing: 5px;">
              {{code}}
            </p>
          </div>

          <p style="font-size: 14px; color: #666;">
            <strong>Please provide this code to the admin to authorize access.</strong>
          </p>

          <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-size: 13px; color: #856404;">
              ⚠️ This code expires in <strong>{{expiry_minutes}} minutes</strong>. If you didn't request support, please contact us immediately.
            </p>
          </div>

          <p style="font-size: 12px; color: #999; margin-top: 30px;">
            All admin actions are logged and audited for your security.
          </p>
        </div>
      </div>
    `,
    body_text: "Hi {{user_name}},\n\n{{admin_name}} has requested access to your account for {{reason}}.\n\nVerification Code: {{code}}\n\nThis code expires in {{expiry_minutes}} minutes.\n\nIf you didn't request support, contact us immediately.",
    variables: ["user_name", "admin_name", "code", "reason", "expiry_minutes"],
    is_active: true,
    category: "authentication"
  }
];

// ... keep rest of existing code ...