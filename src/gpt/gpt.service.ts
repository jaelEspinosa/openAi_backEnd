import * as path from 'path';
import * as fs from "fs";

import { Injectable, NotFoundException } from '@nestjs/common';
import {
  audioToTextCase,
  imageGenerationUseCase,
  imageVariationUseCase,
  orthographyCheckUseCase,
  prosconsDiscusserStreamUseCase,
  prosconsDiscusserUseCase,
  textToAudioUseCase,
  translateUseCase,
} from './use-cases';
import { AudioToTextDto, ImageGenerationDto, ImageVariationDto, OrthographyDto, ProsConsDiscusserDto, TextToaudioDto, TranslateDto } from './dtos';
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
    if(!wasFound) throw new NotFoundException(`El archivo ${fileId}, no se ha encontrado.`);
    
    return filePath;
  
  }

  async audioToText(audioFile: Express.Multer.File, {prompt}: AudioToTextDto) {
     return await audioToTextCase( this.openai, { audioFile, prompt });
  }

  async imageGeneration( imageGenerationDto: ImageGenerationDto) {
    return await imageGenerationUseCase(this.openai, {...imageGenerationDto})
  }

  async imageGenerationGet( fileName: string ) {
    const imagePath = path.resolve(__dirname, '../../generated/images', `${ fileName }`)

    const wasFound = fs.existsSync ( imagePath );

    if(!wasFound) throw new NotFoundException( `El archivo ${ fileName }, no existe.`)
    
      return imagePath;
  }


  async generateImageVariation ( { baseImage }: ImageVariationDto) {
    return imageVariationUseCase( this.openai, { baseImage })
  }
}
