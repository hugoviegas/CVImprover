# CV Improver

[🇺🇸 English Version](./README.md)

Um construtor e otimizador de currículos impulsionado por IA que ajuda você a criar currículos profissionais e otimizados para ATS. Carregue seu currículo existente em formato PDF, DOCX ou TXT, e deixe a IA aprimorar e estruturar para melhores resultados em candidaturas de emprego.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-IA-4285F4?logo=google&logoColor=white)

## ✨ Funcionalidades

### 📄 Importação Inteligente de Currículos
- **Suporte Multi-formato**: Importe currículos de arquivos PDF, DOCX ou TXT
- **Análise com IA**: Usa Google Gemini para extrair e estruturar dados do currículo de forma inteligente
- **Modo de Importação Aprimorada**: Refinamento opcional com IA para correção gramatical e melhorias de clareza
- **Cache Inteligente**: Armazena automaticamente currículos processados para evitar processamento redundante

### ✏️ Editor Completo
- **Editor Estruturado**: Edite todas as seções do currículo com formulários intuitivos
  - Informações Pessoais
  - Resumo Profissional
  - Experiência Profissional com destaques
  - Educação com notas e níveis EQF
  - Habilidades Técnicas (categorizadas)
  - Idiomas com níveis de proficiência
  - Projetos com tecnologias
  - Certificações
- **Editor JSON**: Acesso direto aos dados do currículo para usuários avançados
- **Desfazer/Refazer**: Suporte completo de histórico para todas as alterações
- **Salvamento Automático**: Alterações são automaticamente persistidas no armazenamento local

### 🤖 Otimização com IA
- **Otimização de Resumo**: Reescreva resumos profissionais para corresponder às descrições de vagas
- **Aprimoramento de Experiência**: Transforme tópicos com verbos de ação e métricas
- **Destaque de Educação**: Enfatize cursos e conquistas relevantes
- **Descrições de Projetos**: Otimize detalhes de projetos para funções específicas
- **Análise de Vagas**: Calcule pontuações de correspondência de palavras-chave com descrições de vagas

### 🎨 Múltiplos Templates
- **Template ATS**: Layout limpo e profissional otimizado para Sistemas de Rastreamento de Candidatos
- **Template Moderno**: Design contemporâneo com elementos visuais
- **Template Europass**: Formato padrão da UE com seções estruturadas
- **Template Minimalista**: Design simples e elegante

### 📱 Design Responsivo
- Desktop: Editor e visualização lado a lado
- Mobile: Navegação por abas entre modos de edição e visualização
- Otimizado para Impressão: Layout de página A4 com margens adequadas

### 📤 Opções de Exportação
- **Exportação PDF**: Baixe seu currículo como um PDF profissional
- **Visualização ao Vivo**: Visualização em tempo real enquanto edita
- **Seleção de Template**: Escolha diferentes templates antes de exportar

## 🚀 Começando

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Chave de API do Google Gemini (para recursos de IA)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/hugoviegas/CVImprover.git
   cd CVImprover
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.sample .env
   ```
   
   Edite o `.env` e adicione sua chave de API do Gemini:
   ```env
   VITE_GEMINI_API_KEY=sua_chave_api_gemini_aqui
   ```
   
   Obtenha sua chave de API em: https://aistudio.google.com/app/apikey

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Abra no navegador**
   
   Navegue até `http://localhost:5173`

### Build para Produção

```bash
npm run build
npm run preview
```

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** - Biblioteca de UI com hooks e context
- **TypeScript** - JavaScript com tipagem segura
- **Vite** - Ferramenta de build rápida e servidor de desenvolvimento
- **TailwindCSS** - Framework CSS utilitário
- **React Router** - Roteamento no cliente

### IA e Análise
- **Google Gemini AI** - Análise e otimização de currículos
- **pdfjs-dist** - Extração de texto de PDFs
- **mammoth** - Extração de texto de DOCX

### Exportação
- **jspdf** - Geração de PDFs
- **html2canvas** - Conversão de HTML para canvas
- **pdf-lib** - Manipulação de PDFs

### Componentes de UI
- **Lucide React** - Biblioteca de ícones
- **react-dropzone** - Upload de arquivos com arrastar e soltar
- **clsx & tailwind-merge** - Utilitários para nomes de classes

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Analysis/       # Recursos de análise de vagas
│   ├── Editor/         # Componentes de edição de currículo
│   │   ├── ResumeEditor.tsx    # Container principal do editor
│   │   ├── StructuredEditor.tsx # Edição baseada em formulários
│   │   ├── RawEditor.tsx        # Editor JSON
│   │   └── ...sections/         # Editores de seção
│   ├── Export/         # Funcionalidade de exportação PDF
│   ├── Layout/         # Componentes de layout do app
│   ├── Preview/        # Visualização ao vivo do currículo
│   ├── Templates/      # Templates de currículo
│   │   ├── ATS/
│   │   ├── Europass/
│   │   ├── Minimal/
│   │   └── Modern/
│   └── Upload/         # Componentes de upload de arquivos
├── context/
│   └── ResumeContext.tsx  # Gerenciamento de estado global
├── hooks/              # Hooks React personalizados
├── pages/
│   └── Dashboard.tsx   # Dashboard principal
├── services/
│   ├── gemini.ts       # Funções de otimização com IA
│   ├── geminiParser.ts # Análise de currículo com IA
│   ├── aiPrompts.ts    # Templates de prompts de IA
│   └── pdfExportService.ts
├── types/
│   └── resume.ts       # Interfaces TypeScript
└── utils/
    ├── fileParser.ts   # Utilitários de análise de arquivos
    ├── resumeStorage.ts # Gerenciamento de armazenamento local
    └── resumeValidator.ts
```

## 🔧 Configuração

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_GEMINI_API_KEY` | Chave de API do Google Gemini | Obrigatório |
| `VITE_GEMINI_MODEL` | Modelo Gemini a ser usado | `gemini-2.5-flash-lite` |
| `VITE_PARSING_TIMEOUT_MS` | Timeout de análise em ms | `30000` |
| `VITE_PARSING_MAX_RETRIES` | Máximo de tentativas | `3` |
| `VITE_ENABLE_DEBUG_LOGGING` | Habilitar logs de debug | `false` |
| `VITE_ENABLE_AI_PARSING` | Habilitar recursos de IA | `true` |

### Modelos Gemini Suportados
- `gemini-2.5-flash-lite` (recomendado - rápido e econômico)
- `gemini-2.5-flash`
- `gemini-2.0-flash`

## 📝 Guia de Uso

### Criando um Novo Currículo

1. No Dashboard, clique em **"Create Resume"**
2. Escolha **"Create from Scratch"** ou **"Import with AI"**
3. Preencha suas informações usando o Editor Estruturado
4. Visualize seu currículo em tempo real no painel direito
5. Clique em **"Save"** para salvar suas alterações

### Importando um Currículo Existente

1. Clique em **"Import with AI"** no Dashboard
2. Escolha o modo de importação:
   - **Standard Import**: Análise rápida e detecção de campos
   - **Enhanced AI Import**: Inclui correções gramaticais e melhorias de clareza
3. Arraste e solte ou navegue para selecionar seu arquivo PDF/DOCX/TXT
4. Aguarde o processamento da IA (10-30 segundos)
5. Revise e edite os dados extraídos

### Otimizando para uma Vaga

1. No Editor Estruturado, cole a descrição da vaga desejada
2. Clique no botão **"AI Suggest"** em qualquer seção
3. Revise as sugestões da IA com destaques de palavras-chave
4. Aceite ou modifique as alterações sugeridas
5. Use o Analisador de Vagas para verificar sua pontuação de correspondência de palavras-chave

### Exportando seu Currículo

1. Selecione seu template preferido na aba Templates
2. Visualize o resultado final
3. Clique em **"Download PDF"** para exportar

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para enviar um Pull Request.

1. Faça um fork do repositório
2. Crie sua branch de feature (`git checkout -b feature/RecursoIncrivel`)
3. Commit suas alterações (`git commit -m 'Adiciona um RecursoIncrivel'`)
4. Push para a branch (`git push origin feature/RecursoIncrivel`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é open source e está disponível sob a [Licença MIT](LICENSE).

## 🙏 Agradecimentos

- [Google Gemini](https://ai.google.dev/) pelas capacidades de IA
- [Lucide](https://lucide.dev/) pelos belos ícones
- [TailwindCSS](https://tailwindcss.com/) pelos utilitários de estilização

---

Feito com ❤️ por [Hugo Viegas](https://github.com/hugoviegas)
