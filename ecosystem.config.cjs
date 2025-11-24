module.exports = {
  apps: [
    {
      name: "siduoc",
      port: "9999",
      exec_mode: "cluster",
      instances: "max", // Or a number of instances
      script: "./.output/server/index.mjs",
    },
  ],
};
