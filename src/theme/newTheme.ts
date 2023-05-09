#! /usr/bin/env node
import process from "node:process";
import { themeQuestion } from "./themeQuestion.js";
import { ThemeType } from "./themeTypes";
import { mkdir, writeFile, readFile } from "fs/promises";
import { parse } from "toml";

const version: string = JSON.parse(await readFile(process.argv[1] + '../../../package.json', { encoding: "utf-8" })).version;
console.log('\x1b[1m\x1b[36m%s\x1b[0m', "Create Cider Theme v" + version);

let theme: ThemeType | null = null;
let themeFile: string | null = await readFile("theme.toml", { encoding: "utf-8" }).catch(() => null);

if(themeFile) {
    console.log("Found theme.toml file, editing it");
    theme = parse(themeFile);
}

// console.log(theme);
theme = await themeQuestion(theme);

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
theme.style?.forEach(async (style) => {
    await writeFile(`styles/${style.file}`, "/* TODO: write css for file */", { encoding: "utf-8" })
    .then(() => {
        console.log("Style file created successfully!", process.cwd() + `\\styles\\${style.file}`);
    })
    .catch((err: Error) => {
        console.error(err);
    });
});



function convertToTOML(theme: ThemeType) {
    let toml: string =
        `# Created with Create Cider Theme v${version}\n` +
        `[info]\n` +
        `name = "${theme.info.name}"\n` +
        `version = "${theme.info.version}"\n\n` +
        `# Description of the theme\n` +
        `description = "${theme.info.description}"\n\n` +
        `# The author of the theme\n` +
        `author = "${theme.info.author}"\n\n` +
        `# Github repo\n` +
        `repository = "${theme.info.repository}"\n\n` +
        `# The minimum version of Cider required to use this theme\n` +
        `minimumCiderVersion = "${theme.info.minimumCiderVersion}"\n\n` +
        `# Tags to help users know what this theme is about\n` +
        `tags = [${theme.info.tags?.map((tag) => `"${tag}"`).join(", ")}]\n\n` +
        `# Included Styles\n\n`;

    theme.style?.forEach((style) => {
        toml +=
            `[[style]]\n` +
            `identifier = "${style.identifier}"\n` +
            `name = "${style.name}"\n` +
            `description = "${style.description}"\n` +
            `file = "${style.file}"\n\n` +
            `[style.directives]\n` +
            `layout_type = "${style.directives?.layoutType}"\n` +
            `allow_custom_accent = ${style.directives?.allowCustomAccent}\n` +
            `allow_custom_tint = ${style.directives?.allowCustomTint}\n\n` +
            `[style.cfg]\n` +
            `"visual.vibrancyMode" = "${style.cfg?.vibrancy}"\n` +
            `"visual.editorialLayout" = ${style.cfg?.editorialLayout}\n` +
            `"visual.useAdaptiveColors" = ${style.cfg?.useAdaptiveColors}\n` +
            `"visual.layoutView" = "${style.cfg?.layoutView}"\n` +
            `"visual.appearance" = "${style.cfg?.appearance}"\n` +
            `"visual.chromeTopWidget" = "${style.cfg?.chromeTopWidget}"\n\n`;
    });

    return toml;
}
