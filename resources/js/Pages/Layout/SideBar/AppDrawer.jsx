import React, { memo, useMemo } from "react";

import { Stack } from "@mui/material";

import SideMenu from "./SideMenu";
import MenuButton from "./MenuButton";
import { usePage } from "@inertiajs/react";
import { menuData } from "../../../constants/constants";

function AppDrawer() {
    // const theme = useTheme();
    const { auth } = usePage().props;
    const memmorizedMenu = useMemo(() => menuData, []);
    const cachedAuth = useMemo(() => auth, []);

    return (
        <Stack
            direction="column"
            sx={{
                alignItems: "center",
                // backgroundColor: theme.palette.secondary.main,
                // color: "#fff",
                display: "block",
                flexDirection: "column",
            }}
        >
            {memmorizedMenu.map((menu, index) =>
                cachedAuth.permissions.includes(menu.label) && menu.menus ? (
                    <SideMenu menu={menu} auth={cachedAuth} key={index} />
                ) : (
                    <MenuButton
                        Icon={menu.icon}
                        label={menu.label}
                        key={index}
                    />
                )
            )}
        </Stack>
    );
}

export default memo(AppDrawer);
