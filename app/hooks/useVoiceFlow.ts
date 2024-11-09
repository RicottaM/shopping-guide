// useVoiceFlow.ts
import { useSpeechFlow } from './useSpeechFlow';

export const useVoiceFlow = () => {
    const { speak, listen } = useSpeechFlow();

    const traverseFlow = async (
        flow: any,
        currentNodeKey: string,
        context: any = {},
        onContextUpdate?: (context: any) => void
    ) => {
        let currentNodeKeyLocal = currentNodeKey;

        while (currentNodeKeyLocal) {
            const currentNode = flow[currentNodeKeyLocal];

            // Speak the message
            const message =
                typeof currentNode.message === 'function' ? currentNode.message(context) : currentNode.message;
            await speak(message);

            // Perform action if it exists
            if (currentNode.action) {
                const actionResult = await currentNode.action(context);

                // If action returns a next node key, navigate to that node
                if (typeof actionResult === 'string') {
                    currentNodeKeyLocal = actionResult;
                    continue;
                }

                // If action navigates away (e.g., navigation action), exit the flow
                break;
            }

            // Handle repeat
            if (currentNode.repeat) {
                currentNodeKeyLocal = currentNode.repeat;
                continue;
            }

            // Handle user responses
            if (currentNode.options || currentNode.onResponse) {
                try {
                    const userResponse = await listen();

                    if (!userResponse) {
                        // Handle silence
                        if (currentNode.onSilence) {
                            currentNodeKeyLocal = currentNode.onSilence;
                            continue;
                        } else {
                            // No silence handler, exit the flow
                            break;
                        }
                    }

                    const normalizedResponse = userResponse.toLowerCase();

                    // Handle options
                    if (currentNode.options) {
                        const matchedOption = currentNode.options.find((option: any) =>
                            normalizedResponse.includes(option.command)
                        );

                        if (matchedOption) {
                            currentNodeKeyLocal = matchedOption.next;
                            continue;
                        } else {
                            if (currentNode.onFailure) {
                                currentNodeKeyLocal = currentNode.onFailure;
                                continue;
                            } else {
                                // No failure handler, exit the flow
                                break;
                            }
                        }
                    } else if (currentNode.onResponse) {
                        // Save user response in context
                        const responseKey = currentNode.onResponseKey || currentNodeKeyLocal;
                        context[responseKey] = userResponse;

                        // **Call the onContextUpdate callback**
                        if (onContextUpdate) {
                            onContextUpdate({ ...context }); // Spread to create a new object
                        }

                        currentNodeKeyLocal = currentNode.onResponse;
                        continue;
                    }
                } catch (error) {
                    // Handle errors (e.g., timeout)
                    if (currentNode.onSilence) {
                        currentNodeKeyLocal = currentNode.onSilence;
                        continue;
                    } else {
                        // No silence handler, exit the flow
                        break;
                    }
                }
            } else if (currentNode.next) {
                currentNodeKeyLocal = currentNode.next;
                continue;
            } else {
                // No next node, exit the flow
                break;
            }
        }

        return context;
    };

    return { traverseFlow };
};