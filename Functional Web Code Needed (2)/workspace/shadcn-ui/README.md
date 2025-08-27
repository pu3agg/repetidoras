# 📡 Monitor de Repetidoras - Sistema de Monitoramento de Radioamadorismo

Sistema web moderno para monitoramento de repetidoras de radioamador no Brasil, desenvolvido com React, TypeScript e Tailwind CSS.

## 🚀 Features

- ✅ **Autenticação de usuários** com indicativos brasileiros
- ✅ **Mapa interativo** com localização das repetidoras (Leaflet)
- ✅ **CRUD completo** - qualquer usuário autenticado pode editar/excluir
- ✅ **Auditoria completa** - rastreamento de criação e modificações
- ✅ **Busca e filtros** para encontrar repetidoras rapidamente
- ✅ **Design responsivo** para mobile, tablet e desktop
- ✅ **Performance otimizada** - apenas 112KB gzipped

## 🛠️ Tecnologias

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Maps:** Leaflet + React-Leaflet
- **Build:** Vite
- **Deploy:** Vercel

## 📊 Métricas

- **JavaScript:** 356KB (112KB gzipped)
- **CSS:** 64KB (11KB gzipped)
- **HTML:** 1.2KB
- **Total:** ~420KB (muito rápido!)

## 🎯 Como Usar

### Desenvolvimento Local

```bash
# Instalar dependências
pnpm install

# Executar em modo desenvolvimento
pnpm run dev

# Build para produção
pnpm run build

# Preview do build
pnpm run preview
```

### Deploy no Vercel

1. **Fork/clone** este repositório
2. **Conecte** com sua conta Vercel
3. **Deploy automático** - configuração já incluída!

## 📡 Dados de Exemplo

O sistema vem com 2 repetidoras pré-cadastradas:
- **São Paulo (SP):** 145.350 MHz (-600 kHz, Tom 88.5)
- **Rio de Janeiro (RJ):** 146.940 MHz (-600 kHz, Tom 123.0)

## 🔐 Sistema de Autenticação

- **Login:** Indicativo brasileiro (ex: PY2ABC)
- **Registro:** Qualquer indicativo válido
- **Permissões:** Todos os usuários autenticados podem editar/excluir

## 🗺️ Mapa Interativo

- **Visualização:** Todas as repetidoras no mapa do Brasil
- **Popups:** Informações detalhadas ao clicar
- **Zoom:** Navegação completa do mapa
- **Marcadores:** Ícones personalizados para repetidoras

## 📋 Auditoria

Cada repetidora rastreia:
- **Criado por:** Usuário que cadastrou
- **Data de criação:** Timestamp completo
- **Última modificação:** Usuário e data da última edição

## 🎨 Interface

- **Design moderno** com componentes shadcn/ui
- **Tema responsivo** que se adapta a qualquer tela
- **Navegação intuitiva** entre mapa e tabela
- **Formulários validados** para entrada de dados

## 📱 Compatibilidade

- ✅ **Desktop:** Chrome, Firefox, Safari, Edge
- ✅ **Mobile:** iOS Safari, Chrome Mobile
- ✅ **Tablet:** iPad, Android tablets

## 🤝 Contribuições

Contribuições são bem-vindas! Este é um projeto open-source para a comunidade de radioamadores.

## 📄 Licença

MIT License - Use livremente para fins educacionais e comerciais.

---

**Desenvolvido com ❤️ para a comunidade de radioamadores brasileiros**