// src/hooks/useSavedRecipes.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase';
import { getSavedRecipeIds, addSavedRecipe, removeSavedRecipe } from '@/services/menuService';
import { addSavedRecipePoint, updateSavedRecipeCount } from '@/services/gamificationService';
import { toast } from 'sonner';
import { toastStyles } from '@/lib/toastStyles';
import type { Recipe } from '@/types/supabase';

export function useSavedRecipes() {
  const [userId, setUserId] = useState<string | null>(null);
  const [savedRecipeIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (user) {
        setUserId(user.id);
        const ids = await getSavedRecipeIds(user.id);
        setSavedIds(new Set(ids));
      }
    };
    init();
  }, []);

  const toggleSaved = useCallback(async (recipe: Recipe) => {
    if (!userId) {
      toast.error('Você precisa estar logado para salvar receitas.', {
        style: toastStyles.error
      });
      return;
    }

    const newSavedIds = new Set(savedRecipeIds);
    const isCurrentlySaved = newSavedIds.has(recipe.id);

    if (isCurrentlySaved) {
      newSavedIds.delete(recipe.id);
    } else {
      newSavedIds.add(recipe.id);
    }

    setSavedIds(newSavedIds); // Atualização otimista da UI

    try {
      if (isCurrentlySaved) {
        await removeSavedRecipe(userId, recipe.id);
      } else {
        await addSavedRecipe(userId, recipe.id);
      }
      
      // Confirma a persistência
      const confirmIds = await getSavedRecipeIds(userId);
      setSavedIds(new Set(confirmIds));
      
      const saved = confirmIds.includes(recipe.id);
      if (saved) {
        // Receita foi salva - adiciona pontos
        const res = await addSavedRecipePoint(userId, confirmIds.length);
        if (res?.leveledUp) {
          toast(`🎉 Você subiu de nível! Agora é ${res.chef_level}.`, {
            style: toastStyles.success
          });
        } else {
          toast('❤️ Receita adicionada aos favoritos', {
            style: toastStyles.success
          });
        }
      } else {
        // Receita foi removida - apenas atualiza contador
        await updateSavedRecipeCount(userId, confirmIds.length);
        toast('✅ Receita removida dos favoritos', {
          style: toastStyles.success
        });
      }
    } catch (error) {
      setSavedIds(savedRecipeIds); // Reverte em caso de erro
      toast.error('Erro ao salvar receita.', {
        style: toastStyles.error
      });
      console.error('Erro ao salvar receita:', error);
    }
  }, [userId, savedRecipeIds]);

  return { savedRecipeIds, toggleSaved };
}
