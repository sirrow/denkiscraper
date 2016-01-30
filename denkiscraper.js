/**
 * Created by sirrow on 16/01/20.
 */

var argv = require("minimist")(process.argv.slice(2));

if(!argv.u || !argv.p){
    console.log(process.argv[1] + ' -u [userid] -p [password]');
    return 0;
}

var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var driver = new webdriver.Builder().forBrowser('phantomjs').usingServer('http://localhost:8910').build();
var powerdata;

driver.get("https://www.kakeibo.tepco.co.jp/dk/aut/login/");
driver.findElement(By.name('id')).sendKeys(argv.u);
driver.findElement(By.name('password')).sendKeys(argv.p);
driver.findElement(By.id('idLogin')).click();

driver.findElement(By.id('idNotEmptyImg_contents01.jpg')).click();
driver.findElement(By.id('bt_time_view.jpg')).click();

for(i=0; i<30; i++) {
    driver.getPageSource().then(function (pageSource) {
        var lines = pageSource.split('\n');
        lines.forEach(function (line) {
            if (line.indexOf('var items = [["日次",') != -1) {
                eval(line);
                powerdata = items[0];
            }
            if (line.indexOf('の電気使用量') != -1) {
                var pattern = /20\d\d\/\d\d\/\d\d/i;
                result = line.match(pattern);

                process.stdout.write(result[0] + ',');
            }
        });
        powerdata.forEach(function (elem) {
            process.stdout.write(elem + ',');
        });
        process.stdout.write('\n');
    });
    driver.findElement(By.id('doPrevious')).click();
}
driver.quit();

