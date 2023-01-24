import inquirer from "inquirer";

async function askQuestion(message: string) {
    return inquirer
                .prompt({
                    name: 'question_prompt',
                    type: 'input',
                    message: message
                })
                .then((answer)=> Promise.resolve(answer.question_prompt))
                .catch((error)=>Promise.reject(error));
}

async function askChoice(choices: Array<string>) {
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

export { askQuestion, askChoice }