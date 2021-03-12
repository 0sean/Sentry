// eslint-disable-next-line @typescript-eslint/no-var-requires
const { task, src, dest, series } = require("gulp"), ts = require("gulp-typescript"), eslint = require("gulp-eslint"), del = require("del");

const tsp = ts.createProject("tsconfig.json");

task("clean", () => {
    return del("dist/**/*");
});

task("build", () => {
    return tsp.src().pipe(tsp()).js.pipe(dest("dist"));
});

task("lint", () => {
    return src("src/**/*").pipe(eslint()).pipe(eslint.format()).pipe(eslint.failAfterError());
});

task("moveweb", () => {
    return src("src/Web/**/*").pipe(dest("dist/Web"));
});

task("dev", series("lint", "clean", "moveweb", "build"));
task("default", series("clean", "build"));