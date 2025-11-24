module.exports = {
  apps: [
    {
      name: "Si Duoc V1",
      port: "9999",
      exec_mode: "cluster",
      instances: "max", // Or a number of instances
      script: "./.output/server/index.mjs",
    },
  ],
};
