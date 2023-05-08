export type ThemeType = {
    name?: string;
    version?: string;
    description?: string;
    author?: string;
    repository?: string;
    minimumCiderVersion?: string;
    tags?: string[];
    isPack?: boolean;
    styles?: StyleType[];
};

export type StyleType = {
    identifier?: string;
    name?: string;
    description?: string;
    fileName?: string;
    cfg?: StyleConfigType;
};
export type StyleConfigType = {
    vibrancy?: "mica" | "tabbed" | "none";
    allowCustomAccent?: boolean;
    allowCustomTint?: boolean;
    layoutType?: "mojave" | "mavericks";
    editorialLayout?: boolean;
    useAdaptiveColors?: boolean;
    layoutView?: "HHh LpR FFf" | "HHh LpR lFf" | "lHh LpR FFf" | "lHh LpR lFf";
    appearance?: "system" | "light" | "dark";
    chromeTopWidget?: "none" | "tabs" | "search";
};