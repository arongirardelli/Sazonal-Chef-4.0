# PROMPT PARA GEMINI - CORREÇÃO DO ABACATE

## SITUAÇÃO ATUAL
O sistema de lista de compras está mostrando valores incorretos para o abacate:
- **Problema**: "Abacate – 262850g (aprox. 751 unidades)"
- **Esperado**: Valores corretos baseados nas receitas do cardápio

## CONTEXTO TÉCNICO

### Arquivos Principais:
- `src/lib/shoppingListBuilder.ts` - Lógica de construção da lista de compras
- `src/lib/ingredientData.ts` - Dicionário mestre de ingredientes
- `src/lib/unitConverter.ts` - Conversão de unidades

### Configuração Atual do Abacate:
```typescript
// Em ingredientData.ts
'abacate': { primaryUnit: 'unidade', averageWeightGrams: 350, category: 'Hortifruti' }
```

### Lógica Atual (PROBLEMÁTICA):
```typescript
// Em shoppingListBuilder.ts - linha ~1252
else if (nameLowerCorrections.includes('abacate')) {
  let pesoTotal = 0;
  let unidadesAproximadas = 0;
  
  if (item.unit === 'unidades') {
    pesoTotal = Math.round(item.quantity * 350);
    unidadesAproximadas = item.quantity;
  } else {
    pesoTotal = Math.round(item.quantity);
    unidadesAproximadas = pesoTotal / 350;
  }
  
  // Formatação...
}
```

## RECEITAS DO CARDÁPIO QUE USAM ABACATE

### Receitas Identificadas:
1. **Salada Cobb Clássica**: 1 Abacate em cubos
2. **Guacamole com Chips de Batata-Doce**: 3 Abacates maduros  
3. **Tostada com Abacate e Ovo Pochê**: 1 Abacate pequeno maduro

### Total Esperado:
- **5 unidades** = **1750g** (5 × 350g por abacate)

## PROBLEMA IDENTIFICADO

O sistema está consolidando incorretamente diferentes unidades de abacate:
- "unidade" (1)
- "maduros" (3) 
- "pequeno" (1)

Resultando em consolidação para 5 unidades, mas depois processando como 5g em vez de 5 × 350g = 1750g.

## TAREFA PARA GEMINI

### 1. INVESTIGAR A CONSOLIDAÇÃO
- Verificar como o sistema consolida ingredientes com unidades diferentes
- Identificar onde está ocorrendo a conversão incorreta de unidades para gramas

### 2. CORRIGIR A LÓGICA DO ABACATE
- Implementar lógica simples e direta para o abacate
- Garantir que unidades sejam convertidas corretamente para peso
- Mostrar formato: "Abacate – [peso]g (aprox. [unidades] unidades)"

### 3. TESTAR CENÁRIOS
- Cardápio real (5 unidades → 1750g)
- Valores individuais (1 unidade → 350g)
- Valores fracionários (0.5 unidade → 175g)

### 4. VALIDAR RESULTADO
- Confirmar que não há mais valores absurdos como "262850g"
- Verificar que a consolidação funciona corretamente
- Garantir que o formato está correto

## ARQUIVOS PARA MODIFICAR
- `src/lib/shoppingListBuilder.ts` - Lógica principal do abacate
- Possivelmente `src/lib/unitConverter.ts` - Se houver problema na conversão

## CRITÉRIOS DE SUCESSO
✅ Cardápio real mostra: "Abacate – 1750g (aprox. 5 unidades)"
✅ Não há mais valores absurdos como "262850g"
✅ Lógica simples e limpa
✅ Funciona para todos os cenários do cardápio

## COMANDO PARA TESTAR
```bash
cd "/Users/arongirardelli/Desktop/Sazonal Chef 4.0"
npx tsx test_abacate_final.mjs
```

---

**INSTRUÇÕES PARA GEMINI:**
Analise o código atual, identifique o problema na consolidação/conversão de unidades do abacate, e implemente uma solução limpa e eficiente que mostre os valores corretos baseados nas receitas do cardápio.
