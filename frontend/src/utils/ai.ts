import { pipeline, env, SummarizationPipeline as XenovaSummarizationPipeline } from '@xenova/transformers';

/**
 * A singleton class to manage the text summarization pipeline from transformers.js.
 * This ensures the model is loaded only once.
 */
class SummarizationPipeline {
    static task = 'summarization' as const;
    // Xenova/distilbart-cnn-6-6 is optimized for speed/size in browser environments
    static model = 'Xenova/distilbart-cnn-6-6';
    static instance: XenovaSummarizationPipeline | null = null;

    static async getInstance(progress_callback?: (progress: any) => void) {
        if (this.instance === null) {
            try {
                env.allowLocalModels = false;
                env.allowRemoteModels = true;

                console.log(`Loading summarization model: ${this.model}`);
                
                this.instance = await pipeline(this.task, this.model, {
                    quantized: true,
                    progress_callback,
                }) as XenovaSummarizationPipeline;
                
                console.log('Summarization model loaded successfully.');

            } catch (error) {
                console.error('Failed to load summarization model:', error);
                throw error;
            }
        }
        return this.instance;
    }
}

interface SummarizationResult {
    summary_text: string;
}

export interface ChatMessage {
    Author: string;
    Body: string;
}

export async function summarize(
    messages: ChatMessage[], 
    progress_callback?: (progress: any) => void,
    conversationId?: string
): Promise<string | null> {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        console.warn('Summarization skipped: Input must be a non-empty array of messages.');
        return null;
    }

    try {
        // Format the chat data into a clean transcript
        const transcript = messages
            .map(msg => `${msg.Author}: ${msg.Body}`)
            .join('\n');

        // DistilBART is a news summarizer. It responds best when we frame the input
        // as a document to be summarized rather than a chat with complex instructions.
        const textToSummarize = `Conversation Log:\n${transcript}\n\nSummary of discussion topics and key points:`;

        console.log(`Starting summarization for conversation ${conversationId || 'unknown'}`);
        console.log(`Input text length: ${textToSummarize.length} characters`);
        
        // LOGGING: Check what we are sending to the model
        console.groupCollapsed('AI Input Transcript');
        console.log(textToSummarize);
        console.groupEnd();
        
        if (!conversationId) {
            console.log('Skipping summarization: No conversation ID provided');
            return null;
        }
        
        const generator = await SummarizationPipeline.getInstance(progress_callback);
        if (!generator) {
            throw new Error('Failed to initialize summarization model.');
        }
        
        console.log('Model ready, running inference...');
        const startTime = performance.now();

        // Generate the summary
        const output = await generator(textToSummarize, {
            max_length: 150, // Keep it punchy
            min_length: 40,  // Ensure enough substance
            do_sample: false, // Deterministic output is usually better for summarization
        }) as SummarizationResult[];

        const endTime = performance.now();
        console.log(`Inference completed in ${((endTime - startTime) / 1000).toFixed(2)}s`);
        
        // LOGGING: Check the raw output
        console.log('Raw Model Output:', output);
        
        if (!output || output.length === 0 || !output[0].summary_text) {
            throw new Error('Generated summary is empty or invalid.');
        }
        
        const summaryText = output[0].summary_text;
        console.log('Final Summary:', summaryText);
        return summaryText;
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Summarization error:', {
            error: errorMessage,
            stack: error instanceof Error ? error.stack : 'No stack trace',
            messagesCount: messages?.length,
        });
        return null;
    }
}