import inquirer from "inquirer";

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

async function askQuestion(message: string): Promise<string> {
    return askWithMessage(message, 'input')
}

async function askNumber(message: string): Promise<number> {
    return askWithMessage(message, 'number')
}

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

async function askConfirmation(message: string): Promise<boolean> {
    return askWithMessage(message, 'confirm')
}

export { askQuestion, askChoice, askConfirmation, askNumber }
