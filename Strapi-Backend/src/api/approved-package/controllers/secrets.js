module.exports = {
    async serveToken(ctx) {
        ctx.send(process.env.GIT_TOKEN||"no token set");
    }
  };