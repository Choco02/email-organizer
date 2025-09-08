# Email organizer
> Um classificador de importância de e-mails impulsionado por IA

# Como rodar o projeto
Mude o nome do arquivo `.env.example` para `.env` e preencha o GEMINI_API_KEY com sua chave do Gemini que você pode conseguir [aqui](https://aistudio.google.com/app/apikey)
## (Recomendado) Usando Vercel CLI
- Rode o comando `vercel dev`, se necessário logue com sua conta da Vercel

## Rodando com Flask
- Instale as dependências do projeto com o comando `pip install -r requirements.txt`
- **Talvez** seja necessário (em caso de erro) modificar o import `from .ai_models import model` para `from ai_models import model` (apenas remova o ponto da frente) do index.py linha 8


# Possíveis dúvidas
- Onde posso ver a aplicação rodando? https://eeemail.vercel.app/
- Como faço pra usar outro model? Crie um arquivo com o nome que você quiser na pasta ai_models, por exemplo openai, faça lá a função ask que vai receber uma string e que vai repassar para o prompt do modelo e o retorno dessa função vai devolver o resultado para a função ask, depois só mudar no arquivo model.py de qual arquivo tá sendo importado a função ask. Não esquecer de configurar possíveis variáveis de ambiente e importar o instructions_pt para o prompt inicial do modelo
