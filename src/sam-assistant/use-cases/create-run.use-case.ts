import OpenAI from "openai";

interface Options {
    threadId: string;
    assistantId?: string;
}

export const createRunUseCase = async ( openai: OpenAI,  options: Options) => {

    const {threadId, assistantId = 'asst_oCpDUru9Ru32lwIHVkwXLhwU'} = options;

    const run = await openai.beta.threads.runs.create( threadId, {
        assistant_id: assistantId,
        // instructions: //!sobre escribe el asistente
    });

    

    return run;
}