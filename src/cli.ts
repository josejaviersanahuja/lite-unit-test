import { stdout as output } from "node:process";

type ConsoleColor = 31 | 32 | 33 | 34 | 35 | 36 | 37;

class CliForTests {
  produceTestReport(
    limit: number,
    successes: number,
    errors: { name: string; error: string }[]
  ) {
    // datos para el titulo formateado en consola
    const testStatsObject = {
      "Total tests": limit.toString(),
      Pass: successes.toString(),
      Fail: errors.length.toString(),
    };
    // if there are errors print them in red
    if (errors.length > 0) {
      const failedTestsObject: { [key: string]: string } = {};
      errors.forEach((e) => {
        failedTestsObject[e.name] = e.error;
      });
      this.renderErrorDetails("BEGIN ERROR DETAILS", failedTestsObject);
    }
    this.renderObjectStyle("BEGIN TEST REPORT", testStatsObject, 32);
    // end the test
    this.renderObjectStyle("END OF TESTS", {});
    // for integration tests, exit the app
    process.exit(0);
  }

  private renderErrorDetails(title: string, errors: { [key: string]: string }) {
    // CLI FORMAT Helpers
    this.horizontalLine();
    this.centered(title);
    this.horizontalLine();
    // cli.verticalSpace()

    // Show each command, followed by its explination
    Object.keys(errors).forEach((e) => {
      let line = "\x1b[31m" + e + "\x1b[0m: ";

      line += errors[e];
      console.log(line);
      this.verticalSpace();
    });
  }

  private renderObjectStyle(
    title: string,
    obj: { [key: string]: string },
    color: ConsoleColor = 33
  ) {
    // CLI FORMAT Helpers
    this.horizontalLine();
    this.centered(title);
    this.horizontalLine();
    // cli.verticalSpace()

    // Show each command, followed by its explination
    Object.keys(obj).forEach((e) => {
      let line =
        e === "Fail"
          ? "\x1b[31m" + e + "\x1b[0m"
          : `\x1b[${color}m` + e + "\x1b[0m";

      const value = obj[e];
      const padding = 75 - line.length;
      for (let i = 0; i < padding; i++) {
        line += " ";
      }
      line += value;
      console.log(line);
      // cli.verticalSpace()
    });
  }

  private horizontalLine() {
    const width = output.columns;

    let line = "";
    for (let i = 0; i < width; i++) {
      line += "-";
    }
    console.log(line);
  }

  private centered(title: string) {
    title = typeof title === "string" && title.length > 0 ? title.trim() : "";

    // get the width
    const width = output.columns;

    // calculate de left padding
    const leftPadding = Math.floor((width - title.length) / 2);
    let line = "";
    for (let i = 0; i < leftPadding; i++) {
      line += " ";
    }
    line += title;
    console.log(line);
  }

  private verticalSpace(lines = 1) {
    lines = lines > 0 ? lines : 1;
    for (let i = 0; i < lines; i++) {
      console.log("");
    }
  }
}

export default new CliForTests();
