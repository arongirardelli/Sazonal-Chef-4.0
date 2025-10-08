import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppPreferences } from '../contexts/AppPreferencesContext'
import { BottomNav } from '../components/BottomNav'
import { ArrowLeft, Shield, Lock, Eye, EyeOff, Trash2, Download, AlertTriangle, CheckCircle, Sparkles, ExternalLink } from 'lucide-react'

export const PrivacySecurity: React.FC = () => {
  const { colors, fontSizes, theme } = useAppPreferences()
  const navigate = useNavigate()
  const [openAccordion, setOpenAccordion] = useState<number | null>(null)

  const accordionItems = [
    {
      trigger: "🧂 O que guardamos no nosso potinho de segredos?",
      content: (
        <div>
          <p style={{
            fontSize: fontSizes.base,
            color: colors.text,
            lineHeight: 1.6,
            marginBottom: '16px',
            margin: '0 0 16px 0'
          }}>
            Para que a mágica aconteça, precisamos guardar algumas coisinhas suas. Prometemos usar apenas o essencial:
          </p>
          
          <div style={{ marginLeft: '16px' }}>
            <div style={{
              background: theme === 'dark' ? 'rgb(55, 65, 81)' : 'rgb(248, 248, 248)',
              padding: '16px',
              borderRadius: '12px',
              border: theme === 'dark' ? '1px solid rgb(55, 65, 81)' : '1px solid rgb(224, 224, 224)',
              marginTop: '16px',
              marginBottom: '12px'
            }}>
              <strong style={{ color: theme === 'dark' ? '#CD853F' : '#2C5530' }}>Seu E-mail:</strong> É a chave da sua cozinha, usado apenas para o login e para recuperarmos sua senha caso você a esqueça.
            </div>
            <div style={{
              background: theme === 'dark' ? 'rgb(55, 65, 81)' : 'rgb(248, 248, 248)',
              padding: '16px',
              borderRadius: '12px',
              border: theme === 'dark' ? '1px solid rgb(55, 65, 81)' : '1px solid rgb(224, 224, 224)',
              marginTop: '16px',
              marginBottom: '12px'
            }}>
              <strong style={{ color: theme === 'dark' ? '#CD853F' : '#2C5530' }}>Suas Preferências:</strong> As receitas que você salva e os filtros que mais usa nos ajudam a entender seu paladar, para que possamos sugerir pratos que você realmente vai amar.
            </div>
            <div style={{
              background: theme === 'dark' ? 'rgb(55, 65, 81)' : 'rgb(248, 248, 248)',
              padding: '16px',
              borderRadius: '12px',
              border: theme === 'dark' ? '1px solid rgb(55, 65, 81)' : '1px solid rgb(224, 224, 224)',
              marginTop: '16px'
            }}>
              <strong style={{ color: theme === 'dark' ? '#CD853F' : '#2C5530' }}>Seu Histórico no App:</strong> Saber como você usa o app nos ajuda a deixá-lo cada vez melhor, mais rápido e mais inteligente. É como provar o prato durante o preparo para ajustar o tempero!
            </div>
          </div>
        </div>
      )
    },
    {
      trigger: "🧑‍🍳 Como usamos esses ingredientes?",
      content: (
        <div>
          <p style={{
            fontSize: fontSizes.base,
            color: colors.text,
            lineHeight: 1.6,
            marginBottom: '16px',
            margin: '0 0 16px 0'
          }}>
            Seus dados são como um tempero secreto: usados exclusivamente para melhorar sua experiência. Nós os usamos para personalizar seu cardápio, tornar o app mais inteligente e manter tudo funcionando.
          </p>
          
          <div style={{
            background: colors.accent,
            padding: '16px',
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            marginTop: '16px'
          }}>
            <strong style={{ color: theme === 'dark' ? '#CD853F' : '#2C5530' }}>Nossa promessa:</strong> Nunca, jamais, venderemos ou compartilharemos seus dados pessoais com empresas de marketing. Receita de família a gente não compartilha com estranhos.
          </div>
        </div>
      )
    },
    {
      trigger: "🔒 O cofre da nossa despensa",
      content: (
        <div>
          <div style={{
            background: theme === 'dark' ? 'rgb(55, 65, 81)' : 'rgb(248, 248, 248)',
            padding: '16px',
            borderRadius: '12px',
            border: theme === 'dark' ? '1px solid rgb(55, 65, 81)' : '1px solid rgb(224, 224, 224)',
            marginTop: '16px',
            marginBottom: '12px'
          }}>
            <strong style={{ color: theme === 'dark' ? '#CD853F' : '#2C5530' }}>Tecnologia de Ponta:</strong> Usamos criptografia forte para proteger suas informações. Pense nisso como o melhor cadeado para a porta da sua cozinha.
          </div>
          <div style={{
            background: theme === 'dark' ? 'rgb(55, 65, 81)' : 'rgb(248, 248, 248)',
            padding: '16px',
            borderRadius: '12px',
            border: theme === 'dark' ? '1px solid rgb(55, 65, 81)' : '1px solid rgb(224, 224, 224)',
            marginTop: '16px'
          }}>
            <strong style={{ color: theme === 'dark' ? '#CD853F' : '#2C5530' }}>Você no Controle:</strong> Sua conta é sua. A qualquer momento, você pode acessá-la, editá-la ou, se um dia nos disser adeus, pode excluir sua conta e todos os dados associados permanentemente. Sem pegadinhas.
          </div>
        </div>
      )
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
              <Shield size={24} color="white" />
              <h1 style={{ 
                margin: 0, 
                color: 'white', 
                fontSize: '24px',
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                Sua Cozinha, Suas Regras
              </h1>
            </div>
          </div>
        </div>

        {/* Conteúdo rolável */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ 
            maxWidth: 1080, 
            margin: '0 auto', 
            padding: '20px 16px', 
            display: 'grid', 
            gap: 20, 
            paddingBottom: '100px' 
          }}>
            
            {/* Card Principal */}
            <div style={{ 
              background: theme === 'dark' ? '#2d2d2d' : 'white',
              borderRadius: 20, 
              padding: 24, 
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
                  <Lock size={24} />
                </div>
                <div>
                  <h3 style={{ 
                    margin: 0, 
                    color: theme === 'dark' ? '#CD853F' : '#000000', 
                    fontSize: '20px',
                    fontWeight: 700
                  }}>
                    Privacidade & Segurança
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    color: colors.textSecondary, 
                    fontSize: '14px' 
                  }}>
                    Sua privacidade é o ingrediente principal
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
                  Aqui no Sazonal Chef: O App de Receita Que Transforma Sua Relação com a Comida, sua privacidade é o ingrediente principal. Tratamos seus dados com o mesmo carinho que você trata sua comida: com respeito, transparência e sem adicionar nada que não seja necessário.
                </p>
              </div>

              {/* Accordion Modernizado */}
              <div style={{ display: 'grid', gap: 12 }}>
                {accordionItems.map((item, index) => (
                  <div key={index} style={{ 
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: `1px solid ${openAccordion === index ? colors.primary : 'rgba(44,85,48,0.1)'}`,
                    background: openAccordion === index ? `${colors.primary}05` : (theme === 'dark' ? '#1a1a1a' : 'white'),
                    transition: 'all 0.3s ease',
                    boxShadow: openAccordion === index ? '0 8px 24px rgba(44,85,48,0.1)' : '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    <button
                      onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                      style={{
                        width: '100%',
                        padding: '20px',
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
                        if (openAccordion !== index) {
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
                        {item.trigger}
                      </span>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: openAccordion === index ? colors.primary : 'rgba(44,85,48,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: openAccordion === index ? 'white' : colors.primary,
                        fontSize: '18px',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease',
                        transform: openAccordion === index ? 'rotate(45deg)' : 'rotate(0deg)'
                      }}>
                        +
                      </div>
                    </button>
                    
                    {openAccordion === index && (
                      <div style={{
                        padding: '0 20px 20px 20px',
                        background: 'transparent',
                        fontSize: fontSizes.base,
                        color: colors.text,
                        lineHeight: 1.6,
                        animation: 'slideIn 0.3s ease-out'
                      }}>
                        {item.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Link para Política Completa */}
            <div style={{
              background: theme === 'dark' ? '#2d2d2d' : 'white',
              borderRadius: 20, 
              padding: 24, 
              border: theme === 'dark' ? '1px solid #374151' : '1px solid rgba(44,85,48,0.1)',
              boxShadow: theme === 'dark' ? '0 2px 8px rgba(55, 65, 81, 0.125)' : '0 8px 32px rgba(0,0,0,0.08)',
              textAlign: 'center',
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
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#2C5530',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 4px 16px rgba(44,85,48,0.3)'
                }}>
                  <ExternalLink size={24} />
                </div>
                
                <p style={{
                  fontSize: fontSizes.base,
                  color: colors.textSecondary,
                  lineHeight: 1.6,
                  margin: '0 0 16px 0',
                  fontWeight: 500
                }}>
                  Sentindo gostinho de quero mais? Para quem amam ler todos os detalhes (a receita inteira, sem cortar nada!), você pode acessar nossa política completa.
                </p>
                
                <a 
                  href="https://sites.google.com/view/politicaprivacidadesazonalchef/in%C3%ADcio" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 24px',
                    borderRadius: 16,
                    background: colors.primary,
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 700,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 16px rgba(44,85,48,0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(44,85,48,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(44,85,48,0.3)';
                  }}
                >
                  Política de Privacidade Completa
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </>
  )
}