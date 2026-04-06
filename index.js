#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";
import { getProjectFiles, getProjectType } from "./projectFiles.js";
import { generateReadMe } from "./hf_ai.js";

const program = new Command()
program
    .name("better-readme")
    .description("Generate a comprehensive readme.md file for your project")
    .version("1.0.0")

program.action(async () => {
    const files = getProjectFiles()
    const projectType = getProjectType(files)

    const answers = await inquirer.prompt([
        {type: "input", name: "title", message: "Project Title: "},
        {type: "checkbox", name: "sections", message: "Choose which sections to include in your ReadMe file",
            choices: [
                {name: "Features", value: "Features"},
                {name: "Tools Used", value: "Tools Used"},
                {name: "Languages Used", value: "Languages Used"},
                {name: "Installation", value: "Installation"},
                {name: "FAQ", value: "FAQ"}
            ]
        },
        {type: "confirm", name: "confirmType", message: `Detected project type of: ${projectType}. Is this correct?`, default: true}
    ])
    await generateReadMe(answers, projectType, files)
})
program.parse()