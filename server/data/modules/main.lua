local nk = require("nakama")

nk.logger.info("Hello, world!")

nk.run_once(function()
    nk.logger.info("THIS SHOULD ONLY RUN ONCE")
end)



