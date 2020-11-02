module.exports = {
  type: "service_account",
  project_id: "lilac2-6e1f1",
  private_key_id: "768b412444fc07591af55ab79dc49f725c4bdf9b",
  private_key: `-----BEGIN PRIVATE KEY-----\n${process.env.DB_PRIVATE_KEY}-----END PRIVATE KEY-----\n`,
  client_email: "firebase-adminsdk-2u9dn@lilac2-6e1f1.iam.gserviceaccount.com",
  client_id: "111560415112216331097",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-2u9dn%40lilac2-6e1f1.iam.gserviceaccount.com"
}
