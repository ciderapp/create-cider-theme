import { input, confirm, select } from "@inquirer/prompts";
import { StyleConfigType, StyleType, ThemeType } from "./themeTypes";

export async function themeQuestion() {
    let tagEnd = true;
    const theme: ThemeType = {};
    theme.name = await input({
        message: "Name of the theme",
        validate: (value) => (value.length == 0 ? "Please provide a name for the theme" : true)
    });
    theme.version = await input({
        message: "Version of the theme",
        default: "1.0.0"
    });
    theme.description = await input({
        message: "Description of the theme",
        default: "A theme for Cider 2"
    });
    theme.author = await input({
        message: "Author of the theme",
        default: "your name"
    });
    theme.repository = await input({
        message: "Repository of the theme",
        default: `${theme.author}/${theme.name}`
    });
    theme.minimumCiderVersion = await input({
        message: "Minimum Cider version",
        default: "2.1.0"
    });
    theme.tags = [];
    let addTags = await confirm({
        message: "Do you want to add tags? (default is none)",
        default: false
    });
    while (addTags && tagEnd == true) {
        theme.tags.push(
            await input({
                message: `Tag ${theme.tags.length + 1}`,
                validate: (value) => (value.length == 0 ? "Please provide a tag" : true)
            })
        );
        tagEnd = await confirm({
            message: "Do you want to add another tag?",
            default: false
        });
    }
    theme.isPack = await confirm({
        message: "Is this a theme pack?",
        default: false
    });
    theme.styles = [];
    do {
        const style: StyleType = {};
        const cfg: StyleConfigType = {};
        let editDirectives: boolean = false;
        if(theme.isPack) console.log('\x1b[1m\x1b[36m%s\x1b[0m', `\n\nTheme ${theme.styles.length + 1}`);
        style.identifier = await input({
            message: "Identifier (unique) of the style",
            default: theme.isPack ? `${theme.name}-${theme.styles.length + 1}` : theme.name,
            validate: (value) => {
                if (theme.styles?.find((style) => style.identifier == value)) return "This identifier is already used";
                else if (value.length == 0) return "Please provide an identifier";
                else if (value.includes(" ")) return "The identifier cannot contain spaces, please use dashes instead";
                return true;
            }
        });
        style.name = await input({
            message: "Name of the style",
            default: theme.isPack ? `${theme.name} ${theme.styles.length + 1}` : theme.name,
            validate: (value) => (value.length == 0 ? "Please provide a name for the style" : true)
        });
        style.description = await input({
            message: "Description of the style",
            default: !theme.isPack ? theme.description : "",
            validate: (value) => (value.length == 0 ? "Please provide a description for the style" : true)
        });
        style.fileName = await input({
            message: "File name of the style",
            default: style.identifier + ".css"
        });
        editDirectives = await confirm({
            message: "Do you want to edit directives?",
            default: false
        });
        if (!editDirectives) {
            cfg.layoutType = "mojave";
            cfg.allowCustomAccent = false;
            cfg.allowCustomTint = false;
        } else {
            console.log('\x1b[1m\x1b[36m%s\x1b[0m', `\n${style.identifier} Directives`);
            cfg.layoutType = (await select({
                message: "Layout Type",
                choices: [
                    { name: "Mojave", value: "mojave" },
                    { name: "Mavericks", value: "mavericks" }
                ]
            })) as "mojave" | "mavericks";
            cfg.allowCustomAccent = await confirm({
                message: "Allow Custom Accent",
                default: false
            });
            cfg.allowCustomTint = await confirm({
                message: "Allow Custom Tint",
                default: false
            });
        }
        console.log('\x1b[1m\x1b[36m%s\x1b[0m', `\n${style.identifier} Configuration`);
        cfg.vibrancy = (await select({
            message: "Vibrancy Mode",
            choices: [
                { name: "Mica", value: "mica" },
                { name: "Tabbed Mica", value: "tabbed" },
                { name: "None (Opaque)", value: "none" }
            ]
        })) as "mica" | "tabbed" | "none";
        cfg.editorialLayout = await confirm({
            message: "Use Editorial Layout",
            default: false
        });
        cfg.useAdaptiveColors = await confirm({
            message: "Use Adaptive Colors",
            default: false
        });
        cfg.layoutView = (await select({
            message: "Layout Style",
            choices: [
                { name: "HHh LpR FFf", value: "HHh LpR FFf" },
                { name: "HHh LpR lFf", value: "HHh LpR lFf" },
                { name: "lHh LpR FFf", value: "lHh LpR FFf" },
                { name: "lHh LpR lFf", value: "lHh LpR lFf" }
            ]
        })) as "HHh LpR FFf" | "HHh LpR lFf" | "lHh LpR FFf" | "lHh LpR lFf";
        cfg.appearance = (await select({
            message: "Appearance",
            choices: [
                { name: "System", value: "system" },
                { name: "Light", value: "light" },
                { name: "Dark", value: "dark" }
            ]
        })) as "system" | "light" | "dark";
        cfg.chromeTopWidget = (await select({
            message: "Top Widget",
            choices: [
                { name: "Don't Change (User)", value: "none" },
                { name: "tabs", value: "tabs" },
                { name: "Search Bar", value: "search" }
            ]
        })) as "none" | "tabs" | "search";
        style.cfg = cfg;
        theme.styles.push(style);
    } while (
        theme.isPack &&
        (await confirm({
            message: "Do you want to add another style?",
            default: false
        }))
    );
    return theme;
}
