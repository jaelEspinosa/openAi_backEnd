import OpenAI from "openai";



interface Options {
   threadId: string;
   runIld: string;
}


export const checkCompleteStatusCompleteUseCase =async ( openai: OpenAI, options: Options ) => {


    const { threadId, runIld } = options;

    const runStatus = await openai.beta.threads.runs.retrieve(
        threadId,
        runIld
    );

    console.log( { status: runStatus.status }) // completed


    if( runStatus.status === 'completed' ) {
        return runStatus;
    } 
// esperar un segundo

    await new Promise ( resolve => setTimeout( resolve, 1000 ));
    
    return await checkCompleteStatusCompleteUseCase( openai, options );
}