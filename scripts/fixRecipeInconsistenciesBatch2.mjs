import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const url = process.env.VITE_SUPABASE_URL
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcHh5cXJlaGhpYm9nc3BjdGNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDUxODk4NywiZXhwIjoyMDcwMDk0OTg3fQ._rW6-Td9B2rWyxcup568UyKrjOKLeA1H93-t0DH8jcw'

const supabase = createClient(url, serviceRoleKey)

// Segundo lote de correções para as receitas com inconsistências
const recipeFixesBatch2 = [
  {
    title: 'Salada de Atum e Ovo',
    structured_ingredients: [
      { name: 'Atum em lata', quantity: 80, unit: 'g' },
      { name: 'Ovos', quantity: 2, unit: 'unidades' },
      { name: 'Alface', quantity: 100, unit: 'g' },
      { name: 'Azeite', quantity: 15, unit: 'ml' },
      { name: 'Suco de limão', quantity: 10, unit: 'ml' },
      { name: 'Vinagre balsâmico', quantity: 10, unit: 'ml' },
      { name: 'Sal', quantity: 0.5, unit: 'colher de chá' }
    ]
  },
  {
    title: 'Gelatina Proteica',
    structured_ingredients: [
      { name: 'Gelatina incolor', quantity: 20, unit: 'g' },
      { name: 'Whey protein', quantity: 30, unit: 'g' },
      { name: 'Água', quantity: 200, unit: 'ml' }
    ]
  },
  {
    title: 'Bowl de Quinoa com Legumes',
    structured_ingredients: [
      { name: 'Quinoa', quantity: 100, unit: 'g' },
      { name: 'Abóbora roxa', quantity: 150, unit: 'g' },
      { name: 'Brócolis', quantity: 120, unit: 'g' },
      { name: 'Tahine', quantity: 2, unit: 'colheres de sopa' },
      { name: 'Água', quantity: 200, unit: 'ml' },
      { name: 'Alho', quantity: 2, unit: 'dentes' },
      { name: 'Suco de limão', quantity: 15, unit: 'ml' },
      { name: 'Molho shoyu', quantity: 20, unit: 'ml' }
    ]
  },
  {
    title: 'Lasanha à Bolonhesa',
    structured_ingredients: [
      { name: 'Massa para lasanha', quantity: 250, unit: 'g' },
      { name: 'Carne moída', quantity: 400, unit: 'g' },
      { name: 'Queijo mussarela', quantity: 200, unit: 'g' },
      { name: 'Leite', quantity: 500, unit: 'ml' },
      { name: 'Manteiga', quantity: 60, unit: 'g' },
      { name: 'Farinha de trigo', quantity: 60, unit: 'g' },
      { name: 'Molho de tomate', quantity: 400, unit: 'ml' },
      { name: 'Cebola', quantity: 1, unit: 'unidade' },
      { name: 'Alho', quantity: 3, unit: 'dentes' }
    ]
  },
  {
    title: 'Pão de Açúcar Caseiro',
    structured_ingredients: [
      { name: 'Farinha de trigo', quantity: 500, unit: 'g' },
      { name: 'Fermento biológico', quantity: 10, unit: 'g' },
      { name: 'Açúcar', quantity: 30, unit: 'g' },
      { name: 'Sal', quantity: 10, unit: 'g' },
      { name: 'Azeite', quantity: 30, unit: 'ml' },
      { name: 'Água', quantity: 300, unit: 'ml' }
    ]
  },
  {
    title: 'Salmão Grelhado com Quinoa',
    structured_ingredients: [
      { name: 'Salmão', quantity: 200, unit: 'g' },
      { name: 'Quinoa', quantity: 100, unit: 'g' },
      { name: 'Abobrinha', quantity: 150, unit: 'g' },
      { name: 'Azeite', quantity: 20, unit: 'ml' },
      { name: 'Caldo de legumes', quantity: 200, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' }
    ]
  },
  {
    title: 'Frango com Brócolis',
    structured_ingredients: [
      { name: 'Peito de frango', quantity: 200, unit: 'g' },
      { name: 'Brócolis', quantity: 200, unit: 'g' },
      { name: 'Alho', quantity: 2, unit: 'dentes' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
      { name: 'Azeite', quantity: 15, unit: 'ml' },
      { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' }
    ]
  },
  {
    title: 'Coxinha de Frango',
    structured_ingredients: [
      { name: 'Peito de frango', quantity: 300, unit: 'g' },
      { name: 'Batata', quantity: 400, unit: 'g' },
      { name: 'Farinha de trigo', quantity: 200, unit: 'g' },
      { name: 'Farinha de rosca', quantity: 150, unit: 'g' },
      { name: 'Óleo', quantity: 500, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' }
    ]
  },
  {
    title: 'Carne de Panela com Batata Doce',
    structured_ingredients: [
      { name: 'Carne bovina em cubos', quantity: 400, unit: 'g' },
      { name: 'Batata doce', quantity: 300, unit: 'g' },
      { name: 'Cebola', quantity: 100, unit: 'g' },
      { name: 'Alho', quantity: 3, unit: 'dentes' },
      { name: 'Molho de tomate', quantity: 200, unit: 'ml' },
      { name: 'Azeite', quantity: 15, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' },
      { name: 'Água', quantity: 400, unit: 'ml' }
    ]
  },
  {
    title: 'Guacamole com Nachos',
    structured_ingredients: [
      { name: 'Abacate', quantity: 0.5, unit: 'unidade' },
      { name: 'Cebola', quantity: 30, unit: 'g' },
      { name: 'Tomate', quantity: 60, unit: 'g' },
      { name: 'Suco de limão', quantity: 15, unit: 'ml' },
      { name: 'Nachos', quantity: 80, unit: 'g' },
      { name: 'Azeite', quantity: 10, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' }
    ]
  },
  {
    title: 'Edamame Cozido',
    structured_ingredients: [
      { name: 'Edamame', quantity: 200, unit: 'g' },
      { name: 'Sal grosso', quantity: 2, unit: 'colheres de sopa' },
      { name: 'Água', quantity: 500, unit: 'ml' }
    ]
  },
  {
    title: 'Chili de Feijão e Carne',
    structured_ingredients: [
      { name: 'Carne moída', quantity: 300, unit: 'g' },
      { name: 'Feijão cozido', quantity: 400, unit: 'g' },
      { name: 'Molho de tomate', quantity: 300, unit: 'ml' },
      { name: 'Cebola', quantity: 100, unit: 'g' },
      { name: 'Cominho em pó', quantity: 1, unit: 'colher de chá' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' },
      { name: 'Azeite', quantity: 15, unit: 'ml' }
    ]
  },
  {
    title: 'Curry de Grão-de-Bico com Coco',
    structured_ingredients: [
      { name: 'Grão-de-bico cozido', quantity: 300, unit: 'g' },
      { name: 'Leite de coco', quantity: 300, unit: 'ml' },
      { name: 'Cebola', quantity: 80, unit: 'g' },
      { name: 'Gengibre', quantity: 8, unit: 'g' },
      { name: 'Curry em pó', quantity: 1, unit: 'colher de sopa' },
      { name: 'Óleo de coco', quantity: 15, unit: 'ml' },
      { name: 'Alho', quantity: 2, unit: 'dentes' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' }
    ]
  },
  {
    title: 'Salada de Atum com Abacate',
    structured_ingredients: [
      { name: 'Atum fresco', quantity: 200, unit: 'g' },
      { name: 'Abacate', quantity: 1, unit: 'unidade' },
      { name: 'Tomate cereja', quantity: 150, unit: 'g' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' },
      { name: 'Azeite', quantity: 15, unit: 'ml' },
      { name: 'Suco de limão', quantity: 10, unit: 'ml' },
      { name: 'Molho shoyu', quantity: 15, unit: 'ml' }
    ]
  },
  {
    title: 'Arroz Integral com Feijão e Carne Moída',
    structured_ingredients: [
      { name: 'Arroz integral', quantity: 200, unit: 'g' },
      { name: 'Feijão preto cozido', quantity: 300, unit: 'g' },
      { name: 'Carne moída', quantity: 250, unit: 'g' },
      { name: 'Cebola', quantity: 100, unit: 'g' },
      { name: 'Alho', quantity: 3, unit: 'dentes' },
      { name: 'Azeite', quantity: 20, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' }
    ]
  },
  {
    title: 'Feijoada Completa',
    structured_ingredients: [
      { name: 'Feijão preto', quantity: 500, unit: 'g' },
      { name: 'Costela de porco', quantity: 400, unit: 'g' },
      { name: 'Linguiça calabresa', quantity: 300, unit: 'g' },
      { name: 'Bacon', quantity: 200, unit: 'g' },
      { name: 'Sal', quantity: 2, unit: 'colheres de chá' },
      { name: 'Água', quantity: 2000, unit: 'ml' },
      { name: 'Cebola', quantity: 2, unit: 'unidades' },
      { name: 'Alho', quantity: 6, unit: 'dentes' },
      { name: 'Molho de tomate', quantity: 200, unit: 'ml' },
      { name: 'Caldo de legumes', quantity: 500, unit: 'ml' }
    ]
  },
  {
    title: 'Lasanha de Berinjela com Ricota',
    structured_ingredients: [
      { name: 'Berinjela', quantity: 600, unit: 'g' },
      { name: 'Ricota', quantity: 500, unit: 'g' },
      { name: 'Molho de tomate', quantity: 400, unit: 'ml' },
      { name: 'Queijo parmesão', quantity: 80, unit: 'g' },
      { name: 'Azeite', quantity: 15, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' }
    ]
  },
  {
    title: 'Curry de Frango com Leite de Coco',
    structured_ingredients: [
      { name: 'Peito de frango', quantity: 400, unit: 'g' },
      { name: 'Leite de coco', quantity: 400, unit: 'ml' },
      { name: 'Gengibre', quantity: 10, unit: 'g' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' },
      { name: 'Óleo de coco', quantity: 20, unit: 'ml' },
      { name: 'Cebola', quantity: 100, unit: 'g' },
      { name: 'Alho', quantity: 3, unit: 'dentes' },
      { name: 'Molho de tomate', quantity: 200, unit: 'ml' }
    ]
  },
  {
    title: 'Mousse de Chocolate Vegano',
    structured_ingredients: [
      { name: 'Abacate', quantity: 0.5, unit: 'unidade' },
      { name: 'Cacau em pó', quantity: 2, unit: 'colheres de sopa' },
      { name: 'Tâmaras', quantity: 4, unit: 'unidades' },
      { name: 'Extrato de baunilha', quantity: 2.5, unit: 'ml' },
      { name: 'Leite de coco', quantity: 100, unit: 'ml' },
      { name: 'Água', quantity: 50, unit: 'ml' },
      { name: 'Molho de tâmaras', quantity: 20, unit: 'ml' }
    ]
  },
  {
    title: 'Frango Grelhado com Brócolis',
    structured_ingredients: [
      { name: 'Peito de frango', quantity: 200, unit: 'g' },
      { name: 'Brócolis', quantity: 150, unit: 'g' },
      { name: 'Azeite', quantity: 10, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' },
      { name: 'Ervas frescas', quantity: 2, unit: 'raminhos' },
      { name: 'Água', quantity: 500, unit: 'ml' }
    ]
  },
  {
    title: 'Bowl Japonês com Edamame e Omelete',
    structured_ingredients: [
      { name: 'Arroz japonês', quantity: 150, unit: 'g' },
      { name: 'Edamame', quantity: 100, unit: 'g' },
      { name: 'Ovos', quantity: 2, unit: 'unidades' },
      { name: 'Molho shoyu', quantity: 15, unit: 'ml' },
      { name: 'Azeite', quantity: 5, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' },
      { name: 'Água', quantity: 300, unit: 'ml' }
    ]
  },
  {
    title: 'Tofu Grelhado com Legumes',
    structured_ingredients: [
      { name: 'Tofu firme', quantity: 200, unit: 'g' },
      { name: 'Brócolis', quantity: 150, unit: 'g' },
      { name: 'Cenoura', quantity: 80, unit: 'g' },
      { name: 'Shoyu', quantity: 20, unit: 'ml' },
      { name: 'Gergelim', quantity: 1, unit: 'colher de sopa' },
      { name: 'Azeite', quantity: 10, unit: 'ml' },
      { name: 'Gengibre', quantity: 5, unit: 'g' },
      { name: 'Alho', quantity: 1, unit: 'dente' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' }
    ]
  },
  {
    title: 'Hummus com Cenoura',
    structured_ingredients: [
      { name: 'Grão-de-bico cozido', quantity: 200, unit: 'g' },
      { name: 'Tahine', quantity: 2, unit: 'colheres de sopa' },
      { name: 'Suco de limão', quantity: 20, unit: 'ml' },
      { name: 'Cenoura', quantity: 150, unit: 'g' },
      { name: 'Azeite', quantity: 15, unit: 'ml' },
      { name: 'Alho', quantity: 1, unit: 'dente' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' },
      { name: 'Água', quantity: 100, unit: 'ml' }
    ]
  },
  {
    title: 'Filé de Salmão com Quinoa',
    structured_ingredients: [
      { name: 'Salmão fresco', quantity: 200, unit: 'g' },
      { name: 'Quinoa', quantity: 100, unit: 'g' },
      { name: 'Azeite', quantity: 15, unit: 'ml' },
      { name: 'Suco de limão', quantity: 10, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' },
      { name: 'Água', quantity: 200, unit: 'ml' }
    ]
  },
  {
    title: 'Tofu com Brócolis ao Molho',
    structured_ingredients: [
      { name: 'Tofu firme', quantity: 200, unit: 'g' },
      { name: 'Brócolis', quantity: 200, unit: 'g' },
      { name: 'Shoyu', quantity: 20, unit: 'ml' },
      { name: 'Gergelim', quantity: 1, unit: 'colher de sopa' },
      { name: 'Azeite', quantity: 10, unit: 'ml' },
      { name: 'Gengibre', quantity: 5, unit: 'g' },
      { name: 'Alho', quantity: 1, unit: 'dente' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' }
    ]
  },
  {
    title: 'Yakisoba de Legumes',
    structured_ingredients: [
      { name: 'Macarrão para yakisoba', quantity: 150, unit: 'g' },
      { name: 'Cenoura', quantity: 80, unit: 'g' },
      { name: 'Brócolis', quantity: 120, unit: 'g' },
      { name: 'Pimentão', quantity: 80, unit: 'g' },
      { name: 'Shoyu', quantity: 20, unit: 'ml' },
      { name: 'Azeite', quantity: 15, unit: 'ml' },
      { name: 'Gergelim', quantity: 1, unit: 'colher de sopa' },
      { name: 'Sal', quantity: 1, unit: 'colher de chá' },
      { name: 'Pimenta do reino', quantity: 0.5, unit: 'colher de chá' },
      { name: 'Molho de ostras', quantity: 15, unit: 'ml' }
    ]
  },
  {
    title: 'Creme de Abacate com Cacau',
    structured_ingredients: [
      { name: 'Abacate', quantity: 200, unit: 'g' },
      { name: 'Cacau em pó', quantity: 20, unit: 'g' },
      { name: 'Melado', quantity: 20, unit: 'ml' },
      { name: 'Água', quantity: 50, unit: 'ml' }
    ]
  }
]

async function updateRecipeIngredients(recipeData) {
  try {
    const { data: recipes, error: searchError } = await supabase
      .from('recipes')
      .select('id, title')
      .ilike('title', recipeData.title)
    
    if (searchError) {
      console.error(`❌ Erro ao buscar ${recipeData.title}:`, searchError.message)
      return
    }
    
    if (!recipes || recipes.length === 0) {
      console.log(`⚠️  Receita não encontrada: ${recipeData.title}`)
      return
    }
    
    const recipe = recipes[0]
    console.log(`🔍 Encontrada receita: ${recipe.title} (ID: ${recipe.id})`)
    
    const { error: updateError } = await supabase
      .from('recipes')
      .update({
        structured_ingredients: recipeData.structured_ingredients,
        updated_at: new Date().toISOString()
      })
      .eq('id', recipe.id)
    
    if (updateError) {
      console.error(`❌ Erro ao atualizar ${recipeData.title}:`, updateError.message)
    } else {
      console.log(`✅ Corrigida: ${recipeData.title}`)
    }
    
  } catch (error) {
    console.error(`❌ Erro geral ao processar ${recipeData.title}:`, error.message)
  }
}

async function main() {
  console.log(`🔧 Corrigindo ${recipeFixesBatch2.length} receitas com inconsistências (lote 2)...`)
  
  for (const recipe of recipeFixesBatch2) {
    await updateRecipeIngredients(recipe)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('✅ Correções de inconsistências do lote 2 concluídas!')
}

main().catch(console.error)
