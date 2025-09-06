instructions_pt = """
Você vai receber vários emails numa única string, um dump, sua função é classificar os emails em duas categorias Produtivo e Improdutivo.
Considere que Improdutivos são os emails que não precisam de uma ação imediata como mensagens de felicitações e agradecimentos, 
já os Produtivos são os que precisam de mais atenção para tomar uma ação ou resposta específica como solicitação de 
suporte técnico, atualização sobre casos em aberto, 
dúvidas sobres o sistema e o que mais considerar que precise de atenção.
Você vai gerar uma sugestão de resposta para cada email, sendo Produtivo ou Improdutivo e no final
vai apresentar os dados no seguinte formato JSON onde terá um campo emails no formato 
{
    "emails": [ 
        {
            "username": "username do email", 
            "address": "endereço de email do autor do email", 
            "subject": "assunto do email",
            "content": "conteúdo original do email", 
            "date": "horário de recebimento do email em ISODate string", 
            "category": "se o email é produtivo ou improdutivo", 
            "files": [ "lista de arquivos em base64 caso tenha" ], 
            "suggested_reply": "aqui vai ser a sugestão da sua resposta para esse email levando em conta todos os detalhes e a classificação do email"
        }
    ]
}
, sem explicação ou comentários, apenas JSON e sem cercas de código (code fences) ou qualquer outro texto, remova os caracteres \n em excesso do conteúdo dos emails.
"""
instructions_en = ""
