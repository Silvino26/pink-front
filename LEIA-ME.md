# Pink · front

Cada tela é uma página:

| Página | O que é | Quem chega nela |
| --- | --- | --- |
| `entrar.html` | Login | Quem abre o sistema sem estar logado (qualquer página manda para cá) |
| `esqueci-senha.html` | Pedir nova senha | Link "Esqueci minha senha" |
| `nova-senha.html` | Criar nova senha | Link do e-mail de nova senha |
| `primeiro-acesso.html` | Criar o acesso | Link do e-mail enviado depois do pagamento da assinatura e do convite de usuária |
| `ajuda-acesso.html` | Não consigo acessar | Link na tela de login |
| `painel.html` | Painel | Depois do login |
| `clientes.html` | Clientes e ficha do devedor | Menu |
| `estrategia.html` | Régua, resultados e envios | Menu |
| `fechamentos.html` | Fechamentos | Menu |
| `configuracoes.html` | Configurações | Menu |
| `plano.html` | Plano | Menu |
| `ajuda.html` | Ajuda | Menu |
| `index.html` | Abre o painel (ou o login, se não estiver logado) | Endereço principal |

`assets/` tem o visual (`pink.css`) e o funcionamento (`pink.js`), compartilhados por todas as páginas.

## Ligar ao banco

Preencher `config.js` com o endereço e a chave pública do Supabase. Sem isso, o front funciona em modo demonstração (qualquer e-mail e senha entram, com dados de exemplo).

No Supabase, em Authentication → URL Configuration:
- Site URL: o endereço do front (ex.: `https://app.pink.com.br`)
- Redirect URLs: `https://app.pink.com.br/nova-senha.html` e `https://app.pink.com.br/primeiro-acesso.html`

Assim o e-mail de nova senha abre `nova-senha.html` e o convite abre `primeiro-acesso.html`, já com a pessoa identificada.
