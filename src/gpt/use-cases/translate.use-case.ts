import OpenAI from 'openai';

interface Options {
  prompt: string;
  lang: string;
}

export const translateUseCase = async (openai: OpenAI, {prompt, lang}: Options) => {
 
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
            Traduce el siguiente texto al idioma ${lang}:${prompt}

            Para ello deberas tener en cuenta el idioma en el que te llegue el prompt.
            Podría ser en cualquier idioma del mundo, incluso en lenguas que ya no se usan.
            Si el texto a traducir no tiene sentido deberás proporcionar una respuesta indicando
            que la traducción no es posible debido al problema que detectes.
            `,
      },
    
    ],
    model: 'gpt-4o',
    temperature: 0.2,
    max_tokens: 150,
  });
  
  return {
    message: completion.choices[0].message.content
  }

};
