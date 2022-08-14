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

npmPackagr({
    pipeline: [
        ({ exec, packageDirectory }) => {
            exec(`tsc --outDir ${packageDirectory}`);
        },

        ({ rm }) => rm("-rf", "test"),

        test(),

        badge(BadgeType.Test),
        badge(BadgeType.License),

        version("prerelease", {
            commitHooks: false,
            gitTagVersion: false,
        }),

        packageJSON(packageJson => {
            const dependencies = packageJson.devDependencies!;

            packageJson.dependencies = {
                "logical-not": dependencies["logical-not"],
                "value-accessor": dependencies["value-accessor"],
            };

            delete packageJson.devDependencies;
            delete packageJson.scripts;
        }),

        assets("LICENSE", "README.md"),

        git("commit", require("./package.json").name),
        git("push"),

        publish({
            login: {
                account: "observable.lib",
                email: "observable.lib@gmail.com",
            },
        }),
    ],
});
