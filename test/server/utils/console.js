module.exports.logMocked = function (fn) {
    var oldConsoleLog = console.log;
    console.log = function() {};
    fn();
    console.log = oldConsoleLog;
};
