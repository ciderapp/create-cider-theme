import { input, confirm, select } from "@inquirer/prompts";
import { StyleConfigType, StyleDirectivesType, StyleType, ThemeType } from "./themeTypes";

export async function themeQuestion(ot: ThemeType | null) {
    const theme: ThemeType = { info: {}, style: [] };
    let oldTheme: ThemeType = ot ? (ot as ThemeType) : { info: {}, style: [] };
    let i = 0;

    theme.info.name = await input({
        message: "Name of the theme",
        validate: (value) => (value.length == 0 ? "Please provide a name for the theme" : true),
        default: oldTheme.info.name || "My Theme"
    });
    theme.info.version = await input({
        message: "Version of the theme",
        default: oldTheme.info.version || "1.0.0"
    });
    theme.info.description = await input({
        message: "Description of the theme",
        default: oldTheme.info.description || "A theme for Cider 2"
    });
    theme.info.author = await input({
        message: "Author of the theme",
        default: oldTheme.info.author || "Your Name"
    });
    theme.info.repository = await input({
        message: "Repository of the theme",
        default: oldTheme.info.repository || `${theme.info.author}/${theme.info.name}`
    });
    theme.info.minimumCiderVersion = await input({
        message: "Minimum Cider version",
        default: oldTheme.info.minimumCiderVersion || "2.1.0"
    });
    theme.info.tags = [];
    if (!oldTheme.info.tags) oldTheme.info.tags = [];
    let tagEnd = await confirm({
        message: `Do you want to ${oldTheme.info.tags.length == 0 ? "add" : "edit given"} tags?${oldTheme.info.tags.length == 0 ? "(default is none)" : "(" + oldTheme.info.tags.map((tag) => tag).join(", ") + ")"}`,
        default: false
    });
    if (tagEnd) theme.info.tags = [];
    while (tagEnd == true) {
        theme.info.tags.push(
            await input({
                message: `Tag ${theme.info.tags.length + 1}`,
                validate: (value) => (value.length == 0 ? "Please provide a tag" : true),
                default: oldTheme.info.tags[i] || ""
            })
        );
        i++;
        tagEnd = await confirm({
            message: "Do you want to add another tag?",
            default: false
        });
    }
    theme.style = [];
    if (!oldTheme.style) oldTheme.style = [];
    i = 0;
    do {
        const style: StyleType = {};
        const directives: StyleDirectivesType = {};
        const cfg: StyleConfigType = {};
        let editDirectives: boolean = false;
        console.log("\x1b[1m\x1b[36m%s\x1b[0m", `\n\n${oldTheme.style[i] ? "Editing " + oldTheme.style[i].identifier : `Theme ${+theme.style.length + 1}`}`);
        style.identifier = await input({
            message: "Unique Identifier of the style",
            default: oldTheme.style[i] ? oldTheme.style[i].identifier : theme.info.name.toLowerCase().replace(/ /g, ".") + `${theme.style.length > 0 ? "." + theme.style.length : ""}`,
            validate: (value) => {
                if (theme.style?.find((style) => style.identifier == value)) return "This identifier is already used";
                else if (value.length == 0) return "Please provide an identifier";
                else if (value.includes(" ")) return "The identifier cannot contain spaces, please use dashes instead";
                return true;
            }
        });
        style.name = await input({
            message: "Name of the style",
            default: oldTheme.style[i] ? oldTheme.style[i].name : theme.info.name + `${theme.style.length > 0 ? " " + theme.style.length : ""}`,
            validate: (value) => (value.length == 0 ? "Please provide a name for the style" : true)
        });
        style.description = await input({
            message: "Description of the style",
            default: oldTheme.style[i] ? oldTheme.style[i].description : theme.info.description || "A style for Cider 2",
            validate: (value) => (value.length == 0 ? "Please provide a description for the style" : true)
        });
        style.file = await input({
            message: "File name of the style",
            default: style.identifier + ".scss",
            validate: (value) => {
                if (value.length == 0) return "Please provide a file name for the style";
                if (!value.endsWith(".scss")) return "The file name must end with .scss\nLearn more about Scss at https://sass-lang.com/guide";
                return true;
            }
        });
        editDirectives = await confirm({
            message: "Do you want to edit directives?",
            default: false
        });
        if (!editDirectives) {
            directives.layoutType = oldTheme.style[i]?.directives?.layoutType || "mojave";
            directives.allowCustomAccent = oldTheme.style[i]?.directives?.allowCustomAccent || false;
            directives.allowCustomTint = oldTheme.style[i]?.directives?.allowCustomTint || false;
            console.log("\x1b[1m\x1b[36m%s\x1b[0m", `\nDirectives`);
            Object.entries(directives).forEach(([key, value]) => {
                console.log(`${camelCaseToSpace(key)}: ${value}`);
            });
        } else {
            console.log("\x1b[1m\x1b[36m%s\x1b[0m", `\n${style.identifier} Directives`);
            directives.layoutType = (await select({
                message: "Layout Type",
                choices: [
                    { name: "Mojave", value: "mojave" },
                    { name: "Mavericks", value: "mavericks" }
                ]
            })) as "mojave" | "mavericks";
            directives.allowCustomAccent = await confirm({
                message: "Allow Custom Accent",
                default: false
            });
            directives.allowCustomTint = await confirm({
                message: "Allow Custom Tint",
                default: false
            });
        }
        console.log("type is", typeof oldTheme.style[i].cfg?.vibrancy);
        if (oldTheme.style[i].cfg?.vibrancy === undefined)
            editDirectives = await confirm({
                message: "Do you want to edit theme configuration?",
                default: false
            });
        if (!editDirectives) {
            cfg.vibrancy = oldTheme.style[i]?.cfg?.vibrancy || "mica";
            cfg.editorialLayout = oldTheme.style[i]?.cfg?.editorialLayout || false;
            cfg.useAdaptiveColors = oldTheme.style[i]?.cfg?.useAdaptiveColors || false;
            cfg.layoutView = oldTheme.style[i]?.cfg?.layoutView || "HHh LpR FFf";
            cfg.appearance = oldTheme.style[i]?.cfg?.appearance || "system";
            cfg.chromeTopWidget = oldTheme.style[i]?.cfg?.chromeTopWidget || "none";
            Object.entries(cfg).forEach(([key, value]) => {
                console.log(`${camelCaseToSpace(key)}: ${value}`);
            });
        } else {
            console.log("\x1b[1m\x1b[36m%s\x1b[0m", `\n${style.identifier} Configuration`);
            cfg.vibrancy = (await select({
                message: "Vibrancy Mode" + `${oldTheme.style[i]?.cfg?.vibrancy ? ` (was: ${oldTheme.style[i].cfg?.vibrancy})` : ""}`,
                choices: [
                    { name: "Mica", value: "mica" },
                    { name: "Tabbed Mica", value: "tabbed" },
                    { name: "None (Opaque)", value: "none" }
                ]
            })) as "mica" | "tabbed" | "none";
            cfg.editorialLayout = await confirm({
                message: "Use Editorial Layout",
                default: oldTheme.style[i]?.cfg?.editorialLayout || false
            });
            cfg.useAdaptiveColors = await confirm({
                message: "Use Adaptive Colors",
                default: oldTheme.style[i]?.cfg?.useAdaptiveColors || false
            });
            cfg.layoutView = (await select({
                message: "Layout Style" + `${oldTheme.style[i]?.cfg?.layoutView ? ` (was: ${oldTheme.style[i].cfg?.layoutView})` : ""}`,
                choices: [
                    { name: "HHh LpR FFf", value: "HHh LpR FFf" },
                    { name: "HHh LpR lFf", value: "HHh LpR lFf" },
                    { name: "lHh LpR FFf", value: "lHh LpR FFf" },
                    { name: "lHh LpR lFf", value: "lHh LpR lFf" }
                ]
            })) as "HHh LpR FFf" | "HHh LpR lFf" | "lHh LpR FFf" | "lHh LpR lFf";
            cfg.appearance = (await select({
                message: "Appearance" + `${oldTheme.style[i]?.cfg?.appearance ? ` (was: ${oldTheme.style[i].cfg?.appearance})` : ""}`,
                choices: [
                    { name: "System", value: "system" },
                    { name: "Light", value: "light" },
                    { name: "Dark", value: "dark" }
                ]
            })) as "system" | "light" | "dark";
            cfg.chromeTopWidget = (await select({
                message: "Top Widget" + `${oldTheme.style[i]?.cfg?.chromeTopWidget ? ` (was: ${oldTheme.style[i].cfg?.chromeTopWidget})` : ""}`,
                choices: [
                    { name: "Don't Change (User)", value: "none" },
                    { name: "Tabs", value: "tabs" },
                    { name: "Search Bar", value: "search" }
                ]
            })) as "none" | "tabs" | "search";
        }
        style.cfg = cfg;
        style.directives = directives;
        theme.style.push(style);
    } while (
        await confirm({
            message: "Do you want to add another style?",
            default: false
        })
    );
    return theme;
}

function camelCaseToSpace(str: string) {
    return str.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (s) => s.toUpperCase());
}
