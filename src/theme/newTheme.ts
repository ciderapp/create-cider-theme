#! /usr/bin/env node
import { themeQuestion } from "./themeQuestion.js";
import { ThemeType } from "./themeTypes";

const theme = await themeQuestion();

console.log(theme);
function convertToTOML(theme: ThemeType) {
    // TODO: convert JSON to TOML
}