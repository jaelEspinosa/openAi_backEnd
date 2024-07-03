import * as path from 'path';
import * as fs from "fs";

import { Injectable, NotFoundException } from '@nestjs/common';
import {
  orthographyCheckUseCase,
  prosconsDiscusserStreamUseCase,
  prosconsDiscusserUseCase,
  textToAudioUseCase,
  translateUseCase,
} from './use-cases';
import { OrthographyDto, ProsConsDiscusserDto, TextToaudioDto, TranslateDto } from './dtos';
import OpenAI from 'openai';


@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  //solo va llamar casos de uso
  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {
      prompt: orthographyDto.prompt,
    });
  }
  async prosConsDiscusser(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await prosconsDiscusserUseCase(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
    });
  }
  async prosConsDiscusserStream(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await prosconsDiscusserStreamUseCase(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
    });
  }

  async translate({prompt, lang}: TranslateDto) {
    return await translateUseCase(this.openai, { prompt, lang });
  }

  async textToAudio({prompt, voice}: TextToaudioDto) {
    return await textToAudioUseCase(this.openai, { prompt, voice });
  }
  
  
  async textToAudioGet(fileId: string) {
  
    const filePath = path.resolve(__dirname, '../../generated/audios/', `${fileId }.mp3`)
    
    const wasFound = fs.existsSync( filePath );
    if(!wasFound) throw new NotFoundException(`El archivo ${fileId}, no se ha encontrador.`);
    
    return filePath;
  
  }

}
