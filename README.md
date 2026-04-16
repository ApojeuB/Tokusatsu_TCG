TOKUSATSU CARD GAME (TCG)
Um Jogo de Cartas Estratégico Inspirado em Tokusatsu
https://img.shields.io/badge/Expo-51.0-blue.svg
https://img.shields.io/badge/React_Native-0.74-61dafb.svg
https://img.shields.io/badge/License-MIT-green.svg

🎮 Sobre o Jogo
Tokusatsu Card Game é um jogo de cartas digital onde você assume o papel de um Comandante liderando forças inspiradas em séries japonesas de heróis como Kamen Rider, Super Sentai, Kaiju e Ultraman.

Diferente de TCGs tradicionais focados em reduzir pontos de vida, aqui a vitória vem através de um clímax estratégico: deixar o oponente vulnerável e executar seu Finalizador – um xeque-mate que encerra a partida instantaneamente.

✨ Características Principais
Característica	Descrição
🎯 Finalizador como Xeque-Mate	Vença imediatamente ao cumprir a condição especial do seu Comandante
⚡ Sistema de Impulso	Recurso estratégico que limita suas ações – gerencie com sabedoria
🛡️ Combate Estilo Magic	Unidades atacam unidades, [GUARD] protege o comandante
🃏 Card Master System	Crie, edite e personalize suas próprias cartas
🤖 IA Oponente	Enfrente o Grande Líder Shocker com comportamento estratégico
📚 Deck Builder	Monte seu deck com 30-60 cartas das suas coleções
🖼️ Capturas de Tela
[Em desenvolvimento - Adicione imagens do jogo aqui]

🚀 Demonstração ao Vivo
[Em breve - Link para testar o jogo]

📦 Tecnologias Utilizadas
json
{
  "frontend": "React Native 0.74 + Expo 51",
  "navigation": "React Navigation 6",
  "storage": "AsyncStorage",
  "animations": "React Native Reanimated 3",
  "haptics": "Expo Haptics",
  "audio": "Expo AV"
}
🎮 Como Jogar
Objetivo
Deixe o oponente Vulnerável (Instabilidade ≤ 5) e ative seu Finalizador para vencer.

Estrutura do Turno
text
1. PREPARAÇÃO → Ganhe 1 Impulso, ative efeitos
2. COMPRA → Compre 1 carta
3. PRINCIPAL → Jogue cartas, equipe itens
4. COMBATE → Ataque com suas unidades
5. RESOLUÇÃO → Ative efeitos de fim de turno
Mecânicas Fundamentais
🩸 Instabilidade (IS)
Começa em 20

Diminui quando você recebe dano

Vulnerável quando ≤ 5 → condição para Finalizador

⚡ Impulso
Começa com 3 por turno (máx. 8)

Usado para jogar cartas e ativar habilidades

Gere mais com cartas [GENERATOR] ou descartes

🛡️ Combate (Sistema Magic)
Unidades com [GUARD] DEVEM ser atacadas primeiro

Dano excedente NÃO vai ao comandante

Unidades não atacam no turno que entram (fadiga)

🔥 Finalizador (Xeque-Mate)
NÃO custa Impulso

Só pode ser ativado com oponente Vulnerável

Condição específica por Comandante

Vitória imediata se bem-sucedido

👤 Comandantes Disponíveis
Comandante	Série	Identidade	Finalizador
🦗 Takeshi Hongo	Kamen Rider	RIDERs custam -1; jogar "Rider" dá +1 Impulso	3+ RIDER no cemitério
🦹 Grande Líder Shocker	Shocker	Banir SHOCKER do cemitério dá +1 Impulso	Monstro com 3+ materiais
🔴 Akarenger	Super Sentai	SENTAI ganham +1/+0 por aliado	5+ SENTAI em campo
🦖 Godzilla	Kaiju	KAIJU custam -1 por marcador	Unidade com 5+ marcadores
⚪ Ultraman	Ultraman	ULTRAMAN atacam sem fadiga, mas custam +1	Oponente com IS ≤ 8
🃏 Tipos de Carta
Tipo	Descrição	Exemplo
🧟 Unit	Combatentes no campo	Kamen Rider Ichigo
⚡ Action	Efeitos instantâneos	Rider Kick
🔄 Reaction	Respostas fora do turno	Counter Strike Break
🎒 Item	Equipamentos permanentes	Typhoon Belt
🌍 Terrain	Efeitos globais	Quartel General
Tags de Carta
Tag	Efeito
🟢 GUARD	Protege o comandante (deve ser atacado primeiro)
🔴 PRESSURE	Causa +1 de dano ao atacar
🔵 ENGINE	Escala com o jogo (cresce por turno)
🟡 GENERATOR	Gera Impulso ao entrar/morrer
🛠️ Instalação e Execução
Pré-requisitos
Node.js 18+

npm ou yarn

Expo CLI

Android Studio (para build APK) ou iOS Simulator (Mac)

Passos
bash
# Clone o repositório
git clone https://github.com/seu-usuario/tokusatsu-tcg.git
cd tokusatsu-tcg

# Instale as dependências
npm install

# Inicie o projeto
npx expo start

# Execute no dispositivo (escaneie o QR Code com Expo Go)
# Ou pressione 'a' para Android / 'i' para iOS
Build para Produção
bash
# Build Android APK
eas build -p android --profile preview

# Build iOS
eas build -p ios --profile preview
📁 Estrutura do Projeto
text
tokusatsu-tcg/
├── components/          # Componentes reutilizáveis
├── controllers/         # Lógica do jogo (GameController, CombatController...)
├── entities/            # Modelos (Card, Unit, Player, GameState...)
├── service/             # Serviços (CardMasterService, DeckService...)
├── data/                # Dados mestres (cartas JSON, comandantes...)
├── view/                # Telas e estilos (GameScreen, CardMasterScreen...)
├── constants/           # Constantes globais
├── utils/               # Funções auxiliares
└── App.jsx              # Entry point
🗺️ Roadmap / Próximas Implementações
🔥 Prioridade Alta (Próximas Sprints)
Sistema Multiplayer Online - Jogue contra outros jogadores via WebSocket

Modo Campanha - Enfrente vários chefes com narrativa própria

Sistema de Progressão - Ganhe experiência, suba de nível e desbloqueie cartas

Loja de Cartas - Compre pacotes de cartas com moeda do jogo

Sistema de Missões Diárias - Desafios diários com recompensas

🎴 Expansão de Conteúdo
Novas Séries

Kamen Rider (Build, Zero-One, Geats)

Super Sentai (Gokaiger, Kyoryuger, Donbrothers)

Kaiju (Mothra, Rodan, Ghidorah)

Ultraman (Tiga, Orb, Z)

Mais Comandantes (10+ novos)

Cartas de Transformação - Mecânica de evolução em campo

Cartas de Fusão - Combine duas unidades para criar uma mais forte

Modo Tag Team - 2v2 com parceiro

🎨 Melhorias Visuais e de Experiência
Animações 3D - Para ataques especiais e finalizadores

Efeitos Sonoros - Vozes dos personagens e trilha sonora épica

Arte das Cartas - Sistema para adicionar imagens customizadas

Modo Escuro/Claro - Toggle de tema

Suporte a Tablets - Layout otimizado para telas grandes

🧠 IA e Jogabilidade
Níveis de Dificuldade - IA com comportamentos diferentes (agressivo, defensivo)

Modo Desafio - Regras modificadas (ex: começar com IS 10)

Tutorial Interativo - Guia passo a passo das mecânicas

Replay de Partidas - Assista suas partidas anteriores

Estatísticas Avançadas - Winrate, cartas mais usadas, etc.

🔧 Ferramentas e Integrações
Import/Export de Decks - Compartilhe decks via código QR

Editor de Cartas Avançado - Com preview em tempo real

Marketplace da Comunidade - Compartilhe cartas customizadas

API Pública - Para ferramentas de terceiros

Versão Web - Jogue diretamente no navegador

🏆 Sistema de Competição
Ranking Global - Leaderboard de melhores jogadores

Torneios Semanais - Eventos com premiações

Sistema de Conquistas - Medalhas e troféus

Temporadas Competitivas - Reset de ranking com recompensas

🌐 Localização
Tradução para Inglês

Tradução para Japonês

Tradução para Espanhol

Suporte a Português (PT-BR)

🤝 Como Contribuir
Fork o projeto

Crie uma branch para sua feature (git checkout -b feature/amazing-feature)

Commit suas mudanças (git commit -m 'Add amazing feature')

Push para a branch (git push origin feature/amazing-feature)

Abra um Pull Request

Diretrizes de Contribuição
Siga a estrutura de pastas definida

Mantenha o código limpo e documentado

Teste suas mudanças antes de commitar

Atualize o README se necessário

📄 Licença
Distribuído sob a licença MIT. Veja LICENSE para mais informações.

📞 Contato
Desenvolvedor - [Seu Nome] - [seu.email@exemplo.com]

Link do Projeto: https://github.com/seu-usuario/tokusatsu-tcg

🙏 Agradecimentos
Toei Company - Pelas séries Kamen Rider, Super Sentai

Tsuburaya Productions - Por Ultraman

Toho Co., Ltd. - Por Godzilla e Kaiju

Comunidade de TCGs - Pela inspiração nas mecânicas

⭐ Se você gostou deste projeto, considere dar uma estrela no GitHub!
Tokusatsu TCG - Transforme, Estrategize, Finalize! 🎴⚡

Status do Projeto
Área	Status
Core Game Engine	✅ Completo
Sistema de Combate	✅ Completo
Card Master Service	✅ Completo
IA do Oponente	✅ Completo
GameScreen	✅ Completo
CardMasterScreen	✅ Completo
DeckBuilderScreen	🚧 Em desenvolvimento
Multiplayer	📅 Planejado
Modo Campanha	📅 Planejado
