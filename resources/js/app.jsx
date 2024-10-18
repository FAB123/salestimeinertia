import React from "react";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";

import AppLayout from "./Pages/Layout/AppLayout";
import "./i18n";

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        let page = pages[`./Pages/${name}.jsx`];

        page.default.layout = name.startsWith("Screens/Login/")
            ? undefined
            : (page) => <AppLayout children={page} />;

        return page;
    },

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
