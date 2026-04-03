import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SiteSettings {
  [key: string]: any;
}

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      const settings: SiteSettings = {};
      data?.forEach((s) => {
        try {
          settings[s.key] = typeof s.value === 'string' ? JSON.parse(s.value) : s.value;
        } catch {
          settings[s.key] = s.value;
        }
      });
      return settings;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateSiteSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key, value: JSON.stringify(value) }, { onConflict: 'key' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
  });
};
