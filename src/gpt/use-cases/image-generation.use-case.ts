import OpenAI from "openai";
import { downloadBase64ImageAsPng, downloadImageAsPng } from "src/helpers";
import * as fs from 'fs';
import * as path from 'path';

interface Options {
    prompt: string;
    originalImage?: string;
    maskImage?: string;
}

export const imageGenerationUseCase = async (openAi: OpenAI, options:Options) => {
  const { prompt, originalImage, maskImage } = options;

  //  verificar original image
  if( !originalImage || !maskImage ) {
    const response = await openAi.images.generate({
        prompt: prompt,
        model: 'dall-e-3',
        n: 1,
        size: '1024x1024',
        response_format: 'url'
      }); 
      // guardar la imagen en Fs.
     await downloadImageAsPng( response.data[0].url);  
     const imageName = await downloadImageAsPng ( response.data[0].url)
     const url = `${process.env.SERVER_URL}/gpt/image-generation/${ imageName }`
  
    return {
      url: url,
      openAIUrl: response.data[0].url,
      revised_prompt: response.data[0].revised_prompt
    }

  }

const pngImagePath = await downloadImageAsPng( originalImage, true );
const maskPath = await downloadBase64ImageAsPng ( maskImage, true );

const response = await openAi.images.edit({
  prompt: prompt,
  model:'dall-e-2',
  image:fs.createReadStream( pngImagePath ),
  mask: fs.createReadStream( maskPath ),
  n: 1,
  size:'1024x1024',
  response_format: 'url'
})

const imageName = await downloadImageAsPng ( response.data[0].url)
const url = `${process.env.SERVER_URL}/gpt/image-generation/${ imageName }`


return {
  url, 
  openAIUrl: response.data[0].url,
  revised_prompt: response.data[0].revised_prompt
}
}