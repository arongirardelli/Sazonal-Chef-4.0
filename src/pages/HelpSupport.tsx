import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppPreferences } from '../contexts/AppPreferencesContext'
import { BottomNav } from '../components/BottomNav'
import { ArrowLeft, HelpCircle, MessageCircle } from 'lucide-react'

// Componente do ícone de envelope personalizado
const EnvelopeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = 'currentColor' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M22 6L12 13L2 6" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)

// Componente do ícone de estrela/brilho personalizado
const SparkleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = 'currentColor' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Estrela principal */}
    <path 
      d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" 
      fill={color}
      stroke={color}
      strokeWidth="1"
    />
    {/* Pontos de brilho menores */}
    <circle cx="6" cy="6" r="1.5" fill={color} />
    <circle cx="18" cy="18" r="1.5" fill={color} />
  </svg>
)

// Componente do ícone de coração personalizado
const HeartIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = 'currentColor' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61Z" 
      fill={color}
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)

export const HelpSupport: React.FC = () => {
  const { colors, fontSizes, theme } = useAppPreferences()
  const navigate = useNavigate()
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const faqItems = [
    {
      question: "Meu cardápio é criado por um chef de verdade?",
      answer: "Quase! Seu cardápio é criado pela nossa inteligência artificial, que foi treinada com a lógica e os segredos de grandes chefs para pensar como um. Ela analisa as refeições que você quer, busca receitas que combinam entre si e monta um plano semanal equilibrado e delicioso. Pense nela como seu sous chef particular, organizando a cozinha para que você, o Chef principal, possa brilhar!"
    },
    {
      question: "Como a lista de compras sabe as quantidades exatas?",
      answer: "Ela não adivinha, ela é mais inteligente que isso! Depois de montar seu cardápio, a lista de compras lê todas as receitas selecionadas, soma as quantidades exatas de cada ingrediente (adeus, desperdício!), converte as medidas e organiza tudo por seções do supermercado. Seu único trabalho é empurrar o carrinho!"
    },
    {
      question: "Me apaixonei por uma receita! Como faço para não perdê-la?",
      answer: "É fácil guardar seus tesouros culinários! Quando estiver na página de uma receita, procure pelo ícone de 'salvar' (no formato de coração) no canto inferior direito da imagem da receita. É só tocar nele! Todas as suas receitas favoritas ficarão te esperando na página \"Salvos\", prontas para quando a inspiração bater."
    },
    {
      question: "O que são os 'Níveis de Chef' e como eu subo de nível?",
      answer: "É a sua jornada de mestre-cuca dentro do app! Você ganha pontos por usar o Sazonal Chef: explorando receitas, salvando suas favoritas, montando cardápios e muito mais. Quanto mais você se diverte e cozinha, mais pontos acumula para subir de \"Ajudante de Cozinha\" até \"Chef Michellin\". É o nosso jeito de celebrar seu progresso na cozinha!"
    },
    {
      question: "Posso deixar o app com a minha cara?",
      answer: "Claro! Sua cozinha, suas regras. Vá em \"Perfil > Preferências\" para encontrar as opções de personalização. Você pode ativar o Modo Escuro para uma vibe mais aconchegante ou ajustar o Tamanho da Fonte para deixar a leitura das receitas perfeita para você."
    },
    {
      question: "Por que o nome 'Sazonal' Chef?",
      answer: "Porque acreditamos que a melhor comida é feita com ingredientes frescos, da estação! O Sazonal Chef te ajuda a descobrir receitas que usam produtos no auge do sabor, do frescor e, geralmente, do preço. Fique de olho nos nossos \"Alertas Sazonais\" para não perder a temporada de morangos ou abóboras!"
    },
    {
      question: "Não sou muito bom na cozinha. O Sazonal Chef é para mim?",
      answer: "Com certeza! O Sazonal Chef foi feito para todos, do iniciante curioso ao cozinheiro experiente. Todas as nossas receitas têm instruções passo a passo super claras e você pode usar o filtro de \"Dificuldade\" para encontrar pratos \"Fáceis\" e deliciosos. Pense em nós como seu parceiro de cozinha, sempre pronto para ajudar. Você vai se surpreender com o que é capaz de criar!"
    }
  ]

  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .float-animation {
            animation: float 6s ease-in-out infinite;
          }
          
          .pulse-animation {
            animation: pulse 2s ease-in-out infinite;
          }
          
          .slide-in {
            animation: slideIn 0.6s ease-out;
          }
        `}
      </style>
      
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.accent} 100%)`,
        fontFamily: 'Nunito, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", sans-serif' 
      }}>
        {/* Header moderno com gradiente */}
        <div style={{ 
          position: 'sticky', 
          top: 0, 
          background: `linear-gradient(135deg, ${colors.primary} 0%, #1a4d1f 100%)`,
          zIndex: 50,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            maxWidth: 1080, 
            margin: '0 auto', 
            padding: '20px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Elementos decorativos flutuantes */}
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '20px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              animation: 'float 4s ease-in-out infinite'
            }} />
            <div style={{
              position: 'absolute',
              top: '30px',
              right: '30px',
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              animation: 'float 5s ease-in-out infinite reverse'
            }} />
            
            <button 
              onClick={() => navigate(-1)}
              style={{ 
                background: 'rgba(255,255,255,0.1)', 
                border: 'none', 
                padding: 12, 
                borderRadius: 12, 
                cursor: 'pointer', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ArrowLeft size={20} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <HelpCircle size={24} color="white" />
              <h1 style={{ 
                margin: 0, 
                color: 'white', 
                fontSize: '24px',
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                Central de Ajuda
              </h1>
            </div>
          </div>
        </div>

        {/* Conteúdo rolável */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ 
            maxWidth: 1080, 
            margin: '0 auto', 
            padding: '24px 20px', 
            display: 'grid', 
            gap: 32, 
            paddingBottom: '120px' 
          }}>
            
            {/* Card Principal */}
            <div style={{ 
              background: theme === 'dark' ? '#2d2d2d' : 'white',
              borderRadius: 20, 
              padding: 32, 
              border: theme === 'dark' ? '1px solid #374151' : '1px solid rgba(44,85,48,0.1)',
              boxShadow: theme === 'dark' ? '0 2px 8px rgba(55, 65, 81, 0.125)' : '0 8px 32px rgba(0,0,0,0.08)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Elemento decorativo */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}20)`,
                animation: 'pulse 3s ease-in-out infinite'
              }} />
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                marginBottom: 24,
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#2C5530',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 4px 16px rgba(44,85,48,0.3)'
                }}>
                  <MessageCircle size={24} color="white" />
                </div>
                <div>
                  <h3 style={{ 
                    margin: 0, 
                    color: theme === 'dark' ? '#CD853F' : '#000000', 
                    fontSize: '20px',
                    fontWeight: 700
                  }}>
                    Perguntas Frequentes
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    color: colors.textSecondary, 
                    fontSize: '14px' 
                  }}>
                    Está com alguma dúvida? Aqui você encontra respostas
                  </p>
                </div>
              </div>

              {/* Subtítulo Introdutório */}
              <div style={{ 
                marginBottom: 24,
                padding: '16px',
                background: `linear-gradient(135deg, ${colors.primary}10, ${colors.accent}10)`,
                borderRadius: 16,
                border: `1px solid ${colors.primary}20`
              }}>
                <p style={{
                  fontSize: fontSizes.lg,
                  color: colors.text,
                  lineHeight: 1.6,
                  margin: 0,
                  fontWeight: 500
                }}>
                  Está com alguma dúvida? Aqui você encontra respostas para as perguntas mais frequentes e formas de entrar em contato conosco.
                </p>
              </div>

              {/* FAQ Accordion Modernizado */}
              <div style={{ display: 'grid', gap: 12 }}>
                {faqItems.map((item, index) => (
                  <div key={index} style={{ 
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: `1px solid ${openFAQ === index ? colors.primary : 'rgba(44,85,48,0.1)'}`,
                    background: openFAQ === index ? `${colors.primary}05` : (theme === 'dark' ? '#1a1a1a' : 'white'),
                    transition: 'all 0.3s ease',
                    boxShadow: openFAQ === index ? '0 8px 24px rgba(44,85,48,0.1)' : '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    <button
                      onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                      style={{
                        width: '100%',
                        padding: '24px',
                        background: 'transparent',
                        border: 'none',
                        color: colors.text,
                        fontSize: fontSizes.lg,
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${colors.primary}05`;
                      }}
                      onMouseLeave={(e) => {
                        if (openFAQ !== index) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <span style={{ 
                        fontSize: fontSizes.lg,
                        fontWeight: 700,
                        color: colors.text,
                        lineHeight: 1.4
                      }}>
                        {item.question}
                      </span>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: openFAQ === index ? colors.primary : 'rgba(44,85,48,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: openFAQ === index ? 'white' : colors.primary,
                        fontSize: '18px',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease',
                        transform: openFAQ === index ? 'rotate(45deg)' : 'rotate(0deg)'
                      }}>
                        +
                      </div>
                    </button>
                    
                    {openFAQ === index && (
                      <div style={{
                        padding: '0 20px 20px 20px',
                        background: 'transparent',
                        fontSize: fontSizes.base,
                        color: colors.text,
                        lineHeight: 1.6,
                        animation: 'slideIn 0.3s ease-out'
                      }}>
                        {item.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Seção Sobre o Sazonal Chef */}
            <div style={{
              background: theme === 'dark' ? '#2d2d2d' : 'white',
              borderRadius: 20,
              padding: 32,
              border: theme === 'dark' ? '1px solid #374151' : '1px solid rgba(44,85,48,0.1)',
              boxShadow: theme === 'dark' ? '0 2px 8px rgba(55, 65, 81, 0.125)' : '0 8px 32px rgba(0,0,0,0.08)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Elemento decorativo */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}20)`,
                animation: 'pulse 3s ease-in-out infinite'
              }} />
              
              {/* Título da Seção */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                marginBottom: 24,
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#2C5530',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 4px 16px rgba(44,85,48,0.3)'
                }}>
                  <SparkleIcon size={24} color="white" />
                </div>
                <div>
                  <h3 style={{ 
                    margin: 0, 
                    color: theme === 'dark' ? '#CD853F' : '#000000', 
                    fontSize: '20px',
                    fontWeight: 700
                  }}>
                    Sobre o Sazonal Chef
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    color: colors.textSecondary, 
                    fontSize: '14px' 
                  }}>
                    Conheça nossa história e propósito
                  </p>
                </div>
              </div>

              {/* Cards */}
              <div style={{ display: 'grid', gap: 20 }}>
                {/* Card 1: Nossa Cozinha tem Alma */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 16,
                  padding: '24px',
                  borderRadius: 16,
                  background: `linear-gradient(135deg, ${colors.primary}05, ${colors.accent}05)`,
                  border: `1px solid ${colors.primary}20`,
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: '#CD853F',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    flexShrink: 0
                  }}>
                    <HeartIcon size={20} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      fontWeight: 700, 
                      color: colors.text, 
                      fontSize: '18px',
                      marginBottom: 12,
                      margin: 0
                    }}>
                      Nossa Cozinha tem Alma
                    </h4>
                    <p style={{ 
                      fontSize: '15px', 
                      color: colors.text,
                      lineHeight: 1.6,
                      margin: 0,
                      whiteSpace: 'pre-wrap'
                    }}>
                      {`"Olá, Chef!

Criei o Sazonal Chef para resgatar a magia de transformar ingredientes em momentos. Acreditamos que cozinhar o próprio alimento é o primeiro passo para uma vida com mais saúde e significado. Nosso objetivo é ser a ferramenta que te reconduz a essa jornada.

Ela começa ao escolher os alimentos e termina em uma mesa rodeada de afeto ou no seu prato, como um poderoso ato de autocuidado. Cada receita é uma oportunidade de criar um momento único, porque comida é emoção que une, é a memória de um sabor que fica para sempre. É a desculpa perfeita para reunir, compartilhar e criar as histórias que realmente valem a pena.

Nosso objetivo é simples: te dar as ferramentas para que você se reconecte com essa essência, seja para cuidar de si com mais saúde ou para celebrar a vida com quem você ama.

Afinal, comida de verdade nutre o corpo e alimenta a alma. Espero que o Sazonal Chef te inspire a criar pratos e memórias inesquecíveis."`}
                      <br />
                      <br />
                      — <strong>Aron Girardelli</strong>, Criador do Sazonal Chef
                    </p>
                  </div>
                </div>

                {/* Card 2: Contato & Suporte */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 16,
                  padding: '24px',
                  borderRadius: 16,
                  background: `linear-gradient(135deg, ${colors.primary}05, ${colors.accent}05)`,
                  border: `1px solid ${colors.primary}20`,
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: '#2C5530',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    flexShrink: 0
                  }}>
                    <EnvelopeIcon size={20} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      fontWeight: 700, 
                      color: theme === 'dark' ? '#CD853F' : colors.text, 
                      fontSize: '18px',
                      marginBottom: 12,
                      margin: 0
                    }}>
                      Fale Conosco
                    </h4>
                    <p style={{ 
                      fontSize: '15px', 
                      color: colors.text,
                      lineHeight: 1.6,
                      margin: 0
                    }}>
                      "Sua opinião é o nosso principal ingrediente. Para dúvidas, sugestões ou parcerias, envie um e-mail para: <strong>contato@sazonalchef.com</strong>"
                    </p>
                  </div>
                </div>
              </div>

              {/* Rodapé da Seção */}
              <div style={{
                marginTop: 32,
                padding: '20px',
                borderRadius: 12,
                background: `linear-gradient(135deg, ${colors.primary}08, ${colors.accent}08)`,
                border: `1px solid ${colors.primary}15`,
                textAlign: 'center'
              }}>
                <p style={{ 
                  fontSize: '14px', 
                  color: colors.textSecondary,
                  margin: 0,
                  fontWeight: 500
                }}>
                  <strong>Sazonal Chef v4.0.0</strong><br />
                  Desenvolvedor: <strong>Aron Girardelli</strong>
                </p>
              </div>
            </div>

          </div>
        </div>

        <BottomNav />
      </div>
    </>
  )
}
