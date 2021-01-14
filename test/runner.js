const Acl        = require("../"),
    {expect}     = require("chai"),
    tests        = require("./tests"),
    backendTests = require("./backendtests");

describe("MongoDB - Default", () => {
    before(function (done) {
        const self = this,
            mongodb = require("mongodb");

        mongodb.connect("mongodb://localhost:27017/acltest", { useUnifiedTopology: true },(error, client) => {
            expect(error).to.be.null;
            const db = client.db("acltest");
            db.dropDatabase(() => {
                self.backend = new Acl.mongodbBackend(db, "acl");
                done();
            });
        });
    });

    run();
});


describe("MongoDB - useSingle", () => {
    before(function (done) {
        const self = this,
            mongodb = require("mongodb");

        mongodb.connect("mongodb://localhost:27017/acltest", { useUnifiedTopology: true },(error, client) => {
            expect(error).to.be.null;
            const db = client.db("acltest");
            db.dropDatabase(() => {
                self.backend = new Acl.mongodbBackend(db, "acl", true);
                done();
            });
        });
    });

    run();
});

describe("Redis", () => {
    before(function (done) {
        const self = this,
            options = {
                host: "127.0.0.1",
                port: 6379,
                password: null,
            },
            Redis = require("redis");


        const redis = Redis.createClient(options.port, options.host,  {no_ready_check: true} );

        function start(){
            self.backend = new Acl.redisBackend(redis);
            done();
        }

        if (options.password) {
            redis.auth(options.password, start);
        } else {
            start();
        }
    });

    run();
});


describe("Memory", () => {
    before(function () {
        const self = this;
        self.backend = new Acl.memoryBackend();
    });

    run();
});

function run() {
    Object.keys(tests).forEach((test) => {
        tests[test]();
    });

    Object.keys(backendTests).forEach((test) => {
        backendTests[test]();
    });
}
