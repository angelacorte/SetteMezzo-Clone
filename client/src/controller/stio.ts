import inquirer from "inquirer";

/**
 * Prompts the user with the given message, waiting for user input
 * @param message The message to prompt to the user
 * @param questionType The type of the question
 * @returns The value of the user response
 */
async function askWithMessage(message: string, questionType: any) {
    return inquirer
                .prompt({
                    name: 'question_prompt',
                    type: questionType,
                    message: message
                })
                .then((answer)=> Promise.resolve(answer.question_prompt))
                .catch((error)=>Promise.reject(error));
}

/**
 * Prompts the user with a question, waiting for a string response
 * @param message The prompt message
 * @returns The user response
 */
async function askQuestion(message: string): Promise<string> {
    return askWithMessage(message, 'input')
}

/**
 * Prompts the user with a question, waiting for a numeric response
 * @param message The prompt message
 * @returns The user response
 */
async function askNumber(message: string): Promise<number> {
    return askWithMessage(message, 'number')
}

/**
 * Prompts the user for a choice
 * @param choices The choices to prompt to the user
 * @returns The user choice
 */
async function askChoice(choices: Array<string>): Promise<string> {
    return inquirer
                .prompt({
                    name: 'choice_prompt',
                    message: 'Please, choose:',
                    type: 'rawlist',
                    choices: choices
                })
                .then((answer) => Promise.resolve(answer.choice_prompt))
                .catch((error)=> Promise.reject(error));
}

/**
 * Asks the user for confirmation
 * @param message The message to prompt
 * @returns The yes/no answer
 */
async function askConfirmation(message: string): Promise<boolean> {
    return askWithMessage(message, 'confirm')
}

export { askQuestion, askChoice, askConfirmation, askNumber }
