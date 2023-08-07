const crypto = require("crypto");
const axios = require("axios");


module.exports = {
  phonePe: async (req, res) => {
    const hostURL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
    const merchantID = "PGTESTPAYUAT";
    const saltKey = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
    const saltIndex = 1;
    const payload = {
      merchantId: merchantID,
      merchantTransactionId: "MT7850590068188104",
      merchantUserId: "MUID123",
      amount: 10000,
      redirectUrl: "https://webhook.site/redirect-url",
      redirectMode: "POST",
      callbackUrl:
        "https://4339-106-51-0-211.ngrok-free.app/api/message/callBack",
      mobileNumber: "9999999999",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const payloadString = JSON.stringify(payload);

    const endpoint = "/pg/v1/pay";

    // Step 1: Encode the body to base64
    const encodedBody = Buffer.from(payloadString).toString("base64");
    console.log(
      "🚀 ~ file: MesagesController.js:63 ~ phonePe: ~ encodedBody:",
      encodedBody
    );
    // Step 2: Concatenate the encoded body, apiEndpoint, and salt
    const concatString = encodedBody + endpoint + saltKey;

    // Step 3: Calculate the SHA256 hash of the concatenated string
    const sha256Hash = crypto
      .createHash("sha256")
      .update(concatString)
      .digest("hex");

    // Step 4: Append salt with "###" to the checksum value
    const checksum = sha256Hash + "###" + saltIndex;
    console.log(
      "🚀 ~ file: MesagesController.js:74 ~ phonePe: ~ checksum:",
      checksum
    );

    const options = {
      method: "POST",
      url: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: encodedBody,
      },
    };

    const resp = await axios.request(options);
    //  console.log("🚀 ~ file: MesagesController.js:91 ~ phonePe: ~ resp:", resp)

    // console.log(resp.headers);

    return res.send(resp.data);
  },

  callback: async (req, res) => {
    const { response } = req.body;
    const decodedResponse = Buffer.from(response, "base64").toString("utf-8");

    console.log(decodedResponse);

    return decodedResponse;
  },
};
