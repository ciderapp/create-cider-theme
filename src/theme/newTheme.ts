#! /usr/bin/env node
import { themeQuestion } from "./themeQuestion.js";
import { ThemeType } from "./themeTypes";
import { mkdir, writeFile, readFile } from "fs/promises";
import "dotenv/config";


const version: string = JSON.parse(await readFile("package.json", { encoding: "utf-8" })).version;
console.log('\x1b[1m\x1b[36m%s\x1b[0m', "Create Cider Theme v" + version);
const theme = await themeQuestion();

// console.log(theme);

await writeFile("theme.toml", convertToTOML(theme), { encoding: "utf-8" })
.then(() => {
    console.log("Theme file created successfully!", process.cwd() + "\\theme.toml");
})
.catch((err: Error) => {
    console.error(err);
});

await mkdir("styles").catch((err: Error) => {
    console.error(err);
});
theme.styles?.forEach(async (style) => {
    await writeFile(`styles/${style.fileName}`, "/* TODO: write css for file */", { encoding: "utf-8" })
    .then(() => {
        console.log("Style file created successfully!", process.cwd() + `\\styles\\${style.fileName}`);
    })
    .catch((err: Error) => {
        console.error(err);
    });
});



function convertToTOML(theme: ThemeType) {
    let toml: string =
        `# Created with Create Cider Theme v${version}\n` +
        `[info]\n` +
        `name = "${theme.name}"\n` +
        `version = "${theme.version}"\n\n` +
        `# Description of the theme\n` +
        `description = "${theme.description}"\n\n` +
        `# The author of the theme\n` +
        `author = "${theme.author}"\n\n` +
        `# Github repo\n` +
        `repository = "${theme.repository}"\n\n` +
        `# The minimum version of Cider required to use this theme\n` +
        `minimumCiderVersion = "${theme.minimumCiderVersion}"\n\n` +
        `# Tags to help users know what this theme is about\n` +
        `tags = [${theme.tags?.map((tag) => `"${tag}"`).join(", ")}]\n\n` +
        `# Included Styles\n\n`;

    theme.styles?.forEach((style) => {
        toml +=
            `[[style]]\n` +
            `identifier = "${style.identifier}"\n` +
            `name = "${style.name}"\n` +
            `description = "${style.description}"\n` +
            `file = "${style.fileName}"\n\n` +
            `[style.directives]\n` +
            `layout_type = "${style.cfg?.layoutType}"\n` +
            `allow_custom_accent = ${style.cfg?.allowCustomAccent}\n` +
            `allow_custom_tint = ${style.cfg?.allowCustomTint}\n\n` +
            `[style.cfg]\n` +
            `visual-vibrancyMode = "${style.cfg?.vibrancy}"\n` +
            `visual-editorialLayout = ${style.cfg?.editorialLayout}\n` +
            `visual-useAdaptiveColors = ${style.cfg?.useAdaptiveColors}\n` +
            `visual-layoutView = "${style.cfg?.layoutView}"\n` +
            `visual-appearance = "${style.cfg?.appearance}"\n` +
            `visual-chromeTopWidget = "${style.cfg?.chromeTopWidget}"\n\n`;
    });

    return toml;
}
