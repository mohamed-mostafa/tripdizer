var cron = require('cron');
var requestsBusiness = require('../../business/hws_requests_business');

var cronJob = cron.job("0 0 */1 * *", function () {
    requestsBusiness.sendDailyReportOfRequestsCount();
});
cronJob.start();