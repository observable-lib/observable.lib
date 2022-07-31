import { npmPackagr } from "npm-packagr";
import {
    assets,
    badge,
    BadgeType,
    git,
    packageJSON,
    publish,
    test,
    version,
} from "npm-packagr/pipes";

const message = require("./package.json").name;

npmPackagr({
    pipeline: [
        packageJSON(packageJson => {
            const dependencies = packageJson.devDependencies!;

            packageJson.dependencies = {
                "logical-not": dependencies["logical-not"],
                "value-accessor": dependencies["value-accessor"],
            };

            delete packageJson.devDependencies;
            delete packageJson.scripts;
        }),

        git("commit", message),

        ({ exec, packageDirectory }) => {
            exec(`tsc --outDir ${packageDirectory}`);
        },

        test(),

        badge(BadgeType.Test),
        badge(BadgeType.License),

        version("prerelease", {
            commitHooks: false,
            gitTagVersion: false,
        }),

        assets("LICENSE", "README.md"),

        git("commit", message),
        git("push"),

        publish({
            login: {
                account: "observable.lib",
                email: "observable.lib@gmail.com",
            },
        }),
    ],
});
