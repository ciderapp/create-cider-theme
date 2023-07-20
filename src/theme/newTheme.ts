#! /usr/bin/env node
import process, { cwd } from "node:process";
import yargs from "yargs"
import { CLIArgs } from "./cli-args";
import { join } from 'path'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { generateSFTJson } from "./sft";
import Koa from 'koa'
import { PassThrough } from 'node:stream';
import chokidar from "chokidar";

const args = yargs.argv as CLIArgs
const workingDir = args.input ?? process.cwd()

const looseArgs = args._ as string[]

function getTheme() {
    const fileData = readFileSync(join(workingDir, 'theme.json'), { encoding: 'utf-8' })
    const theme: any = JSON.parse(fileData)

    return theme
}

async function main() {
    const theme = getTheme()
    if (!theme) {
        console.error("No theme.json found in working directory")
        process.exit(1)
    }
    console.log(theme)
    // return

    console.log(`This themes name is ${theme?.name ?? 'null'}`)

    if (looseArgs.includes('compile')) {
        const sft = await generateSFTJson(theme, true)

        // check if dist exists
        if (!existsSync(join(workingDir, 'dist'))) {
            mkdirSync(join(workingDir, 'dist'))
        }

        writeFileSync(join(workingDir, 'dist/theme.sft'), JSON.stringify(sft))

        console.log("Done")

        process.exit(0)
    }

    if (looseArgs.includes('serve')) {
        console.log("Starting server")
        createServer()

    }
}


function createServer() {
    return new Koa().
        use(async (ctx, next) => {
            if (ctx.path !== "/sse") {
                return await next();
            }

            ctx.request.socket.setTimeout(0);
            ctx.req.socket.setNoDelay(true);
            ctx.req.socket.setKeepAlive(true);

            ctx.set({
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            });

            const stream = new PassThrough();

            ctx.status = 200;
            ctx.body = stream;

            const theme = getTheme()

            const sft = await generateSFTJson(theme, false)

            const res = {
                type: 'update',
                time: Date.now(),
                data: sft
            }

            stream.write(JSON.stringify(res))

            chokidar.watch(workingDir).on('change', async () => {
                const theme = getTheme()

                const sft = await generateSFTJson(theme, false)

                const res = {
                    type: 'update',
                    time: Date.now(),
                    data: sft
                }

                stream.write(JSON.stringify(res))
            })

        })
        .use(ctx => {
            ctx.status = 200;
            ctx.body = "ok";
        }).listen(4590, () => console.log("Server started"))

}


main()