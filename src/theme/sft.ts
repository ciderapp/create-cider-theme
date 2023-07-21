import { buildCSS } from "./pcss.js"
import { readFileSync, existsSync } from "fs"
import { getWorkingDir } from "./utils"
import { join } from "path"

export type ThemeDef = {
    name: string
    identifier: string
    styles: StyleDef[]
}

export type StyleDef = {
    name: string
    entry: string
}

export type ComputedStyle = {
    name: string
    css: string
}

export type ComputedSFT = {
    identifier: string
    bundle: {
        name: string
    }
    styles: ComputedStyle[]
    warnings?: string[]
}

export async function generateSFTJson(theme: ThemeDef, inlineAssets: boolean = true) {
    const root: ComputedSFT = {
        identifier: theme.identifier,
        bundle: {
            name: theme.name,
        },
        styles: [],
    }
    root['bundle'] = {
        name: theme.name
    }

    const workingDir = getWorkingDir()

    await Promise.all(theme.styles.map(async style => {

        if (!existsSync(join(workingDir, style.entry))) {
            console.warn(`Style entry ${style.entry} does not exist`)
            if (!root.warnings) root.warnings = []
            root.warnings.push(`Style entry ${style.entry} does not exist`)
            return
        }

        const css = await buildCSS({
            workingDir: workingDir,
            inlineAssets,
            styleDef: style
        })

        root.styles.push({
            name: style.name,
            css: css.css
        })
    }))

    return root
}