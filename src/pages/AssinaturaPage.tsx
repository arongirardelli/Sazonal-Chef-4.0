import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ChefHat, Crown, Star, CheckCircle } from 'lucide-react'

export const AssinaturaPage: React.FC = () => {
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/inicio')
  }

  return (
    <div className="min-h-screen bg-[#F5F0E5] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#2C5530] rounded-full mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#2C5530] mb-4">
            Desbloqueie Todo o Potencial do Sazonal Chef
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sua assinatura expirou ou está inativa. Ative-a novamente para continuar 
            aproveitando todas as funcionalidades exclusivas.
          </p>
        </div>

        {/* Planos */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Plano Mensal */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-[#2C5530] relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-[#2C5530] text-white px-4 py-2 rounded-full text-sm font-medium">
                Mais Popular
              </span>
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-[#2C5530] mb-2">Plano Mensal</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                R$ 19,90
                <span className="text-lg font-normal text-gray-500">/mês</span>
              </div>
              <p className="text-gray-600">Cancelamento a qualquer momento</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Acesso a todas as receitas</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Planejamento de cardápios</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Lista de compras inteligente</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Receitas sazonais exclusivas</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Suporte prioritário</span>
              </li>
            </ul>

            <button className="w-full bg-[#2C5530] text-white py-4 px-6 rounded-lg font-medium hover:bg-[#1e3a22] transition-colors text-lg">
              Ativar Plano Mensal
            </button>
          </div>

          {/* Plano Anual */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-[#2C5530] mb-2">Plano Anual</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                R$ 199,90
                <span className="text-lg font-normal text-gray-500">/ano</span>
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-block mb-2">
                Economia de R$ 39,10
              </div>
              <p className="text-gray-600">Pagamento anual com desconto</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Todos os benefícios do plano mensal</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>2 meses grátis</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Conteúdo premium exclusivo</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Workshops culinários online</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Comunidade VIP</span>
              </li>
            </ul>

            <button className="w-full bg-gray-100 text-[#2C5530] py-4 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors text-lg border-2 border-[#2C5530]">
              Ativar Plano Anual
            </button>
          </div>
        </div>

        {/* Benefícios */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#2C5530] text-center mb-8">
            Por que escolher o Sazonal Chef?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <ChefHat className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C5530] mb-2">
                Receitas Exclusivas
              </h3>
              <p className="text-gray-600">
                Acesso a receitas sazonais e exclusivas que não estão disponíveis gratuitamente.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C5530] mb-2">
                Funcionalidades Premium
              </h3>
              <p className="text-gray-600">
                Planejamento avançado de cardápios e lista de compras inteligente.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C5530] mb-2">
                Suporte Prioritário
              </h3>
              <p className="text-gray-600">
                Atendimento exclusivo e suporte técnico prioritário para assinantes.
              </p>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Precisa de ajuda? Entre em contato conosco
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/help')}
              className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Central de Ajuda
            </button>
            
            <button
              onClick={handleSignOut}
              className="bg-red-100 text-red-700 py-3 px-6 rounded-lg font-medium hover:bg-red-200 transition-colors"
            >
              Fazer Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
