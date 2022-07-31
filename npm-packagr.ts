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

let packageName = "";

npmPackagr({
    pipeline: [
        packageJSON(packageJson => {
            packageName = packageJson.name!;

            const dependencies = packageJson.devDependencies!;

            packageJson.dependencies = {
                "logical-not": dependencies["logical-not"],
                "value-accessor": dependencies["value-accessor"],
            };

            delete packageJson.devDependencies;
            delete packageJson.scripts;
        }),

        git("commit", packageName),

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

        git("commit", packageName),
        git("push"),

        publish({
            login: {
                account: "observable.lib",
                email: "observable.lib@gmail.com",
            },
        }),
    ],
});
