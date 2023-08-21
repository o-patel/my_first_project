
var my_key="oOLUKkg4Lcl4a8WvPe47czhmhOxeprp8SKN6WdACdl+LDpnJjjoTcC/6CtuF/5Vi2idkOZDNMkGHPkV9+9btskrRMHHLEWzBTguItCCf+vtZIUkmVq8wSIHjrotKVi9F"

var autoEncryptionOpts = {
  "keyVaultNamespace" : "encryption.__dataKeys",
  "kmsProviders" : {
    "local" : {
      "key" : BinData(0, "OT8XwAVGZvPLsmEKrmddkznOM/Go+JnQ/soytxX7kCNQCI95ulQIMUTP0cYEjjZnHmnyNBQkvlOd+hSxyNySwBvnU2q90sRg9i7ORQ4Z70hQlNLPZMZPRzPVBD5IzZoZ")
    }
  }
}

var csfleDatabaseConnection = Mongo(
  "mongodb://localhost:27017/",
  autoEncryptionOpts
)
var keyVault = csfleDatabaseConnection.getKeyVault();

keyVault.createKey(
  "local",
  [ "www" ]
)
