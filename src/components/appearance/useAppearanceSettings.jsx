import { useQuery } from "@tanstack/react-query";
import joltcab from "@/lib/joltcab-api";
import appConfig from "@/config/app";

export function useAppearanceSettings() {
  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['appearanceSettings'],
    queryFn: () => joltcab.entities.AppearanceSettings.list(),
  });

  const headerSettings = settings.find(s => s.section === 'header') || {};
  const footerSettings = settings.find(s => s.section === 'footer') || {};
  const generalSettings = settings.find(s => s.section === 'general') || {};

  return {
    header: {
      logo_url: headerSettings.logo_url || appConfig.logo,
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