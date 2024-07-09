process.env.HTTPS = "true";
process.env.SSL_CRT_FILE =
  "/Users/wildfly-30.0.1.Final/standalone/configuration/AORFP_cert.crt";
process.env.SSL_KEY_FILE =
  "/Users/wildfly-30.0.1.Final/standalone/configuration/AORFP_private_key.pem";

require("react-scripts/scripts/start");