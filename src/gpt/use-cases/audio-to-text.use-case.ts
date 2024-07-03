import OpenAI from "openai";
import * as fs from 'fs';


interface Options {
    prompt?: string;
    audioFile: Express.Multer.File;
}


export const audioToTextCase = async ( openai: OpenAI, options: Options) => {
    const {prompt, audioFile} = options;

    

    const response = await openai.audio.transcriptions.create({
        model:'whisper-1',
        file: fs.createReadStream( audioFile.path ),
        prompt: prompt, //mimsmo idioma del audio.
        language: 'es',
        //response_format:'vtt'
        response_format:'verbose_json',
       })
    console.log({response});
    return response;
}