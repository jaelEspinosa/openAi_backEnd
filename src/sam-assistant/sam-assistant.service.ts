import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { checkCompleteStatusCompleteUseCase, createMessageUseCase, createRunUseCase, createThreadUseCase, getMessageListUseCase } from './use-cases';
import { QuestionDto } from './dtos/question.dto';

@Injectable()
export class SamAssistantService {

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

    async createThread(){
       return await createThreadUseCase( this.openai )
    };


    async userQuestion( questionDto:QuestionDto) {
        const { threadId, question } = questionDto;

        const message = await createMessageUseCase(this.openai, { threadId, question })

        const run = await createRunUseCase( this.openai, { threadId })

        await checkCompleteStatusCompleteUseCase ( this.openai, {runIld: run.id, threadId})
        
        const messages =  getMessageListUseCase (this.openai,{ threadId }  )
        
        return messages;
    }
}
