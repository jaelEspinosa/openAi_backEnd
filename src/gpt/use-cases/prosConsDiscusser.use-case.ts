import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const prosconsDiscusserUseCase = async (
  openai: OpenAI,
  { prompt }: Options,
) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
                Se te dará una pregunta y tu tarea es dar una respuesta con ventajas y desventajas (pros y contras),
                la respuesta deber ser en formato markdown, los pros y contras deberán estar en una lista.               
                `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'gpt-4o',
    temperature: 0.8,
    max_tokens: 500,
  });
  // console.log(completion);

  return completion.choices[0].message;
};
