# School Helper — Aventura da Tabuada

Projeto web pensado para apoiar o ensino em escolas públicas de forma **lúdica e acessível**. A ideia é oferecer uma ferramenta simples que professores, responsáveis e alunos possam usar no dia a dia para reforçar conteúdos básicos de matemática — começando pela tabuada — com uma experiência divertida, visual e motivadora para crianças.

## Sobre o projeto

O **School Helper** nasce como um auxiliar digital para a sala de aula e para o estudo em casa. Em contextos de ensino público, muitas vezes faltam recursos interativos gratuitos e fáceis de usar; este aplicativo busca preencher essa lacuna com uma página única, sem cadastro e sem complicação: a criança escolhe um número, vê a tabuada, pratica em desafios e recebe feedback imediato.

O foco está no **aprendizado por brincadeira**: mascote com mensagens de incentivo, cores vivas, sistema de estrelas, barra de progresso e celebração ao completar os exercícios. Erros são tratados com gentileza, mostrando a resposta correta para que o aluno possa tentar de novo e aprender no próprio ritmo.

## Funcionalidades

- **Tabuada interativa** — escolha um número (digitando ou pelos atalhos de 2 a 10) e visualize a tabuada de 1 até 10 com linhas coloridas.
- **Desafios de multiplicação** — exercícios aleatórios usando o número escolhido; o aluno informa a resposta e confere se acertou.
- **Gamificação leve** — estrelas por acerto, progresso da rodada e confete ao completar todos os desafios.
- **Linguagem infantil** — textos e feedback pensados para crianças em idade escolar.

## Tecnologias

- [Next.js](https://nextjs.org) (App Router)
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)

## Como executar

Instale as dependências e inicie o servidor de desenvolvimento:

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Outros comandos

```bash
npm run build   # gera a versão de produção
npm run start   # executa a versão de produção
npm run lint    # verifica o código com ESLint
```

## Estrutura principal

| Caminho | Descrição |
|---------|-----------|
| `app/page.tsx` | Página principal com tabuada, desafios e elementos lúdicos |
| `app/layout.tsx` | Layout global e metadados da aplicação |
| `app/globals.css` | Estilos globais e animações |

## Público-alvo

Professores e educadores que desejam um recurso complementar em matemática; famílias que apoiam o estudo em casa; e **alunos do ensino fundamental** que estão aprendendo ou revisando a tabuada.

## Contribuindo

Sugestões e melhorias são bem-vindas — por exemplo, novos módulos (adição, divisão), modos de jogo ou acessibilidade. O projeto está em evolução e pode crescer conforme as necessidades da escola e da comunidade.

## Licença

Projeto de uso educacional. Consulte o repositório para informações sobre licenciamento, se aplicável.
