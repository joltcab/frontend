import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function useAppearanceSettings() {
  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['appearanceSettings'],
    queryFn: () => base44.entities.AppearanceSettings.list(),
  });

  const headerSettings = settings.find(s => s.section === 'header') || {};
  const footerSettings = settings.find(s => s.section === 'footer') || {};
  const generalSettings = settings.find(s => s.section === 'general') || {};

  return {
    header: {
      logo_url: headerSettings.logo_url || 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f7eae9d9887c2ac98e6d49/870b77da3_LogoAppjolt26.png',
      site_name: headerSettings.site_name || 'JoltCab',
      tagline: headerSettings.tagline || 'Your ride, your price',
      menu_items: headerSettings.menu_items || []
    },
    footer: {
      footer_text: footerSettings.footer_text || `© ${new Date().getFullYear()} JoltCab. All rights reserved.`,
      contact_info: footerSettings.contact_info || {},
      social_links: footerSettings.social_links || {}
    },
    general: {
      primary_color: generalSettings.primary_color || '#15B46A',
      secondary_color: generalSettings.secondary_color || '#0F9456',
      show_whatsapp_button: generalSettings.show_whatsapp_button !== false,
      whatsapp_number: generalSettings.whatsapp_number || '+14707484747'
    },
    isLoading
  };
}